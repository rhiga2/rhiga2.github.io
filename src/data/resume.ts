export const resume = {
  name: 'Ryley Higa',
  title: 'Senior ML Engineer',
  location: 'Honolulu, HI',
  email: 'ryley@example.com',
  summary:
    'Senior machine learning engineer building reliable systems from unreliable AI.',
  experience: [
    {
      role: 'Senior ML Engineer',
      company: 'Company Name',
      start: '2022',
      end: 'present',
      bullets: [
        'Built production ML systems and evaluation loops.',
        'Designed data pipelines and model serving infrastructure.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'University Name',
      year: '2020',
    },
  ],
  skills: [
    { category: 'Languages', items: ['Python', 'TypeScript', 'SQL'] },
    { category: 'ML', items: ['PyTorch', 'scikit-learn', 'HuggingFace'] },
    { category: 'Web', items: ['Astro', 'Preact', 'Tailwind CSS'] },
  ],
  socials: [
    { platform: 'GitHub', url: 'https://github.com/rhiga2' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ryleyhiga' },
    { platform: 'Instagram', url: 'https://instagram.com/helloimhiga' },
  ],
} as const;
