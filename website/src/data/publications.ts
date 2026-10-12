// Journal articles explicitly authorized from Rui's public ORCID record.
import items from './publications.json';
export interface PublicationRecord {
  id: string;
  title: string;
  authors: string[];
  year: number;
  date: string;
  journal: string;
  reference: string;
  doi: string;
  url: string;
  arxiv?: string;
  catalog?: string;
  summary?: { en: string; zh: string };
}
export const publications: PublicationRecord[] = items;

export const samples = [
  { name: 'Master', count: 1184574, bands: 'HSC grizy', color: '#274e70' },
  { name: 'HSC+WISE', count: 371777, bands: 'HSC + WISE', color: '#526b85' },
  { name: 'GoldenU', count: 87460, bands: 'HSC + WISE + UKIDSS', color: '#738594' },
  { name: 'GoldenV', count: 120572, bands: 'HSC + WISE + VISTA', color: '#87998c' },
];
