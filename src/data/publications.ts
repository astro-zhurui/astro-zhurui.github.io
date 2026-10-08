// Only papers explicitly approved by Rui. No automatic CV / ORCID imports.
export const publications = [
  {
    id: 'qhsc',
    title: 'QHSC: The Quasar Candidate Catalog for the Hyper Suprime-Cam Subaru Strategic Program',
    authors: ['Rui Zhu', 'Xue-Bing Wu', 'Yuxuan Pang', 'Yuming Fu'],
    year: 2026,
    journal: 'The Astrophysical Journal Supplement Series',
    reference: 'ApJS · 282 · 38',
    doi: '10.3847/1538-4365/ae2099',
    url: 'https://iopscience.iop.org/article/10.3847/1538-4365/ae2099',
    arxiv: 'https://arxiv.org/abs/2511.14369',
    catalog: 'https://doi.org/10.5281/zenodo.17515028',
    summary: {
      en: 'A machine-learning-selected quasar candidate catalog from HSC-SSP DR3, with four photometric samples, classification probabilities, and photometric redshifts.',
      zh: '基于 HSC-SSP DR3 构建的机器学习类星体候选体星表，包含四个测光样本、分类概率与测光红移。',
    },
  },
];

export const samples = [
  { name: 'Master', count: 1184574, bands: 'HSC grizy', color: '#90d6ed' },
  { name: 'HSC+WISE', count: 371777, bands: 'HSC + WISE', color: '#adb3ff' },
  { name: 'GoldenU', count: 87460, bands: 'HSC + WISE + UKIDSS', color: '#e3bb88' },
  { name: 'GoldenV', count: 120572, bands: 'HSC + WISE + VISTA', color: '#91bfb4' },
];
