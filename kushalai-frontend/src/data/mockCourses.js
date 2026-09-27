// Synthetic course catalog. "iGOT Karmayogi" and "NSSTA / TPAC" are used here
// only as illustrative source labels for the demo — this prototype has no
// live integration with either system.

export const courses = [
  {
    id: 'c-python-basics',
    title: 'Python Basics',
    domain: 'Technical',
    skill: 'Python',
    source: 'iGOT Karmayogi',
    difficulty: 'Beginner',
    estTime: '4 hrs',
    description: 'Core Python syntax, data types, control flow and functions, built for officers with no prior programming background.',
    currentMastery: 82,
    requiredMastery: 60,
    reason: 'Required for your role as Data Analyst.'
  },
  {
    id: 'c-python-data-analysis',
    title: 'Python for Data Analysis',
    domain: 'Technical',
    skill: 'Python',
    source: 'iGOT Karmayogi',
    difficulty: 'Beginner',
    estTime: '6 hrs',
    description: 'Working with tabular data, cleaning, transformation and exploratory analysis using Python.',
    currentMastery: 82,
    requiredMastery: 70,
    reason: 'Builds directly on Python Basics.'
  },
  {
    id: 'c-pandas-numpy',
    title: 'Pandas & NumPy Deep Dive',
    domain: 'Technical',
    skill: 'Python',
    source: 'iGOT Karmayogi',
    difficulty: 'Intermediate',
    estTime: '8 hrs',
    description: 'Hands-on practice with Pandas DataFrames, NumPy arrays and vectorised operations for statistical datasets.',
    currentMastery: 82,
    requiredMastery: 75,
    reason: 'Closes your Python competency gap for advanced analysis tasks.'
  },
  {
    id: 'c-statistical-programming',
    title: 'Statistical Programming',
    domain: 'Statistical',
    skill: 'Statistical Programming',
    source: 'NSSTA / TPAC',
    difficulty: 'Intermediate',
    estTime: '10 hrs',
    description: 'Applying statistical programming techniques to official survey and administrative datasets.',
    currentMastery: 58,
    requiredMastery: 75,
    reason: 'Required for your role and closes a current skill gap.'
  },
  {
    id: 'c-ml-fundamentals',
    title: 'Machine Learning Fundamentals',
    domain: 'Technical',
    skill: 'AI / ML',
    source: 'iGOT Karmayogi',
    difficulty: 'Intermediate',
    estTime: '12 hrs',
    description: 'An introduction to supervised and unsupervised learning concepts, framed around public-sector data use cases.',
    currentMastery: 35,
    requiredMastery: 70,
    reason: 'Closes your largest current skill gap: AI / ML.'
  },
  {
    id: 'c-applied-ai-stats',
    title: 'Applied AI for Official Statistics',
    domain: 'Technical',
    skill: 'AI / ML',
    source: 'NSSTA / TPAC',
    difficulty: 'Advanced',
    estTime: '14 hrs',
    description: 'Capstone course applying AI/ML techniques to real official-statistics workflows: forecasting, anomaly detection and classification.',
    currentMastery: 35,
    requiredMastery: 80,
    reason: 'Capstone for the AI/ML learning track.'
  },
  {
    id: 'c-sql-foundations',
    title: 'SQL Foundations',
    domain: 'Technical',
    skill: 'SQL',
    source: 'iGOT Karmayogi',
    difficulty: 'Beginner',
    estTime: '5 hrs',
    description: 'Querying relational databases: SELECT, JOIN, GROUP BY and subqueries using realistic government datasets.',
    currentMastery: 61,
    requiredMastery: 75,
    reason: 'Required for your role: closes your SQL competency gap.'
  },
  {
    id: 'c-data-engineering',
    title: 'Data Engineering Essentials',
    domain: 'Technical',
    skill: 'SQL',
    source: 'NSSTA / TPAC',
    difficulty: 'Intermediate',
    estTime: '9 hrs',
    description: 'Designing simple data pipelines, schema design and data quality checks for administrative datasets.',
    currentMastery: 61,
    requiredMastery: 78,
    reason: 'Builds on SQL Foundations toward the Analytics track.'
  },
  {
    id: 'c-analytics-track',
    title: 'Analytics for Policy Decisions',
    domain: 'Statistical',
    skill: 'Statistics',
    source: 'NSSTA / TPAC',
    difficulty: 'Advanced',
    estTime: '10 hrs',
    description: 'Turning cleaned, engineered datasets into decision-ready analysis for policy stakeholders.',
    currentMastery: 58,
    requiredMastery: 78,
    reason: 'Combines your Statistics and Data Engineering progress.'
  },
  {
    id: 'c-data-privacy',
    title: 'Data Privacy & Protection',
    domain: 'Digital Governance',
    skill: 'Data Privacy',
    source: 'iGOT Karmayogi',
    difficulty: 'Beginner',
    estTime: '3 hrs',
    description: 'Principles of data protection, anonymisation and responsible handling of citizen data.',
    currentMastery: 54,
    requiredMastery: 70,
    reason: 'Mandatory digital governance competency for your role.'
  },
  {
    id: 'c-cloud-fundamentals',
    title: 'Cloud Fundamentals for Government',
    domain: 'Digital Governance',
    skill: 'Cloud',
    source: 'NSSTA / TPAC',
    difficulty: 'Beginner',
    estTime: '6 hrs',
    description: 'Core cloud computing concepts and how they are applied in public-sector digital infrastructure.',
    currentMastery: 39,
    requiredMastery: 65,
    reason: 'Emerging skill with a high gap across your department.'
  },
  {
    id: 'c-gis-intro',
    title: 'Introduction to GIS',
    domain: 'Technical',
    skill: 'GIS',
    source: 'iGOT Karmayogi',
    difficulty: 'Beginner',
    estTime: '7 hrs',
    description: 'Fundamentals of geographic information systems for spatial analysis of statistical data.',
    currentMastery: 43,
    requiredMastery: 65,
    reason: 'Emerging skill with a high gap across your department.'
  },
  {
    id: 'c-comms-leadership',
    title: 'Communication for Public Officers',
    domain: 'Behavioural',
    skill: 'Communication',
    source: 'NSSTA / TPAC',
    difficulty: 'Beginner',
    estTime: '4 hrs',
    description: 'Structured communication techniques for reporting findings to non-technical stakeholders.',
    currentMastery: 91,
    requiredMastery: 70,
    reason: 'Already mastered — kept visible for completeness.'
  },
  {
    id: 'c-public-data-visualization',
    title: 'Data Visualization for Public Policy',
    domain: 'Statistical',
    skill: 'Data Visualization',
    source: 'NSSTA / TPAC',
    difficulty: 'Intermediate',
    estTime: '8 hrs',
    description: 'Design clear, accessible visual explanations of official data for policy briefs, public reports and decision-makers.',
    currentMastery: 46,
    requiredMastery: 72,
    reason: 'Builds on your statistical analysis competency and strengthens evidence communication for policy decisions.'
  }
];

export function getCourseById(id) {
  return courses.find((c) => c.id === id);
}
