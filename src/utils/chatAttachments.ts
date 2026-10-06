import contact from '../data/contact.json' with { type: 'json' };

export type ContactLink = { id: 'linkedin' | 'email' | 'phone' | 'instagram'; label: string; value: string; href: string };

// Checked against the visitor's question only: answers cite the "cv" source tag, so they mention it constantly.
const CV_REQUEST = /\b(cv|resume|résumé|curriculum vitae|riwayat hidup)\b/i;
export const asksForCv = (question: string) => CV_REQUEST.test(question);

const digits = (value: string) => value.replace(/\D/g, '');
const localPhone = digits(contact.phone).replace(/^62/, '');
const links: (ContactLink & { mentioned: (answer: string) => boolean })[] = [
  { id: 'linkedin', label: 'LinkedIn', value: 'andy-saputra', href: contact.linkedin, mentioned: (a) => /linkedin/i.test(a) },
  { id: 'email', label: 'Email', value: contact.email, href: `mailto:${contact.email}`, mentioned: (a) => a.toLowerCase().includes(contact.email.toLowerCase()) },
  { id: 'phone', label: 'Phone', value: contact.phone, href: `tel:${contact.phone}`, mentioned: (a) => digits(a).includes(localPhone) },
  { id: 'instagram', label: 'Instagram', value: '@anditific', href: contact.instagram, mentioned: (a) => /instagram/i.test(a) },
];

// Contact details the answer shares, as clickable links (plain-text answers can't link them).
export const mentionedContacts = (answer: string): ContactLink[] =>
  links.filter((link) => link.mentioned(answer)).map(({ id, label, value, href }) => ({ id, label, value, href }));
