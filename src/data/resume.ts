export const resume = {
  name: 'Ryley Higa',
  title: 'Senior Machine Learning Engineer I – Core AI Team',
  location: 'Honolulu, HI',
  email: 'ryley.higa2@gmail.com',
  phone: '(808) 497-1872',
  summary:
    'Senior MLE with 6+ years of experience developing AI-powered systems in production. Proven track record delivering scalable ML infrastructure, fine-tuning LLMs for log analytics, and creating anomaly detection models for monitoring web applications. Adept at bridging machine learning algorithms and systems engineering, from prototyping copilot agents to optimizing distributed workflows.',
  experience: [
    {
      role: 'Senior Machine Learning Engineer I – Core AI Team',
      company: 'Sumo Logic',
      start: 'May 2022',
      end: 'Present',
      bullets: [
        'Augmented NL to Sumo query translation accuracy 20% by replacing single-shot prompting with a multi-pass translation agent in Sumo\'s copilot.',
        'Reduced response time and inference cost by 4x for the log summarization copilot by replacing foundation models (Claude) with fine-tuned small language models (Llama 8b).',
        'Decreased alerting false positives by 30% by transitioning customers to time series monitors powered by anomaly detection.',
        'Scaled Sumo\'s log clustering pipeline throughput 10x by rearchitecting their clustering algorithm around distributed map-reduce processing.',
      ],
    },
    {
      role: 'Machine Learning Engineer II – Core AI Team',
      company: 'Sumo Logic',
      start: 'May 2019',
      end: 'May 2022',
      bullets: [
        'Doubled the frequency of code deployment by migrating machine learning / AI services from EC2 to Kubernetes.',
        'Built a prototype LLM for entity detection that extracted services, apps, and agents from unstructured logs with minimal labeled data.',
        'Developed a serverless extension API that enabled customers to run custom logic on ingested logs via event-driven REST endpoints.',
      ],
    },
    {
      role: 'Intern – Core AI Team',
      company: 'Sumo Logic',
      start: 'May 2018',
      end: 'August 2018',
      bullets: [
        'Designed statistical models that enabled SaaS companies to benchmark operational and security metrics, improving forecasting accuracy by up to 20%.',
        'Scaled log data ingestion by 100x with a source-type-aware ETL pipeline coordinated using Apache Airflow.',
      ],
    },
  ],
  education: [
    {
      degree: 'Master\'s in Computer Science (MCS)',
      school: 'University of Illinois Urbana-Champaign',
      year: 'Jan 2024 – Expected Dec 2025',
    },
    {
      degree: 'Bachelor\'s in Computer Engineering (BCE)',
      school: 'University of Illinois Urbana-Champaign',
      year: 'Aug 2013 – May 2017',
    },
  ],
  skills: [
    {
      category: 'Programming & Query Languages',
      items: ['Python', 'Scala', 'SQL', 'C', 'Java', 'Terraform'],
    },
    {
      category: 'ML Tools',
      items: ['PyTorch', 'NumPy', 'Pandas', 'Ollama', 'LangGraph', 'Weights & Biases', 'HuggingFace', 'MLflow'],
    },
    {
      category: 'Infrastructure',
      items: ['AWS', 'Kubernetes', 'Docker', 'OpenAPI', 'Terraform'],
    },
  ],
  others: [
    { label: 'Patent', value: 'Clustering of Structured Log Data by Key Schema' },
    { label: 'Publication', value: 'Performance Based Cost Functions for End-to-End Speech Separation' },
    { label: 'Speaking', value: 'PBS AI Townhall, Hawaii Public Radio Conversation on AI' },
  ],
  socials: [
    { platform: 'Website', url: 'https://rhiga2.github.io/' },
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/ryleyhiga/' },
    { platform: 'GitHub', url: 'https://github.com/rhiga2' },
  ],
} as const;
