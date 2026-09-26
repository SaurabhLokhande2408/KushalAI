// All data on this page is synthetic demo data generated for this prototype.
// No real government personnel records are used.

export const demoOfficer = {
  id: 'off-001',
  role: 'officer',
  name: 'Arjun Mehta',
  officerId: 'OSS-2291',
  email: 'arjun.mehta@demo.gov.in',
  designation: 'Data Analyst',
  department: 'Data Informatics & Innovation Division',
  qualifications: ['M.Sc. Statistics, University of Pune', 'PG Diploma in Data Science'],
  pastTrainings: ['Foundations of Official Statistics (2023)', 'Survey Methodology Workshop (2024)'],
  interestedDomains: ['Python', 'SQL', 'AI / ML', 'Data Visualization'],
  disciplineScore: 84,
  streakDays: 12,
  joinedOn: '2024-01-15'
};

export const demoAdmin = {
  id: 'adm-001',
  role: 'admin',
  name: 'Priya Sharma',
  officerId: 'OSS-1042',
  email: 'priya.sharma@demo.gov.in',
  designation: 'Training Administrator',
  department: 'Data Informatics & Innovation Division'
};

export function findDemoUserByRole(role) {
  return role === 'admin' ? demoAdmin : demoOfficer;
}
