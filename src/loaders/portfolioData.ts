import rawOrganizations from "../data/organization.json";
import rawProjects from "../data/projects.json";
import imgPortfolio from "../images/projectPhotos/AndySaputraPortofolio.png";
import imgExplore from "../images/projectPhotos/ExploreId.png";
import imgDiabetes from "../images/projectPhotos/DiebetyAi.png";
import imgScolio from "../images/projectPhotos/ScolioCheck.png";
import imgReservasi from "../images/projectPhotos/image.png";
import type { OrgExp, Project } from "../types/portfolio";

const builtInImages: Record<string, string> = {
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

export const orgExperiences = rawOrganizations as OrgExp[];
