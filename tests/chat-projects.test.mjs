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

test('chat attaches the CV only when the visitor asks for it', async () => {
  const { asksForCv } = await import('../src/utils/chatAttachments.ts');
  assert.ok(asksForCv('Boleh minta CV Andy?'));
  assert.ok(asksForCv('Can I see his resume?'));
  assert.ok(!asksForCv('What does Andy build?'));
  assert.ok(!asksForCv('Tell me about cvs and curves'));
});

test('chat turns contact details shared in an answer into links', async () => {
  const { mentionedContacts } = await import('../src/utils/chatAttachments.ts');
  const ids = (answer) => mentionedContacts(answer).map((link) => link.id);
  assert.deepEqual(ids('Reach Andy at andychensaputra@gmail.com or on LinkedIn.'), ['linkedin', 'email']);
  assert.deepEqual(ids('Nomor Andy: +62 819-9524-7372'), ['phone']);
  assert.deepEqual(ids('His number is 081995247372.'), ['phone']);
  assert.deepEqual(ids('Andy studies AI.'), []);
  assert.ok(mentionedContacts('LinkedIn').every((link) => link.href.startsWith('https://')));
});
