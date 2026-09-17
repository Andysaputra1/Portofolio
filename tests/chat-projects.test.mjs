import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { referencedProjects } from '../src/utils/chatProjects.ts';

const projects = JSON.parse(readFileSync(new URL('../src/data/projects.json', import.meta.url), 'utf8'));
const ids = (answer) => referencedProjects(answer, projects).map(project => project.id);

test('chat previews match named projects in answer order, once each', () => {
  assert.deepEqual(ids('AI Trainer and Silent Terror. AI Trainer uses autoencoders.'), ['ai-trainer', 'silent-terror']);
  assert.deepEqual(ids('Try **Mushroom Vision**, then SKOLIOCHECK.'), ['mushroom-vision', 'scolio']);
  assert.deepEqual(ids('Visit https://www.myinvitation.cards/ for My Invitation.'), ['my-invitation']);
  assert.deepEqual(ids('AndySaputraPortofolio'), ['portfolio']);
});

test('chat previews stay compact and do not attach unrelated or invented projects', () => {
  assert.deepEqual(ids('Andy studies AI and builds web applications.'), []);
  assert.deepEqual(ids('Unknown App at https://example.com/image.png'), []);
  assert.deepEqual(ids('Silent Terrorist and AI Trainers'), []);
  assert.deepEqual(ids('SkolioCheck, AI Trainer, Silent Terror, Mushroom Vision'), ['scolio', 'ai-trainer', 'silent-terror']);
  const result = referencedProjects('AI Trainer', projects);
  assert.equal(result[0], projects.find(project => project.id === 'ai-trainer'));
});
