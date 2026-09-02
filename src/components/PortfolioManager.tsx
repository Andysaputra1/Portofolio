import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { createPortal } from "react-dom";
import type { OrgExp, Project, Skill } from "../types/portfolio";
import { usePortfolioData } from "../context/PortfolioDataContext";

type Tab = "projects" | "organizations" | "skills" | "cv";

const emptyProject = { title: "", tag: "Personal Project", stack: "", link: "", image: "", description: "" };
const emptyOrganization = { role: "", org: "", location: "", period: "", summary: "", subRole: "", context: "", bullets: "" };
const emptySkill = { name: "", group: "Web Development" as Skill["group"], image: "" };
const COMPRESS_THRESHOLD = 50 * 1024 * 1024;

async function compressLargeImage(file: File) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Foto tidak dapat dibaca browser."));
      element.src = objectUrl;
    });
    let width = image.naturalWidth;
    let height = image.naturalHeight;
    const maxSide = 2560;
    const initialScale = Math.min(1, maxSide / Math.max(width, height));
    width = Math.max(1, Math.round(width * initialScale));
    height = Math.max(1, Math.round(height * initialScale));
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Kompresi foto tidak didukung browser ini.");

    let quality = 0.84;
    let result = "";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      result = canvas.toDataURL("image/jpeg", quality);
      if (result.length <= COMPRESS_THRESHOLD || attempt === 4) break;
      quality = Math.max(0.45, quality - 0.12);
      width = Math.max(1, Math.round(width * 0.8));
      height = Math.max(1, Math.round(height * 0.8));
    }
    return result;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function safeId(value: string) {
  return `${value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "item"}-${Date.now()}`;
}

function download(filename: string, contents: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/typescript;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function extractItems(raw: string, collection: "projects" | "orgExperiences") {
  const declaration = new RegExp(`(?:export\\s+)?const\\s+${collection}(?:\\s*:[^=]+)?\\s*=`).exec(raw);
  if (!declaration) throw new Error(`Variabel ${collection} tidak ditemukan.`);
  const start = raw.indexOf("[", declaration.index + declaration[0].length);
  const end = raw.lastIndexOf("]");
  if (start === -1 || end < start) throw new Error("Data array tidak valid.");
  const parsed: unknown = JSON.parse(raw.slice(start, end + 1));
  if (!Array.isArray(parsed)) throw new Error("Data harus berupa array.");
  return parsed;
}

export default function PortfolioManager({ standalone = false }: { standalone?: boolean }) {
  const { projects, organizations, skills, addProject, updateProject, removeProject, moveProject, addOrganization, updateOrganization, removeOrganization, moveOrganization, replaceProjects, replaceOrganizations, addSkill, updateSkill, removeSkill, moveSkill, replaceSkills, cvUrl, cvName, replaceCv } = usePortfolioData();
  const [isOpen, setIsOpen] = useState(standalone);
  const [tab, setTab] = useState<Tab>("projects");
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [organizationForm, setOrganizationForm] = useState(emptyOrganization);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [notice, setNotice] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingOrganizationId, setEditingOrganizationId] = useState<number | null>(null);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);
  const closePanel = useCallback(() => {
    if (standalone) {
      window.location.assign("/");
      return;
    }
    setIsOpen(false);
  }, [standalone]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && closePanel();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closePanel, isOpen]);

  const onProjectChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProjectForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };
  const onOrganizationChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOrganizationForm((form) => ({ ...form, [event.target.name]: event.target.value }));
  };
  const onSkillChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSkillForm((form) => ({ ...form, [event.target.name]: event.target.value } as typeof emptySkill));
  };
  const onProjectPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const photo = event.target.files?.[0];
    if (!photo) return;
    if (!photo.type.startsWith("image/")) {
      setNotice("Pilih file gambar (JPG, PNG, WebP, dan sejenisnya).");
      event.target.value = "";
      return;
    }
    if (photo.size > COMPRESS_THRESHOLD) {
      setNotice("Foto di atas 50 MB sedang dikompres sebelum disimpan…");
      try {
        const compressed = await compressLargeImage(photo);
        setProjectForm((form) => ({ ...form, image: compressed }));
        setNotice("Foto berhasil dikompres dan siap digunakan.");
      } catch (error) {
        setNotice(error instanceof Error ? error.message : "Foto gagal dikompres.");
      } finally {
        event.target.value = "";
      }
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setProjectForm((form) => ({ ...form, image: String(reader.result) }));
    reader.readAsDataURL(photo);
  };
  const onCvChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setNotice("Pilih file berformat PDF.");
      event.target.value = "";
      return;
    }
    replaceCv(file);
    setNotice(`${file.name} sekarang menjadi CV aktif. Unduh dan ganti file asset untuk menyimpannya setelah restart.`);
    event.target.value = "";
  };
  const startProjectEdit = (project: Project) => {
    setProjectForm({ title: project.title, tag: project.tag, stack: project.stack, link: project.link, image: project.image ?? "", description: project.description });
    setEditingProjectId(project.id);
    setNotice(`Mengedit ${project.title}.`);
  };
  const startOrganizationEdit = (organization: OrgExp) => {
    const subRole = organization.roles?.[0];
    setOrganizationForm({ role: organization.role ?? "", org: organization.org, location: organization.location ?? "", period: organization.period, summary: organization.summary ?? "", subRole: subRole?.title ?? "", context: subRole?.context ?? "", bullets: subRole?.bullets.join("\n") ?? "" });
    setEditingOrganizationId(organization.id);
    setNotice(`Mengedit ${organization.org}.`);
  };
  const startSkillEdit = (skill: Skill) => {
    setSkillForm({ name: skill.name, group: skill.group, image: skill.image ?? "" });
    setEditingSkillId(skill.id);
    setNotice(`Mengedit ${skill.name}.`);
  };

  const submitProject = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const project: Project = {
      id: editingProjectId ?? safeId(projectForm.title), title: projectForm.title.trim(), tag: projectForm.tag.trim(),
      stack: projectForm.stack.trim(), link: projectForm.link.trim(), image: projectForm.image.trim() || undefined,
      description: projectForm.description.trim(),
    };
    if (editingProjectId) updateProject(project); else addProject(project);
    setProjectForm(emptyProject);
    setEditingProjectId(null);
    setNotice(`Project ${editingProjectId ? "diperbarui" : "ditambahkan"}. Unduh file agar perubahan bisa digunakan lagi setelah refresh.`);
  };

  const submitOrganization = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bullets = organizationForm.bullets.split("\n").map((item) => item.trim()).filter(Boolean);
    const organization: OrgExp = {
      id: editingOrganizationId ?? Date.now(), role: organizationForm.role.trim() || undefined, org: organizationForm.org.trim(),
      location: organizationForm.location.trim() || undefined, period: organizationForm.period.trim(),
      summary: organizationForm.summary.trim() || undefined,
      roles: organizationForm.subRole.trim() ? [{ title: organizationForm.subRole.trim(), context: organizationForm.context.trim() || undefined, bullets }] : undefined,
    };
    if (editingOrganizationId) updateOrganization(organization); else addOrganization(organization);
    setOrganizationForm(emptyOrganization);
    setEditingOrganizationId(null);
    setNotice(`Experience ${editingOrganizationId ? "diperbarui" : "ditambahkan"}. Unduh file agar perubahan bisa digunakan lagi setelah refresh.`);
  };
  const submitSkill = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const skill: Skill = { id: editingSkillId ?? safeId(skillForm.name), name: skillForm.name.trim(), group: skillForm.group, image: skillForm.image.trim() || undefined };
    if (editingSkillId) updateSkill(skill); else addSkill(skill);
    setSkillForm(emptySkill);
    setEditingSkillId(null);
    setNotice(`Skill ${editingSkillId ? "diperbarui" : "ditambahkan"}. Unduh file JSON agar perubahan bisa digunakan lagi setelah refresh.`);
  };

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = await file.text();
      if (tab === "projects") {
        const items = (raw.trim().startsWith("[") ? JSON.parse(raw) : extractItems(raw, "projects")) as Project[];
        if (!items.every((item) => item && typeof item.id === "string" && typeof item.title === "string" && typeof item.description === "string")) throw new Error("Format project tidak sesuai.");
        replaceProjects(items);
      } else if (tab === "organizations") {
        const items = (raw.trim().startsWith("[") ? JSON.parse(raw) : extractItems(raw, "orgExperiences")) as OrgExp[];
        if (!items.every((item) => item && typeof item.id === "number" && typeof item.org === "string" && typeof item.period === "string")) throw new Error("Format organization tidak sesuai.");
        replaceOrganizations(items);
      } else {
        const items = JSON.parse(raw) as Skill[];
        if (!Array.isArray(items) || !items.every((item) => item && typeof item.id === "string" && typeof item.name === "string" && (item.group === "Web Development" || item.group === "Programming Languages & Database"))) throw new Error("Format skills tidak sesuai.");
        replaceSkills(items);
      }
      setNotice(`${file.name} berhasil dimuat.`);
    } catch (error) {
      setNotice(error instanceof Error ? `Gagal mengimpor: ${error.message}` : "Gagal mengimpor file.");
    } finally {
      event.target.value = "";
    }
  };

  const openImport = () => fileInput.current?.click();
  const currentName = tab === "projects" ? "projects.json" : tab === "organizations" ? "organization.json" : "skills.json";
  const currentItems = tab === "projects" ? projects : tab === "organizations" ? organizations : skills;

  return (
    <>
      {!standalone && <button type="button" className="manager-fab" onClick={() => setIsOpen(true)} aria-label="Open portfolio manager">
        <i className="fa-solid fa-pen-to-square" aria-hidden="true" /> <span>Manage</span>
      </button>}
      {isOpen && createPortal(
        <div className="manager-backdrop" role="presentation" onMouseDown={closePanel}>
          <section className="manager-panel" role="dialog" aria-modal="true" aria-labelledby="manager-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="manager-header">
              <div><p className="manager-eyebrow">Portfolio editor</p><h2 id="manager-title">Manage your work</h2></div>
              <button className="manager-close" type="button" onClick={closePanel} aria-label="Close manager"><i className={`fa-solid ${standalone ? "fa-arrow-left" : "fa-xmark"}`} /></button>
            </header>
            <p className="manager-intro">Data di panel ini hanya aktif selama halaman terbuka. Setelah mengubah data, unduh file JSON dan impor kembali setelah refresh atau ganti file di <code>src/data</code>.</p>
            <div className="manager-tabs" role="tablist">
              <button type="button" role="tab" aria-selected={tab === "projects"} className={tab === "projects" ? "is-active" : ""} onClick={() => { setTab("projects"); setNotice(""); }}>Projects <span>{projects.length}</span></button>
              <button type="button" role="tab" aria-selected={tab === "organizations"} className={tab === "organizations" ? "is-active" : ""} onClick={() => { setTab("organizations"); setNotice(""); }}>Experience <span>{organizations.length}</span></button>
              <button type="button" role="tab" aria-selected={tab === "skills"} className={tab === "skills" ? "is-active" : ""} onClick={() => { setTab("skills"); setNotice(""); }}>Skills <span>{skills.length}</span></button>
              <button type="button" role="tab" aria-selected={tab === "cv"} className={tab === "cv" ? "is-active" : ""} onClick={() => { setTab("cv"); setNotice(""); }}>CV</button>
            </div>
            {tab === "cv" ? <div className="manager-toolbar">
              <button type="button" className="manager-action" onClick={() => cvInput.current?.click()}><i className="fa-solid fa-file-arrow-up" /> Replace CV PDF</button>
              <a className="manager-action secondary" href={cvUrl} download={cvName}><i className="fa-solid fa-download" /> Download active CV</a>
              <input ref={cvInput} type="file" accept="application/pdf,.pdf" onChange={onCvChange} hidden />
            </div> : <div className="manager-toolbar">
              <button type="button" className="manager-action secondary" onClick={openImport}><i className="fa-solid fa-upload" /> Import {currentName}</button>
              <button type="button" className="manager-action" onClick={() => download(currentName, JSON.stringify(currentItems, null, 2))}><i className="fa-solid fa-download" /> Download {currentName}</button>
              <input ref={fileInput} type="file" accept=".ts,.json,text/typescript,application/json" onChange={importFile} hidden />
            </div>}
            {notice && <p className="manager-notice" role="status">{notice}</p>}
            <div className="manager-content">
              {tab === "projects" ? <>
                <form className="manager-form" onSubmit={submitProject}>
                  <h3>{editingProjectId ? "Edit project" : "Add project"}</h3>
                  <label>Project title<input name="title" value={projectForm.title} onChange={onProjectChange} required /></label>
                  <div className="manager-fields"><label>Category<input name="tag" value={projectForm.tag} onChange={onProjectChange} required /></label><label>Tech stack<input name="stack" value={projectForm.stack} onChange={onProjectChange} required /></label></div>
                  <label>Project link<input name="link" type="url" placeholder="https://..." value={projectForm.link} onChange={onProjectChange} required /></label>
                  <label>Image URL <small>optional</small><input name="image" type="url" placeholder="https://..." value={projectForm.image} onChange={onProjectChange} /></label>
                  <label>Or upload image <small>tanpa batas · di atas 50 MB dikompres otomatis</small><input className="manager-file" type="file" accept="image/*" onChange={onProjectPhotoChange} /></label>
                  {projectForm.image && <img className="manager-image-preview" src={projectForm.image} alt="Project preview" />}
                  <label>Description<textarea name="description" value={projectForm.description} onChange={onProjectChange} required rows={4} /></label>
                  <div className="manager-form-actions"><button className="manager-submit" type="submit">{editingProjectId ? "Save project" : "Add project"}</button>{editingProjectId && <button className="manager-cancel" type="button" onClick={() => { setEditingProjectId(null); setProjectForm(emptyProject); }}>Cancel</button>}</div>
                </form>
                <div className="manager-list" aria-label="Project list">{projects.map((item, index) => <article key={item.id} className="manager-item"><div><strong>{item.title}</strong><span>{item.tag} · {item.stack}</span></div><div className="manager-item-actions"><button type="button" onClick={() => startProjectEdit(item)} aria-label={`Edit ${item.title}`}><i className="fa-solid fa-pen" /></button><button type="button" disabled={index === 0} onClick={() => moveProject(item.id, "up")} aria-label={`Move ${item.title} up`}><i className="fa-solid fa-arrow-up" /></button><button type="button" disabled={index === projects.length - 1} onClick={() => moveProject(item.id, "down")} aria-label={`Move ${item.title} down`}><i className="fa-solid fa-arrow-down" /></button><button type="button" className="delete" onClick={() => { removeProject(item.id); setNotice("Project dihapus dari sesi ini."); }} aria-label={`Delete ${item.title}`}><i className="fa-solid fa-trash" /></button></div></article>)}</div>
              </> : tab === "organizations" ? <>
                <form className="manager-form" onSubmit={submitOrganization}>
                  <h3>{editingOrganizationId ? "Edit experience" : "Add experience"}</h3>
                  <div className="manager-fields"><label>Organization<input name="org" value={organizationForm.org} onChange={onOrganizationChange} required /></label><label>Period<input name="period" placeholder="Jan 2025 – Present" value={organizationForm.period} onChange={onOrganizationChange} required /></label></div>
                  <div className="manager-fields"><label>Role <small>optional</small><input name="role" value={organizationForm.role} onChange={onOrganizationChange} /></label><label>Location <small>optional</small><input name="location" value={organizationForm.location} onChange={onOrganizationChange} /></label></div>
                  <label>Summary <small>optional</small><textarea name="summary" rows={3} value={organizationForm.summary} onChange={onOrganizationChange} /></label>
                  <div className="manager-fields"><label>Sub-role <small>optional</small><input name="subRole" value={organizationForm.subRole} onChange={onOrganizationChange} /></label><label>Context <small>optional</small><input name="context" value={organizationForm.context} onChange={onOrganizationChange} /></label></div>
                  <label>Sub-role bullets <small>one item per line</small><textarea name="bullets" rows={3} value={organizationForm.bullets} onChange={onOrganizationChange} /></label>
                  <div className="manager-form-actions"><button className="manager-submit" type="submit">{editingOrganizationId ? "Save experience" : "Add experience"}</button>{editingOrganizationId && <button className="manager-cancel" type="button" onClick={() => { setEditingOrganizationId(null); setOrganizationForm(emptyOrganization); }}>Cancel</button>}</div>
                </form>
                <div className="manager-list" aria-label="Experience list">{organizations.map((item, index) => <article key={item.id} className="manager-item"><div><strong>{item.role || item.org}</strong><span>{item.role ? `${item.org} · ` : ""}{item.period}</span></div><div className="manager-item-actions"><button type="button" onClick={() => startOrganizationEdit(item)} aria-label={`Edit ${item.org}`}><i className="fa-solid fa-pen" /></button><button type="button" disabled={index === 0} onClick={() => moveOrganization(item.id, "up")} aria-label={`Move ${item.org} up`}><i className="fa-solid fa-arrow-up" /></button><button type="button" disabled={index === organizations.length - 1} onClick={() => moveOrganization(item.id, "down")} aria-label={`Move ${item.org} down`}><i className="fa-solid fa-arrow-down" /></button><button type="button" className="delete" onClick={() => { removeOrganization(item.id); setNotice("Experience dihapus dari sesi ini."); }} aria-label={`Delete ${item.org}`}><i className="fa-solid fa-trash" /></button></div></article>)}</div>
              </> : tab === "skills" ? <>
                <form className="manager-form" onSubmit={submitSkill}>
                  <h3>{editingSkillId ? "Edit skill" : "Add skill"}</h3>
                  <label>Skill name<input name="name" value={skillForm.name} onChange={onSkillChange} required /></label>
                  <label>Category<select name="group" value={skillForm.group} onChange={onSkillChange}><option>Web Development</option><option>Programming Languages &amp; Database</option></select></label>
                  <label>Icon image URL <small>optional</small><input name="image" type="url" placeholder="https://..." value={skillForm.image} onChange={onSkillChange} /></label>
                  <div className="manager-form-actions"><button className="manager-submit" type="submit">{editingSkillId ? "Save skill" : "Add skill"}</button>{editingSkillId && <button className="manager-cancel" type="button" onClick={() => { setEditingSkillId(null); setSkillForm(emptySkill); }}>Cancel</button>}</div>
                </form>
                <div className="manager-list" aria-label="Skills list">{skills.map((item, index) => <article key={item.id} className="manager-item"><div><strong>{item.name}</strong><span>{item.group}</span></div><div className="manager-item-actions"><button type="button" onClick={() => startSkillEdit(item)} aria-label={`Edit ${item.name}`}><i className="fa-solid fa-pen" /></button><button type="button" disabled={index === 0} onClick={() => moveSkill(item.id, "up")} aria-label={`Move ${item.name} up`}><i className="fa-solid fa-arrow-up" /></button><button type="button" disabled={index === skills.length - 1} onClick={() => moveSkill(item.id, "down")} aria-label={`Move ${item.name} down`}><i className="fa-solid fa-arrow-down" /></button><button type="button" className="delete" onClick={() => { removeSkill(item.id); setNotice("Skill dihapus dari sesi ini."); }} aria-label={`Delete ${item.name}`}><i className="fa-solid fa-trash" /></button></div></article>)}</div>
              </> : <section className="manager-form manager-cv-card">
                <h3>Active CV</h3>
                <p>File aktif: <strong>{cvName}</strong></p>
                <iframe className="manager-cv-preview" src={cvUrl} title="Active CV preview" />
                <p className="manager-cv-note">Setelah memilih PDF baru, gunakan tombol download lalu gantikan file CV di folder <code>src/assets</code> sebelum deploy.</p>
              </section>}
            </div>
          </section>
        </div>, document.body)}
    </>
  );
}
