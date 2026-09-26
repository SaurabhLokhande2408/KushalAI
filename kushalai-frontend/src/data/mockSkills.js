// Synthetic skill passport data for the demo officer account.

export const statusFromMastery = (mastery) => {
  if (mastery >= 85) return 'Mastered';
  if (mastery >= 70) return 'Proficient';
  if (mastery >= 45) return 'Developing';
  return 'Gap';
};

export const skillDomains = [
  {
    id: 'statistical',
    name: 'Statistical',
    competencies: [
      { id: 'stat-inference', name: 'Statistical Inference', mastery: 72, evidence: ['Course completion', '2 quiz results'] },
      { id: 'survey-design', name: 'Survey Methodology', mastery: 63, evidence: ['1 course completion'] },
      { id: 'stat-programming', name: 'Statistical Programming (R)', mastery: 58, evidence: ['1 quiz result'] }
    ]
  },
  {
    id: 'technical',
    name: 'Technical',
    competencies: [
      { id: 'python', name: 'Python', mastery: 82, evidence: ['3 course completions', 'Recent activity'] },
      { id: 'sql', name: 'SQL', mastery: 61, evidence: ['1 course completion', '1 quiz result'] },
      { id: 'gis', name: 'GIS', mastery: 43, evidence: ['Not started'] },
      { id: 'ai-ml', name: 'AI / ML', mastery: 35, evidence: ['Recommended next'] }
    ]
  },
  {
    id: 'digital-governance',
    name: 'Digital Governance',
    competencies: [
      { id: 'data-privacy', name: 'Data Privacy', mastery: 54, evidence: ['1 course completion'] },
      { id: 'cloud', name: 'Cloud Fundamentals', mastery: 39, evidence: ['Not started'] },
      { id: 'digital-tools', name: 'Digital Governance Tools', mastery: 61, evidence: ['1 course completion'] }
    ]
  },
  {
    id: 'behavioural',
    name: 'Behavioural / Managerial',
    competencies: [
      { id: 'communication', name: 'Communication', mastery: 91, evidence: ['2 course completions'] },
      { id: 'leadership', name: 'Leadership', mastery: 78, evidence: ['1 course completion'] },
      { id: 'teamwork', name: 'Collaboration', mastery: 88, evidence: ['Recent activity'] }
    ]
  }
];

export function domainAverage(domain) {
  const total = domain.competencies.reduce((sum, c) => sum + c.mastery, 0);
  return Math.round(total / domain.competencies.length);
}

export function overallScore() {
  const all = skillDomains.flatMap((d) => d.competencies);
  return Math.round(all.reduce((s, c) => s + c.mastery, 0) / all.length);
}

// Flat competency list used to drive the admin heatmap columns
export const heatmapSkills = ['Python', 'SQL', 'GIS', 'AI/ML', 'Statistics', 'Cloud', 'Data Privacy'];
