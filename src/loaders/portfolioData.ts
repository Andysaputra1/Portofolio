import experienceProject0 from "../images/experience-project/ess-polytron.webp";
import experienceProject1 from "../images/experience-project/scm-polytron.webp";
import experienceProject2 from "../images/experience-project/qms-polytron.webp";
import experienceProject3 from "../images/experience-project/ats-polytron.webp";
import experienceProject4 from "../images/experience-project/landingpage-qreedai.webp";
import experienceProject5 from "../images/experience-project/generate-qreedai.webp";
import rawOrganizations from "../data/organization.json";
import rawProjects from "../data/projects.json";
import imgPortfolio from "../images/projectPhotos/portofolio.webp";
import imgExplore from "../images/projectPhotos/ExploreId.webp";
import imgDiabetes from "../images/projectPhotos/DiebetyAi.webp";
import imgScolio from "../images/projectPhotos/ScolioCheck.webp";
import imgReservasi from "../images/projectPhotos/reservasi-id.webp";
import imgMushroom from "../images/projectPhotos/mushroom-vision.webp";
import imgSilentTerror from "../images/projectPhotos/SilentTerror.webp";
import imgAiTrainer from "../images/projectPhotos/ai-trainer.webp";
import imgMyInvitation from "../images/projectPhotos/myinivtation.webp";
import polytronPhoto from "../images/experience/polytron_applicationDeveloper.webp";
import freshmenPhoto from "../images/experience/freshman_leader.webp";
import binusTvPhoto from "../images/experience/binus_tv_club.webp";
import tfiPhoto from "../images/experience/tfi.webp";
import type { OrgExp, Project } from "../types/portfolio";

export const builtInImages: Record<string, string> = {
  "silent-terror": imgSilentTerror,
  "ai-trainer": imgAiTrainer,
  "my-invitation": imgMyInvitation,
  portfolio: imgPortfolio,
  explore: imgExplore,
  diabetes: imgDiabetes,
  scolio: imgScolio,
  reservasi: imgReservasi,
  "mushroom-vision": imgMushroom,
};

export const projects: Project[] = (rawProjects as Project[]).map((project) => ({
  ...project,
  image: builtInImages[project.image ?? ""] ?? project.image,
}));

export const experienceProjectImages: Record<string, string> = { "ess-polytron": experienceProject0, "scm-polytron": experienceProject1, "qms-polytron": experienceProject2, "ats-polytron": experienceProject3, "landingpage-qreedai": experienceProject4, "generate-qreedai": experienceProject5 };
export const experienceImages: Record<string, string> = { polytron: polytronPhoto, freshmen: freshmenPhoto, 'binus-tv': binusTvPhoto, tfi: tfiPhoto };
export const orgExperiences: OrgExp[] = (rawOrganizations as OrgExp[]).map((item) => ({
  ...item, image: experienceImages[item.image ?? ''] ?? item.image,
  projects: item.projects?.map((project) => ({ ...project, image: experienceProjectImages[project.image ?? ''] ?? project.image })),
}));
