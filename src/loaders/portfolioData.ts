import rawOrganizations from "../data/organization.json";
import rawProjects from "../data/projects.json";
import imgPortfolio from "../images/projectPhotos/AndySaputraPortofolio.png";
import imgExplore from "../images/projectPhotos/ExploreId.png";
import imgDiabetes from "../images/projectPhotos/DiebetyAi.png";
import imgScolio from "../images/projectPhotos/ScolioCheck.png";
import imgReservasi from "../images/projectPhotos/image.png";
import imgSilentTerror from "../images/projectPhotos/SilentTerror.png";
import polytronPhoto from "../images/experience/polytron_applicationDeveloper.png";
import freshmenPhoto from "../images/experience/freshman_leader.png";
import binusTvPhoto from "../images/experience/binus_tv_club.png";
import tfiPhoto from "../images/experience/tfi.png";
import type { OrgExp, Project } from "../types/portfolio";

export const builtInImages: Record<string, string> = {
  "silent-terror": imgSilentTerror,
  portfolio: imgPortfolio,
  explore: imgExplore,
  diabetes: imgDiabetes,
  scolio: imgScolio,
  reservasi: imgReservasi,
};

export const projects: Project[] = (rawProjects as Project[]).map((project) => ({
  ...project,
  image: builtInImages[project.image ?? ""] ?? project.image,
}));

export const experienceImages: Record<string, string> = { polytron: polytronPhoto, freshmen: freshmenPhoto, 'binus-tv': binusTvPhoto, tfi: tfiPhoto };
export const orgExperiences: OrgExp[] = (rawOrganizations as OrgExp[]).map((item) => ({
  ...item, image: experienceImages[item.image ?? ''] ?? item.image,
}));
