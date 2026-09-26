// Pre-baked quiz question banks. In the real product these would be generated
// from uploaded course material; in this frontend-only demo they are static.

export const quizzes = {
  'c-statistical-programming': {
    id: 'q-statistical-programming',
    courseTitle: 'Statistical Programming',
    generatedFromMaterial: true,
    questions: [
      {
        id: 'q1',
        prompt: 'Which measure is most robust to outliers in a skewed dataset?',
        options: ['Mean', 'Median', 'Standard deviation', 'Range'],
        correct: 1,
        explanation: 'The median is not pulled by extreme values the way the mean is, making it more robust for skewed data.'
      },
      {
        id: 'q2',
        prompt: 'A p-value of 0.03 at a 0.05 significance level suggests:',
        options: [
          'Strong evidence for the null hypothesis',
          'Reject the null hypothesis',
          'The test is invalid',
          'Increase the sample size before deciding'
        ],
        correct: 1,
        explanation: 'Since 0.03 is below the 0.05 threshold, the result is statistically significant and the null hypothesis is rejected.'
      },
      {
        id: 'q3',
        prompt: 'Which of these best describes multicollinearity?',
        options: [
          'Two variables are perfectly uncorrelated',
          'Predictor variables are highly correlated with each other',
          'The dependent variable has missing values',
          'A model has too few features'
        ],
        correct: 1,
        explanation: 'Multicollinearity occurs when independent variables in a regression are highly correlated, which can distort coefficient estimates.'
      },
      {
        id: 'q4',
        prompt: 'What does a confidence interval represent?',
        options: [
          'The exact population parameter',
          'A range likely to contain the population parameter at a given confidence level',
          'The probability the null hypothesis is true',
          'The sample size needed'
        ],
        correct: 1,
        explanation: 'A confidence interval gives a range of plausible values for a population parameter, at a stated confidence level.'
      },
      {
        id: 'q5',
        prompt: 'Which sampling method gives every unit an equal chance of selection?',
        options: ['Convenience sampling', 'Simple random sampling', 'Quota sampling', 'Snowball sampling'],
        correct: 1,
        explanation: 'Simple random sampling ensures every unit in the population has an equal probability of being selected.'
      }
    ]
  },
  'c-sql-foundations': {
    id: 'q-sql-foundations',
    courseTitle: 'SQL Foundations',
    generatedFromMaterial: false,
    questions: [
      {
        id: 'q1',
        prompt: 'Which SQL clause is used to filter rows after grouping?',
        options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'],
        correct: 1,
        explanation: 'HAVING filters aggregated results, while WHERE filters rows before grouping.'
      },
      {
        id: 'q2',
        prompt: 'Which JOIN returns all rows from the left table, matched rows from the right?',
        options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'],
        correct: 1,
        explanation: 'A LEFT JOIN keeps every row from the left table, filling in NULLs where there is no match on the right.'
      },
      {
        id: 'q3',
        prompt: 'What does the DISTINCT keyword do?',
        options: ['Sorts results', 'Removes duplicate rows', 'Groups results', 'Filters NULL values'],
        correct: 1,
        explanation: 'DISTINCT removes duplicate rows from the result set.'
      },
      {
        id: 'q4',
        prompt: 'Which function counts the number of rows in a result set?',
        options: ['SUM()', 'COUNT()', 'AVG()', 'LEN()'],
        correct: 1,
        explanation: 'COUNT() returns the number of rows matching a query.'
      }
    ]
  },
  'c-ml-fundamentals': {
    id: 'q-ml-fundamentals',
    courseTitle: 'Machine Learning Fundamentals',
    generatedFromMaterial: false,
    questions: [
      {
        id: 'q1',
        prompt: 'Which of these is a supervised learning task?',
        options: ['Clustering customers', 'Predicting house prices from labelled data', 'Dimensionality reduction', 'Association rule mining'],
        correct: 1,
        explanation: 'Supervised learning uses labelled data — predicting a known outcome, like price, is a classic supervised task.'
      },
      {
        id: 'q2',
        prompt: 'Overfitting occurs when a model:',
        options: [
          'Performs well on training data but poorly on new data',
          'Performs poorly on all data',
          'Has too few parameters',
          'Uses too little training data intentionally'
        ],
        correct: 0,
        explanation: 'Overfitting means the model has memorised the training data rather than learning generalisable patterns.'
      },
      {
        id: 'q3',
        prompt: 'Which metric is commonly used to evaluate classification models?',
        options: ['R-squared', 'Accuracy', 'RMSE', 'Silhouette score'],
        correct: 1,
        explanation: 'Accuracy is a standard metric for classification tasks, measuring the proportion of correct predictions.'
      }
    ]
  },
  'c-data-privacy': {
    id: 'q-data-privacy',
    courseTitle: 'Data Privacy & Protection',
    generatedFromMaterial: false,
    questions: [
      {
        id: 'q1',
        prompt: 'Anonymisation of citizen data primarily aims to:',
        options: ['Increase dataset size', 'Remove identifying information', 'Speed up queries', 'Improve chart aesthetics'],
        correct: 1,
        explanation: 'Anonymisation removes or masks information that could identify an individual, protecting citizen privacy.'
      },
      {
        id: 'q2',
        prompt: 'Which is a good practice when handling sensitive government datasets?',
        options: [
          'Share raw data over email for convenience',
          'Apply access controls and audit logging',
          'Store data with no access restrictions',
          'Skip data classification'
        ],
        correct: 1,
        explanation: 'Access controls and audit logging are core data-protection practices for sensitive datasets.'
      }
    ]
  }
};

export function getQuizByCourseId(courseId) {
  return quizzes[courseId] || null;
}

// Recent quiz attempt history used for the dashboard trend sparkline.
export const quizTrendHistory = [
  { attempt: 'Attempt 1', score: 61 },
  { attempt: 'Attempt 2', score: 68 },
  { attempt: 'Attempt 3', score: 74 },
  { attempt: 'Attempt 4', score: 86 }
];

// Activity heatmap: last ~12 weeks of daily activity intensity (0-4)
export function generateActivityHeatmap(weeks = 14) {
  const days = [];
  const today = new Date();
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // Deterministic pseudo-random pattern so the demo looks the same each run
    const seed = (d.getDate() * 7 + d.getMonth() * 3) % 9;
    const level = seed === 0 ? 0 : seed < 3 ? 1 : seed < 5 ? 2 : seed < 7 ? 3 : 4;
    days.push({ date: d.toISOString().slice(0, 10), level });
  }
  return days;
}
