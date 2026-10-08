import items from './photos.json';
export interface Photo {
  id: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  location: { en: string; zh: string };
  album: { en: string; zh: string };
  date: string;
  width: number;
  height: number;
  thumb: string;
  large: string;
  sources: { src: string; width: number }[];
}
export const photos: Photo[] = items;
