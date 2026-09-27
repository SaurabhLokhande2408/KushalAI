// Synthetic officer roster for the admin dashboard demo. These are entirely
// fictional profiles created to populate the visualisations — not real
// government employee records.

import { heatmapSkills } from './mockSkills';

const departments = [
  'Data Informatics & Innovation Division',
  'Survey Design & Methodology Division',
  'Regional Statistics Office — West',
  'Economic Statistics Division'
];

const designations = ['Data Analyst', 'Statistical Officer', 'Junior Statistical Officer', 'Research Associate'];

const profiles = [
  { name: 'Ajun Mehra', gender: 'male', profileImage: '/assets/employee-arvind.svg' },
  { name: 'Meena Subramanian', gender: 'female', profileImage: '/assets/employee-meena.svg' },
  { name: 'Ramesh Chandra', gender: 'male', profileImage: '/assets/employee-ramesh.svg' },
  { name: 'Savitri Menon', gender: 'female', profileImage: '/assets/employee-savitri.svg' },
  { name: 'Prakash Bhosale', gender: 'male', profileImage: '/assets/employee-prakash.svg' },
  { name: 'Anuradha Rao', gender: 'female', profileImage: '/assets/employee-anuradha.svg' },
  { name: 'Vijay Joshi', gender: 'male', profileImage: '/assets/employee-vijay.svg' },
  { name: 'Shailendra Kulkarni', gender: 'male', profileImage: '/assets/employee-shailendra.svg' },
  { name: 'Lakshmi Narayanan', gender: 'female', profileImage: '/assets/employee-lakshmi.svg' },
  { name: 'Mahendra Deshpande', gender: 'male', profileImage: '/assets/employee-mahendra.svg' },
  { name: 'Sunita Iyer', gender: 'female', profileImage: '/assets/employee-sunita.svg' },
  { name: 'Rajendra Patil', gender: 'male', profileImage: '/assets/employee-rajendra.svg' }
];

function seededMastery(seed, offset) {
  const v = (seed * 37 + offset * 13) % 100;
  return Math.max(15, Math.min(96, v));
}

export const officers = profiles.map(({ name, gender, profileImage }, idx) => {
  const skillMastery = {};
  heatmapSkills.forEach((skill, sIdx) => {
    skillMastery[skill] = seededMastery(idx + 1, sIdx + 1);
  });
  const gaps = Object.entries(skillMastery)
    .filter(([, v]) => v < 55)
    .sort((a, b) => a[1] - b[1])
    .slice(0, 2)
    .map(([k]) => k);

  const disciplineScore = 55 + ((idx * 17) % 40);
  const latestQuiz = 50 + ((idx * 23) % 45);
  const coursesCompleted = 3 + (idx % 9);

  return {
    id: `syn-${String(idx + 1).padStart(2, '0')}`,
    name,
    gender,
    profileImage,
    designation: designations[idx % designations.length],
    department: departments[idx % departments.length],
    disciplineScore,
    latestQuiz,
    coursesCompleted,
    coursesInProgress: 1 + (idx % 3),
    skillMastery,
    topGaps: gaps.length ? gaps : ['Cloud'],
    status: disciplineScore >= 80 ? 'On Track' : disciplineScore >= 60 ? 'Steady' : 'Needs Attention',
    qualifications: ['B.Sc. Statistics', 'PG Diploma in Data Analytics'],
    pastTrainings: ['Foundations of Official Statistics (2023)'],
    recentActivity: [
      `Completed "${idx % 2 === 0 ? 'Python Basics' : 'SQL Foundations'}"`,
      `Scored ${latestQuiz}% on latest quiz`,
      'Logged in 3 days this week'
    ]
  };
});

export function getOfficerById(id) {
  return officers.find((o) => o.id === id);
}

export const adminKpis = {
  totalOfficers: officers.length + 1,
  avgSkillScore: Math.round(
    officers.reduce((sum, o) => {
      const vals = Object.values(o.skillMastery);
      return sum + vals.reduce((a, b) => a + b, 0) / vals.length;
    }, 0) / officers.length
  ),
  criticalGaps: officers.reduce((sum, o) => sum + o.topGaps.length, 0),
  coursesCompleted: officers.reduce((sum, o) => sum + o.coursesCompleted, 0),
  avgDisciplineScore: Math.round(officers.reduce((sum, o) => sum + o.disciplineScore, 0) / officers.length)
};

export function emergingSkillGaps() {
  const counts = {};
  heatmapSkills.forEach((skill) => {
    counts[skill] = officers.filter((o) => o.skillMastery[skill] < 55).length;
  });
  return Object.entries(counts)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count);
}

export const departmentDistribution = departments.map((dept) => ({
  department: dept,
  count: officers.filter((o) => o.department === dept).length
}));
