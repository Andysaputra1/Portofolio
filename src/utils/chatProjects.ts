import type { Project } from '../types/portfolio';

const words = (value: string) => value
  .replace(/([a-z])([A-Z])/g, '$1 $2')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

// Only attach local portfolio assets for projects explicitly named in the answer.
export function referencedProjects(answer: string, projects: Project[]): Project[] {
  const normalized = words(answer);
  return projects.flatMap((project) => {
    const title = words(project.title);
    if (!title) return [];
    const pattern = title.split(' ').join('\\s*');
    const match = new RegExp(`(?:^|\\s)${pattern}(?=\\s|$)`).exec(normalized);
    return match ? [{ project, position: match.index }] : [];
  }).sort((a, b) => a.position - b.position)
    .filter(({ project }, index, matches) => matches.findIndex((item) => item.project.id === project.id) === index)
    .slice(0, 3)
    .map(({ project }) => project);
}
