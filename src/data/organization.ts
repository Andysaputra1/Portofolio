export type OrgSubRole = {
  title: string;           // nama peran (mis. Technical Advisor)
  context?: string;        // keterangan di dalam kurung (opsional)
  bullets: string[];       // butir tanggung jawab
};

export type OrgExp = {
  id: number;
  role?: string;           // peran utama (kalau ada)
  org: string;             // nama organisasi
  location?: string;       // lokasi (opsional)
  period: string;          // periode
  summary?: string;        // ringkasan singkat
  roles?: OrgSubRole[];    // daftar sub-role (opsional)
};

export const orgExperiences: OrgExp[] = [
  {
    id: 1,
    role: "Freshmen Leader",
    org: "Alam Sutera",
    period: "Aug 2025 – Sep 2025",
    summary:
      "Guided first-year students to adapt to university life, introducing Binusian values and mentoring with direction, encouragement, and practical advice for a smooth transition.",
  },
  {
    id: 2,
    org: "BINUS TV Club – Alam Sutera",
    period: "Aug 2023 – Dec 2025",
    summary:
      "Contributed as core activist and lead technical advisor; hands-on in technical direction, cross-functional coordination, and end-to-end post-production for large student initiatives.",
    roles: [
      {
        title: "Technical Advisor – Core Development",
        context:
          "(PSA, Media Journey, Glimpse of BINUSTV Club, Buram EXPO, LDKA)",
        bullets: [
          "Provided technical mentorship and best practices to new activists, growing their problem-solving skills and confidence.",
          "Monitored and supported technical execution of internal projects/events with hands-on help and constructive feedback.",
        ],
      },
      {
        title: "Technical Coordinator",
        context: "(Buram EXPO)",
        bullets: [
          "Managed technical crew for setup & equipment to ensure optimal performance and on-time execution.",
          "Handled cross-divisional communication and resolved on-site issues for smooth operations.",
        ],
      },
      {
        title: "Technical Crew",
        context:
          "(Pengabdian kepada Masyarakat, Public Service Announcement, Express Reels Excellence, LDKA)",
        bullets: [
          "Assisted preparation and setup of equipment to meet event requirements.",
          "Ensured optimal operation of tools and supported successful event execution.",
        ],
      },
      {
        title: "Editor",
        context: "(Public Service Announcement, Uni-Verse Diaries)",
        bullets: [
          "Owned end-to-end editing (visual, audio, post) from raw to final output.",
          "Maintained consistency, quality, and alignment with event themes.",
        ],
      },
    ],
  },
  {
    id: 3,
    org: "Church Community GMS – Alam Sutera",
    period: "Dec 2023 – Present",
    summary:
      "Young emerging leader: served as Project Director for youth events; also vice leader in a cell group to coordinate and care for members.",
    roles: [
      {
        title: "Project Director",
        context: "(Reignate, Impact)",
        bullets: [
          "Led end-to-end planning & execution; aligned programs with core concepts and oversaw cross-department coordination.",
          "Built and guided a cross-functional leadership team (appointing division leads, defining roles, and aligning execution).",
        ],
      },
    ],
  },
  {
    id: 4,
    org: "BINUSIAN BASKETBALL – Alam Sutera",
    period: "Aug 2024 – Dec 2025",
    summary:
      "Creative & Fun Division: focused on digitalization and design; produced design assets for programs & social media; led communication for the creative/design team.",
  },
  {
    id: 5,
    role: "Volunteer",
    org: "Teach For Indonesia – Alam Sutera",
    period: "Aug 2023 – Dec 2024",
    summary:
      "Committed to social causes—awareness on anti-corruption and marine environment protection through waste observation initiatives.",
    roles: [
      {
        title: "Community Programs",
        bullets: [
          "Raised awareness about anti-corruption in Indonesia.",
          "Contributed to marine protection through waste-observation activities.",
        ],
      },
    ],
  },
  {
    id: 6,
    org: "Student Representative Council (MPK) – Batam",
    period: "Aug 2022 – Dec 2022",
    role:
      "Project Director (OSIS Election SMAS Pelita Utama 2022, Christmas Dinner)",
    roles: [
      {
        title: "Event Leadership",
        bullets: [
          "Planned & executed OSIS Election and Christmas Dinner, ensuring alignment with school values and goals.",
          "Managed cross-functional teams, delegated tasks, and tracked timelines for impactful student-led initiatives.",
        ],
      },
    ],
  },
];
