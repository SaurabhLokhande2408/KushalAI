const OPTIONS = [
  'Not familiar',
  'I understand the basics',
  'Comfortable applying this',
  'I can guide others'
];

const QUESTION_BANKS = {
  python: [
    'How would you describe your familiarity with Python syntax?',
    'Can you assign values to variables and work with common data types?',
    'How comfortable are you writing conditional expressions?',
    'Can you use loops to process a collection of values?',
    'How familiar are you with defining and calling functions?',
    'Can you choose between lists, dictionaries and sets?',
    'How confidently can you read and troubleshoot a short Python script?'
  ],
  analysis: [
    'Can you load tabular data and inspect its columns and types?',
    'How comfortable are you identifying missing or inconsistent values?',
    'Can you filter and sort records to answer a question?',
    'How familiar are you with grouping and summarising observations?',
    'Can you explain the difference between a row and a variable?',
    'How confidently can you validate a transformed dataset?',
    'Can you communicate a finding from an exploratory analysis?'
  ],
  pandas: [
    'How comfortable are you selecting rows and columns in a DataFrame?',
    'Can you apply vectorised operations to a numerical array?',
    'How familiar are you with merging two tabular datasets?',
    'Can you group records and calculate summary statistics?',
    'How would you handle missing values in an analytical dataset?',
    'Can you distinguish a Series from a DataFrame?',
    'How confidently can you check the output of a data transformation?'
  ],
  statistics: [
    'Can you explain what a mean and median describe?',
    'How familiar are you with variance and standard deviation?',
    'Can you interpret a percentage or rate in context?',
    'How comfortable are you reasoning about probability?',
    'Can you identify when an average may hide important variation?',
    'How familiar are you with sampling and representativeness?',
    'Can you communicate the limits of a statistical conclusion?'
  ],
  machineLearning: [
    'How comfortable are you preparing a dataset for analysis?',
    'Can you distinguish a feature from a target variable?',
    'How familiar are you with training and test datasets?',
    'Can you explain why a model should be evaluated on unseen data?',
    'How comfortable are you interpreting a model performance measure?',
    'Can you describe a basic supervised learning task?',
    'How familiar are you with bias and limitations in model outputs?'
  ],
  sql: [
    'How would you retrieve selected columns with a SELECT statement?',
    'Can you filter records with a WHERE condition?',
    'How familiar are you with joining related tables?',
    'Can you group records and calculate an aggregate?',
    'How comfortable are you using aliases and sorting query results?',
    'Can you explain how a primary key relates records?',
    'How confidently can you check a query for unintended row duplication?'
  ],
  engineering: [
    'Can you explain how a data table is represented by a schema?',
    'How familiar are you with extracting data from a source system?',
    'Can you describe a sequence of data transformation steps?',
    'How comfortable are you checking data quality at each step?',
    'Can you identify duplicate or incomplete records in a pipeline?',
    'How familiar are you with scheduling repeatable data jobs?',
    'Can you explain how a downstream report depends on reliable inputs?'
  ],
  privacy: [
    'How familiar are you with identifying personal data in a dataset?',
    'Can you explain why data collection should be limited to a purpose?',
    'How comfortable are you choosing who may access sensitive records?',
    'Can you distinguish anonymisation from removing direct identifiers?',
    'How familiar are you with secure sharing and retention practices?',
    'Can you identify a privacy risk in a proposed data use?',
    'How confidently can you escalate a suspected data exposure?'
  ],
  cloud: [
    'How familiar are you with servers and network connectivity?',
    'Can you explain the difference between storage and compute?',
    'How comfortable are you with virtual machines or containers?',
    'Can you describe how access permissions protect cloud resources?',
    'How familiar are you with backups and service availability?',
    'Can you identify a basic cloud deployment component?',
    'How confidently can you consider data residency requirements?'
  ],
  gis: [
    'How familiar are you with coordinates and geographic locations?',
    'Can you distinguish vector features from raster data?',
    'How comfortable are you interpreting a map layer and its legend?',
    'Can you explain why coordinate reference systems matter?',
    'How familiar are you with joining attributes to spatial features?',
    'Can you identify a suitable map scale for a question?',
    'How confidently can you interpret a spatial pattern with caveats?'
  ],
  communication: [
    'How comfortable are you identifying the main finding in an analysis?',
    'Can you adapt technical language for a non-technical audience?',
    'How familiar are you with structuring a concise briefing?',
    'Can you select evidence that supports a recommendation?',
    'How comfortable are you explaining uncertainty clearly?',
    'Can you respond constructively to questions about your findings?',
    'How confidently can you distinguish evidence from interpretation?'
  ],
  visualization: [
    'How would you select a chart type to compare values across categories?',
    'Can you explain how scale and axis choices can change a visual impression?',
    'How comfortable are you designing a chart for a specific policy question?',
    'Can you use colour and labels to make a chart understandable at a glance?',
    'How familiar are you with communicating uncertainty in a data visualisation?',
    'Can you adapt a visual explanation for a non-technical audience?',
    'How confidently can you check a chart for accessibility and misleading emphasis?'
  ]
};

const COURSE_CHECKS = {
  'c-python-basics': {
    bank: 'python',
    prerequisites: ['Programming concepts', 'Variables and data types', 'Control flow', 'Functions'],
    prerequisiteCourseIds: []
  },
  'c-python-data-analysis': {
    bank: 'analysis',
    prerequisites: ['Python fundamentals', 'Tabular data', 'Data quality', 'Interpretation'],
    prerequisiteCourseIds: ['c-python-basics']
  },
  'c-pandas-numpy': {
    bank: 'pandas',
    prerequisites: ['Python fundamentals', 'DataFrames', 'Numerical operations', 'Data validation'],
    prerequisiteCourseIds: ['c-python-data-analysis']
  },
  'c-statistical-programming': {
    bank: 'statistics',
    prerequisites: ['Descriptive statistics', 'Probability', 'Sampling', 'Interpretation'],
    prerequisiteCourseIds: ['c-python-data-analysis', 'c-pandas-numpy']
  },
  'c-ml-fundamentals': {
    bank: 'machineLearning',
    prerequisites: ['Python and datasets', 'Statistical reasoning', 'Model evaluation', 'Responsible use'],
    prerequisiteCourseIds: ['c-python-data-analysis', 'c-statistical-programming']
  },
  'c-applied-ai-stats': {
    bank: 'machineLearning',
    prerequisites: ['Data preparation', 'Statistical reasoning', 'Machine learning concepts', 'Model evaluation'],
    prerequisiteCourseIds: ['c-statistical-programming', 'c-ml-fundamentals']
  },
  'c-sql-foundations': {
    bank: 'sql',
    prerequisites: ['Relational data', 'Query structure', 'Filtering and grouping', 'Data validation'],
    prerequisiteCourseIds: []
  },
  'c-data-engineering': {
    bank: 'engineering',
    prerequisites: ['SQL foundations', 'Data structures', 'Data quality', 'Repeatable workflows'],
    prerequisiteCourseIds: ['c-sql-foundations']
  },
  'c-analytics-track': {
    bank: 'statistics',
    prerequisites: ['Statistical reasoning', 'Data preparation', 'Evidence interpretation', 'Policy context'],
    prerequisiteCourseIds: ['c-statistical-programming', 'c-data-engineering']
  },
  'c-data-privacy': {
    bank: 'privacy',
    prerequisites: ['Personal data', 'Purpose limitation', 'Access control', 'Responsible sharing'],
    prerequisiteCourseIds: []
  },
  'c-cloud-fundamentals': {
    bank: 'cloud',
    prerequisites: ['Networking', 'Compute and storage', 'Virtualisation', 'Security basics'],
    prerequisiteCourseIds: ['c-data-privacy']
  },
  'c-gis-intro': {
    bank: 'gis',
    prerequisites: ['Coordinates', 'Spatial data types', 'Map interpretation', 'Data context'],
    prerequisiteCourseIds: ['c-python-data-analysis']
  },
  'c-comms-leadership': {
    bank: 'communication',
    prerequisites: ['Evidence selection', 'Audience awareness', 'Clear structure', 'Uncertainty'],
    prerequisiteCourseIds: []
  },
  'c-public-data-visualization': {
    bank: 'visualization',
    prerequisites: ['Statistical reasoning', 'Visual design principles', 'Data storytelling', 'Accessibility and clarity'],
    prerequisiteCourseIds: ['c-statistical-programming', 'c-pandas-numpy']
  }
};

const FALLBACK_QUESTIONS = [
  'How familiar are you with the core concepts in {skill}?',
  'Can you identify the main inputs used in {skill}?',
  'How comfortable are you applying {skill} to a practical task?',
  'Can you interpret a result produced using {skill}?',
  'How familiar are you with checking the quality of {skill} outputs?',
  'Can you explain a limitation relevant to {skill}?',
  'How confidently can you apply {skill} in a workplace context?'
];

export function getPrerequisiteCheck(course) {
  const configured = COURSE_CHECKS[course?.id];
  const prerequisites = configured?.prerequisites ?? [
    `${course?.skill || 'Course'} fundamentals`,
    'Core concepts',
    'Applying the subject in context',
    'Interpreting results'
  ];
  const questions = (QUESTION_BANKS[configured?.bank] || FALLBACK_QUESTIONS).map((prompt, index) => ({
    id: `${course?.id || 'course'}-q${index + 1}`,
    question: typeof prompt === 'string'
      ? prompt.replaceAll('{skill}', course?.skill || 'this subject')
      : prompt.question,
    prerequisite: prerequisites[index % prerequisites.length],
    options: OPTIONS,
    expected: course?.difficulty === 'Beginner' ? 1 : 2
  }));

  return {
    prerequisites,
    prerequisiteCourseIds: configured?.prerequisiteCourseIds ?? [],
    questions
  };
}