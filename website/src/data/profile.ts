// Public-facing information only. Do not import the original CV here.
export const profile = {
  name: { en: 'Rui Zhu', zh: '朱睿' },
  role: { en: 'Postdoctoral researcher', zh: '博士后研究员' },
  affiliation: {
    en: 'National Astronomical Observatories, Chinese Academy of Sciences',
    zh: '中国科学院国家天文台',
  },
  email: 'zhurui@nao.cas.cn',
  github: 'https://github.com/astro-zhurui',
  orcid: 'https://orcid.org/0000-0002-0792-2353',
  cv: { en: null as string | null, zh: null as string | null },
  interests: [
    { en: 'Quasar selection', zh: '类星体选源' },
    { en: 'Photometric redshifts', zh: '测光红移估计' },
    { en: 'Machine learning in astronomy', zh: '天文学中的机器学习' },
  ],
  biography: {
    en: 'I am a postdoctoral researcher at the National Astronomical Observatories, Chinese Academy of Sciences. My research interests include quasar selection, photometric redshift estimation, and machine learning for large astronomical surveys.',
    zh: '中国科学院国家天文台博士后，2026 年获北京大学天体物理学博士学位。研究方向为类星体选源、测光红移与天文巡天数据分析。',
  },
  experience: [
    {
      period: '2026.08 —',
      en: 'Postdoctoral researcher',
      zh: '博士后研究员',
      institution: {
        en: 'National Astronomical Observatories, Chinese Academy of Sciences',
        zh: '中国科学院国家天文台',
        logo: '/logos/naoc.png',
        url: 'https://nao.cas.cn/',
      },
      supervisor: { en: 'Hong Wu', zh: '吴宏研究员' },
      detail: { en: 'Beijing, China', zh: '中国 · 北京' },
    },
    {
      period: '2020.09 — 2026.07',
      en: 'Ph.D. in Astrophysics',
      zh: '天体物理学博士',
      institution: {
        en: 'Peking University',
        zh: '北京大学',
        logo: '/logos/pku.png',
        url: 'https://www.pku.edu.cn/',
      },
      supervisor: { en: 'Xue-Bing Wu', zh: '吴学兵教授' },
      detail: {
        en: 'Department of Astronomy & KIAA',
        zh: '天文学系与科维理天文与天体物理研究所',
      },
    },
    {
      period: '2025.09 — 2026.03',
      en: 'Visiting Ph.D. Student',
      zh: '联合培养博士生',
      institution: {
        en: 'Max Planck Institute for Extraterrestrial Physics',
        zh: '马克斯·普朗克地外物理研究所',
        logo: '/logos/mpe.svg',
        url: 'https://www.mpe.mpg.de/',
      },
      supervisor: { en: 'Mara Salvato', zh: 'Mara Salvato' },
      detail: { en: 'High Energy Group · Garching, Germany', zh: '高能组 · 德国加兴' },
    },
    {
      period: '2016.09 — 2020.06',
      en: 'B.Sc. in Physics',
      zh: '物理学学士',
      institution: {
        en: 'Zhengzhou University',
        zh: '郑州大学',
        logo: '/logos/zzu.png',
        url: 'https://www.zzu.edu.cn/',
      },
      supervisor: null,
      detail: { en: 'School of Physics', zh: '物理学院' },
    },
  ],
};
