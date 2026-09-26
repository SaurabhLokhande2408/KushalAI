// Roadmap graph for the demo officer. Positions are expressed as percentages
// (x, y) within the roadmap canvas so the winding path can reflow responsively.
// status: 'completed' | 'current' | 'recommended' | 'locked'

export const roadmapNodes = [
  {
    id: 'n1', courseId: 'c-python-basics', status: 'completed',
    domain: 'Technical', prereqs: [], x: 6, y: 20
  },
  {
    id: 'n2', courseId: 'c-python-data-analysis', status: 'completed',
    domain: 'Technical', prereqs: ['n1'], x: 21, y: 20
  },
  {
    id: 'n3', courseId: 'c-pandas-numpy', status: 'completed',
    domain: 'Technical', prereqs: ['n2'], x: 36, y: 20
  },
  {
    id: 'n4', courseId: 'c-sql-foundations', status: 'completed',
    domain: 'Technical', prereqs: [], x: 6, y: 67
  },
  {
    id: 'n5', courseId: 'c-statistical-programming', status: 'current',
    domain: 'Statistical', prereqs: ['n3'], x: 51, y: 20
  },
  {
    id: 'n6', courseId: 'c-data-engineering', status: 'recommended',
    domain: 'Technical', prereqs: ['n4'], x: 22, y: 67
  },
  {
    id: 'n7', courseId: 'c-data-privacy', status: 'recommended',
    domain: 'Digital Governance', prereqs: [], x: 53, y: 76
  },
  {
    id: 'n8', courseId: 'c-ml-fundamentals', status: 'locked',
    domain: 'Technical', prereqs: ['n5'], x: 67, y: 20
  },
  {
    id: 'n9', courseId: 'c-gis-intro', status: 'locked',
    domain: 'Technical', prereqs: ['n3'], x: 36, y: 44
  },
  {
    id: 'n10', courseId: 'c-analytics-track', status: 'locked',
    domain: 'Statistical', prereqs: ['n5', 'n6'], x: 75, y: 55
  },
  {
    id: 'n11', courseId: 'c-cloud-fundamentals', status: 'locked',
    domain: 'Digital Governance', prereqs: ['n7'], x: 72, y: 87
  },
  {
    id: 'n12', courseId: 'c-applied-ai-stats', status: 'locked',
    domain: 'Technical', prereqs: ['n8'], x: 83, y: 20
  },
  {
    id: 'n13', courseId: 'c-comms-leadership', status: 'completed',
    domain: 'Behavioural', prereqs: [], x: 90, y: 77
  }
];

export function connectorsForNodes(nodes) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const links = [];
  nodes.forEach((n) => {
    n.prereqs.forEach((p) => {
      if (byId[p]) links.push({ from: byId[p], to: n });
    });
  });
  return links;
}

export function prereqTitlesFor(node, nodes, coursesById) {
  return node.prereqs.map((id) => {
    const n = nodes.find((x) => x.id === id);
    return n ? coursesById(n.courseId)?.title : null;
  }).filter(Boolean);
}
