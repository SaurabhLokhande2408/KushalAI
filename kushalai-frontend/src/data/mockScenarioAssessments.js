const courseBlueprints = {
  'c-python-basics': {
    title: 'Python Basics',
    focus: 'Python scripting and automation',
    mcq: [
      ['A reporting script fails only when a new department has no records. Which first change makes the script safer?', ['Ignore the department', 'Check for an empty collection before indexing it', 'Convert every value to a string', 'Run the script again'], 1],
      ['An officer needs to repeat the same validation for every row in a file. Which approach is most maintainable?', ['Copy the validation many times', 'Put the rule in a function and call it for each row', 'Use random values for missing rows', 'Print the file without checking it'], 1],
      ['A program should choose one action when a score is above a threshold and another otherwise. Which construct fits?', ['A conditional statement', 'A comment', 'A module import', 'A list literal'], 0],
      ['A small automation script has to preserve the order of incoming records while transforming each one. Which structure is the natural starting point?', ['A list processed in sequence', 'A set that discards order', 'A single Boolean', 'A numeric constant'], 0]
    ],
    short: [
      'A batch script receives a mix of valid and malformed rows from three offices. Explain how you would structure the Python code so one bad row is reported without stopping the complete run.',
      'You inherit a Python function that works for one fixed filename and date. Explain how you would turn it into a reusable function for several offices and reporting periods.',
      'An automation task produces a result that looks wrong but does not crash. Describe the debugging steps and small checks you would add before changing the logic.'
    ],
    long: [
      'A district team manually combines weekly spreadsheets into a summary. Propose a Python automation approach, including input validation, file handling, error reporting, and how you would verify that the output is trustworthy.',
      'You are asked to maintain a small Python utility used by non-programmers. Explain how you would make its control flow, functions, configuration, and failure messages understandable and safe to operate.',
      'A scheduled script has started taking twice as long after the number of records increased. Develop a practical investigation and improvement plan using measurements, simpler data structures, and a regression check.'
    ]
  },
  'c-python-data-analysis': {
    title: 'Python for Data Analysis', focus: 'cleaning, transforming, and interpreting tabular data',
    mcq: [
      ['A training dataset has blank values in a required numeric field. What should happen before analysis?', ['Silently replace all blanks with zero', 'Profile the missingness and choose a justified treatment', 'Delete the column immediately', 'Sort the rows alphabetically'], 1],
      ['Two files use different spellings for the same district. Which step is most important before combining them?', ['Standardise and validate the district keys', 'Add random rows', 'Remove the date field', 'Change every value to a percentage'], 0],
      ['A stakeholder asks whether training hours are associated with scores. Which first step is most useful?', ['Inspect distributions, quality, and relationship between the variables', 'Assume causation', 'Only calculate the maximum score', 'Hide missing records'], 0],
      ['A data transformation unexpectedly doubles row count. What should you inspect first?', ['The join or reshape keys and duplication pattern', 'The screen brightness', 'The chart colour', 'The file extension'], 0]
    ],
    short: [
      'You receive employee training hours and assessment scores from several offices. Explain how you would clean and explore the data before describing any relationship.',
      'A merge creates duplicate employee records. Describe the checks you would perform to find the cause and confirm the corrected result.',
      'A manager wants one number summarising a highly skewed service-time field. Explain what you would report and why.'
    ],
    long: [
      'A department wants to understand why service completion varies across regions. Design an analysis using Python, covering data preparation, useful comparisons, uncertainty, and how you would communicate limits to decision-makers.',
      'A monthly dashboard has shown a sudden improvement after a data pipeline change. Explain how you would determine whether the improvement is real, a population change, or a data-quality artefact.',
      'Plan a reproducible exploratory analysis for a public-sector dataset that will be updated every month. Include validation rules, transformation documentation, outputs, and review points.'
    ]
  },
  'c-pandas-numpy': {
    title: 'Pandas & NumPy Deep Dive', focus: 'DataFrame transformations and efficient array operations',
    mcq: [
      ['A DataFrame operation must apply the same numeric formula to a whole column. Which approach is usually clearest and efficient?', ['Vectorised column operations', 'A manual screen edit for every row', 'A random sample only', 'A chart annotation'], 0],
      ['A time-series DataFrame has duplicate date keys. What should you do before resampling?', ['Investigate and resolve the duplicate-key meaning', 'Drop dates without review', 'Convert dates to colours', 'Use the first row silently'], 0],
      ['A NumPy array calculation returns an unexpected shape. Which check is most relevant?', ['Inspect the dimensions and broadcasting rules', 'Change the column names', 'Increase font size', 'Export to PDF'], 0],
      ['A large table is slow because a loop repeatedly appends rows. What is a better pattern?', ['Collect records and build the DataFrame once', 'Print each row twice', 'Convert all values to strings', 'Add more nested loops'], 0]
    ],
    short: [
      'A DataFrame contains inconsistent categories, missing values, and duplicate identifiers. Outline a Pandas workflow to diagnose and correct those issues.',
      'Explain how you would use NumPy arrays to compare two numeric measures while avoiding accidental shape or broadcasting errors.',
      'A transformation gives the expected totals but the wrong row-level values. Describe the intermediate DataFrame checks you would use.'
    ],
    long: [
      'You are building a monthly processing notebook for administrative data. Describe a robust Pandas and NumPy pipeline, including schema checks, joins, vectorised transformations, and validation of final aggregates.',
      'A notebook is correct on a small sample but too slow on the full dataset. Develop a performance plan that distinguishes algorithmic changes, memory concerns, and premature optimisation.',
      'Design a reviewable data transformation that converts event records into district-level indicators. Explain grouping choices, missing-data treatment, reproducibility, and how you would test it.'
    ]
  },
  'c-statistical-programming': {
    title: 'Statistical Programming', focus: 'uncertainty, sampling, and official statistical analysis',
    mcq: [
      ['A survey estimate changes substantially between samples. Which response is most appropriate?', ['Quantify sampling uncertainty before drawing a conclusion', 'Choose the estimate that supports the policy', 'Remove unusual samples', 'Report only the largest value'], 0],
      ['A distribution is strongly right-skewed. Which summary is often more informative alongside a plot?', ['Median and relevant percentiles', 'Only the maximum', 'A random category', 'The row number'], 0],
      ['A test produces p = 0.03 at a predeclared 0.05 level. What is the careful interpretation?', ['The result is evidence against the null under the stated assumptions', 'There is a 3% chance the data exists', 'The effect is automatically important', 'The null is proven false'], 0],
      ['Two predictors are highly correlated in a regression. What risk should be investigated?', ['Unstable coefficient estimates from multicollinearity', 'Guaranteed causation', 'Missing chart labels', 'A larger population'], 0]
    ],
    short: [
      'A policy team sees a difference between two regions. Explain how you would separate a meaningful difference from sampling variation.',
      'Describe how you would communicate a confidence interval to a non-technical stakeholder without implying it is a probability about one fixed parameter.',
      'A regression has a strong overall fit but unstable individual coefficients. Explain what diagnostics and context you would inspect.'
    ],
    long: [
      'Design a statistical analysis for estimating the prevalence of a service-access problem from survey data. Cover sampling, weighting, missing responses, uncertainty, and communication of limitations.',
      'A published indicator changes after a questionnaire redesign. Develop an investigation to determine whether the change reflects reality, measurement effects, or processing differences.',
      'A senior officer asks for a single hypothesis test to settle a complex policy question. Explain a more responsible analysis plan, including effect size, uncertainty, assumptions, and decision context.'
    ]
  },
  'c-ml-fundamentals': {
    title: 'Machine Learning Fundamentals', focus: 'model selection, features, evaluation, and overfitting',
    mcq: [
      ['A classifier performs well on training data but poorly on unseen cases. What is the likely issue?', ['Overfitting', 'Under-reporting', 'A missing chart title', 'Random sampling success'], 0],
      ['A target outcome is rare. Which evaluation view is more useful than accuracy alone?', ['Precision, recall, and a confusion matrix', 'Only the number of features', 'Training time only', 'The largest class count'], 0],
      ['Information from the test set is used while tuning features. What has happened?', ['Evaluation leakage', 'Randomisation', 'Anonymisation', 'Normalisation'], 0],
      ['A model is used to prioritise field inspections. What should be checked before deployment?', ['Performance, fairness, explainability, and operational consequences', 'Only training accuracy', 'Whether the code has comments', 'The colour of the dashboard'], 0]
    ],
    short: [
      'You have labelled cases from last year and want to predict a service outcome this year. Explain how you would split data and evaluate a model without leakage.',
      'A model ranks cases accurately overall but misses a group with few examples. Describe the checks and mitigations you would consider.',
      'Explain how feature engineering can improve a model and how you would guard against creating features that reveal the answer.'
    ],
    long: [
      'A department wants to identify cases needing early intervention. Propose an end-to-end machine-learning approach, including target definition, data preparation, baseline, evaluation, human review, and monitoring.',
      'Two models have similar scores but different error patterns and explanations. Develop a selection framework for a public-sector setting where accountability matters.',
      'A deployed model gradually loses performance as policy and population change. Explain a monitoring, review, and retraining plan that keeps decisions responsible.'
    ]
  },
  'c-applied-ai-stats': {
    title: 'Applied AI for Official Statistics', focus: 'responsible AI workflows for forecasting, anomaly detection, and classification',
    mcq: [
      ['An anomaly detector flags a legitimate seasonal spike. What should the team do first?', ['Review context and seasonal patterns before labelling it an error', 'Delete every flagged record', 'Increase the alert threshold blindly', 'Publish the alert as a finding'], 0],
      ['A forecasting model is evaluated using future information. What problem does this create?', ['Temporal leakage and an overly optimistic result', 'Better privacy', 'A larger sample', 'A valid deployment test'], 0],
      ['An AI system produces a recommendation for an official statistic. What must remain clear?', ['The data, method, uncertainty, and human accountability', 'Only the model name', 'The vendor logo', 'The number of prompts'], 0],
      ['A generative model drafts a narrative from a table. Which safeguard is essential?', ['Validate every claim against the source data', 'Publish without review', 'Remove the table', 'Ask it to sound confident'], 0]
    ],
    short: [
      'An AI workflow proposes a forecast for monthly registrations. Explain the validation and human review steps before sharing it externally.',
      'Describe how you would investigate an anomaly alert that appears only for one region and one month.',
      'A stakeholder asks why an AI recommendation should be trusted. Explain what evidence and limitations you would present.'
    ],
    long: [
      'Design a responsible AI workflow for detecting unusual patterns in official statistics. Cover data quality, seasonal baselines, model evaluation, false positives, privacy, and escalation to analysts.',
      'A generative assistant is proposed for drafting statistical briefs. Develop a controlled pilot plan with source grounding, review responsibilities, error logging, and release criteria.',
      'Compare a simple statistical baseline with a more complex AI model for forecasting public demand. Explain how you would choose between them using accuracy, stability, interpretability, and operational cost.'
    ]
  },
  'c-sql-foundations': {
    title: 'SQL Foundations', focus: 'queries, joins, aggregation, and reliable reporting',
    mcq: [
      ['A report needs all districts, including those with no transactions this month. Which join pattern helps?', ['A left join from the district table', 'An inner join from transactions', 'A cross join without a condition', 'A union of unrelated columns'], 0],
      ['A query must filter groups after SUM is calculated. Which clause is appropriate?', ['HAVING', 'WHERE', 'ORDER BY', 'SELECT'], 0],
      ['A join unexpectedly multiplies totals. What should you inspect?', ['The relationship and key uniqueness on both sides', 'The screen width', 'The database font', 'The order of comments'], 0],
      ['A monthly report should be repeatable and auditable. Which practice helps most?', ['Explicit columns, documented filters, and tested query logic', 'SELECT * everywhere', 'Manual deletion of rows', 'Unrecorded edits'], 0]
    ],
    short: [
      'You must report service counts by district and month. Describe the tables, joins, grouping, and validation checks you would use.',
      'Explain why a WHERE filter and a HAVING filter behave differently in an aggregate query, using a reporting example.',
      'A query is slow after a table grows. Describe the first checks you would make before changing the query.'
    ],
    long: [
      'Design a SQL reporting workflow for citizen-service requests. Include data-quality checks, joins, aggregation, treatment of missing districts, and reconciliation against a trusted total.',
      'A dashboard shows a sudden drop caused by a changed status code. Explain how you would trace the issue from source data through SQL transformations and communicate the correction.',
      'You inherit a query with nested subqueries and unclear aliases. Propose a maintainable rewrite and explain how you would test that it preserves the intended result.'
    ]
  },
  'c-data-engineering': {
    title: 'Data Engineering Essentials', focus: 'pipelines, schemas, data quality, and dependable delivery',
    mcq: [
      ['A daily pipeline receives the same file twice. What design prevents duplicate loading?', ['An idempotent load keyed by a stable record or file identifier', 'Appending everything blindly', 'Deleting the destination table', 'Skipping all future files'], 0],
      ['A source column changes from numeric to text. What should happen?', ['Fail or quarantine the batch with a clear schema alert', 'Silently truncate values', 'Ignore the column', 'Change the dashboard title'], 0],
      ['A pipeline step succeeds but produces zero rows. Which control is useful?', ['A row-count and freshness quality check', 'A longer password', 'A random retry', 'A new chart colour'], 0],
      ['A transformation must be rerun after a correction. What helps?', ['Versioned, observable stages with clear inputs and outputs', 'Manual edits in production', 'Untracked local files', 'Deleting logs'], 0]
    ],
    short: [
      'Outline the stages of a reliable pipeline that ingests monthly administrative records and produces a reporting table.',
      'Explain how you would design data-quality checks for completeness, uniqueness, validity, and timeliness.',
      'A pipeline is late but its last successful output is available. Describe how you would communicate and manage that operational state.'
    ],
    long: [
      'Design a small data pipeline for combining regional submissions. Cover schema contracts, landing data, validation, transformation, idempotency, monitoring, and recovery.',
      'A department wants to move from manual spreadsheet consolidation to a managed process. Develop a migration plan that protects reporting continuity and builds trust in the new outputs.',
      'A quality incident caused incorrect indicators to be published. Explain the technical response, root-cause review, audit trail, stakeholder communication, and prevention measures.'
    ]
  },
  'c-analytics-track': {
    title: 'Analytics for Policy Decisions', focus: 'turning evidence into decision-ready policy analysis',
    mcq: [
      ['A policy option improves an outcome while costing more. Which analysis is needed?', ['Compare outcomes, costs, assumptions, and distributional effects', 'Report only the improvement', 'Choose the cheapest without evidence', 'Ignore affected groups'], 0],
      ['A correlation is found after a programme starts. What should be avoided?', ['Claiming causation without a credible comparison or design', 'Checking data quality', 'Describing uncertainty', 'Testing alternative explanations'], 0],
      ['A decision-maker asks for a single average effect. What else may matter?', ['Variation across groups and implementation context', 'The analyst’s preference', 'Only the largest subgroup', 'No assumptions'], 0],
      ['A chart is technically correct but misleading because of scale. What should be reviewed?', ['Axis, baseline, annotations, and intended interpretation', 'The database password', 'The file name only', 'Whether the chart is animated'], 0]
    ],
    short: [
      'A policy team has two interventions and limited resources. Explain how you would structure an evidence-based comparison.',
      'Describe how you would turn a statistical result into a clear recommendation while keeping uncertainty visible.',
      'A stakeholder disputes an analysis because it conflicts with experience. Explain how you would investigate the disagreement constructively.'
    ],
    long: [
      'A ministry must prioritise districts for a new service programme. Develop a decision framework using evidence, need, feasibility, equity, uncertainty, and stakeholder review.',
      'Historical data suggests an intervention worked, but implementation varied widely. Design an analysis that distinguishes programme effect, context, and selection bias.',
      'Write a plan for presenting a complex analysis to senior policy stakeholders, including the decision question, evidence, limitations, scenarios, and recommended next steps.'
    ]
  },
  'c-data-privacy': {
    title: 'Data Privacy & Protection', focus: 'privacy, anonymisation, access, and responsible citizen-data handling',
    mcq: [
      ['A team wants to share a citizen dataset with analysts. What is the first responsible step?', ['Confirm purpose, lawful access, minimisation, and safeguards', 'Email the raw file', 'Remove only the name column', 'Publish it publicly'], 0],
      ['A dataset has rare combinations that can identify people. What should be considered?', ['Re-identification risk from quasi-identifiers', 'Only the file size', 'A brighter dashboard', 'Changing the title'], 0],
      ['Which control helps investigate inappropriate access?', ['Least privilege with audit logging', 'A shared password', 'No access records', 'A public link'], 0],
      ['Anonymisation is irreversible and risk-free in every context. How should this claim be treated?', ['As unsafe; risk depends on data, context, and possible linkage', 'As automatically true', 'As a reason to skip review', 'As a reason to collect more data'], 0]
    ],
    short: [
      'A project requests more citizen fields than it clearly needs. Explain how you would apply data minimisation and purpose limitation.',
      'Describe practical safeguards for sharing a sensitive dataset with an approved internal team.',
      'A possible privacy incident is reported. Outline the first steps you would take without destroying evidence.'
    ],
    long: [
      'Design a privacy-by-design review for a service analytics project. Cover purpose, data minimisation, access controls, retention, de-identification, risk assessment, and accountability.',
      'A dataset is technically anonymised but can be linked with a public register. Develop a re-identification risk assessment and mitigation plan.',
      'Create a responsible data-handling lifecycle for citizen records from collection to deletion, explaining controls and review responsibilities at each stage.'
    ]
  },
  'c-cloud-fundamentals': {
    title: 'Cloud Fundamentals for Government', focus: 'cloud architecture, security, reliability, and public-sector operations',
    mcq: [
      ['A service stores sensitive records in the cloud. Which decision should come first?', ['Classify data and define security, residency, and access requirements', 'Choose the cheapest region blindly', 'Make the bucket public', 'Disable logging'], 0],
      ['A workload must continue after one availability zone fails. What design principle helps?', ['Redundancy across failure domains', 'A single larger server only', 'No backups', 'Manual screenshots'], 0],
      ['A team cannot explain a sudden cloud bill. Which capability is needed?', ['Usage monitoring, budgets, and cost allocation', 'More unused resources', 'Deleted logs', 'A new domain name'], 0],
      ['A cloud deployment changes infrastructure manually and loses track of differences. What would improve it?', ['Versioned infrastructure configuration and review', 'More undocumented clicks', 'Shared admin credentials', 'No change history'], 0]
    ],
    short: [
      'Explain how you would decide whether a government workload belongs in a public, private, or hybrid cloud arrangement.',
      'A service is available but difficult to recover after an incident. Describe the reliability and backup questions you would ask.',
      'Outline the minimum operational controls you would expect for a cloud-hosted public service.'
    ],
    long: [
      'Propose a cloud architecture for a public reporting service. Cover data classification, identity, network boundaries, resilience, observability, cost management, and compliance.',
      'A legacy application is being migrated to the cloud. Develop a phased plan that includes discovery, risk controls, testing, cutover, rollback, and staff readiness.',
      'A cloud provider outage affects a critical service. Explain an incident response and continuity plan, including communication, failover, recovery objectives, and lessons learned.'
    ]
  },
  'c-gis-intro': {
    title: 'Introduction to GIS', focus: 'spatial data, mapping, and geographic decision-making',
    mcq: [
      ['Two spatial layers do not line up on a map. What should be checked first?', ['Coordinate reference systems and transformations', 'The map title', 'The number of colours', 'The printer ink'], 0],
      ['A district needs to find households within five kilometres of a clinic. Which operation fits?', ['A spatial buffer and overlay or spatial query', 'A text sort', 'A random sample only', 'A pie chart'], 0],
      ['A choropleth map compares rates across districts. Which issue can mislead interpretation?', ['Different population sizes and inappropriate classification', 'Using a legend', 'Adding a north arrow', 'Saving the map'], 0],
      ['A point layer contains inaccurate locations. What is the consequence?', ['Spatial analysis and decisions may be systematically wrong', 'Only the font changes', 'The database becomes encrypted', 'Nothing changes'], 0]
    ],
    short: [
      'A health team wants to map service access. Describe the spatial data you would need and the quality checks before analysis.',
      'Explain why a map projection and coordinate reference system matter when combining geographic layers.',
      'A map shows a cluster of complaints. Describe how you would check whether the pattern reflects reporting behaviour or a real geographic concentration.'
    ],
    long: [
      'Design a GIS analysis to identify areas underserved by public facilities. Cover spatial data sources, projections, accessibility measures, validation, uncertainty, and how results support decisions.',
      'A district boundary change breaks a time-series map. Develop a method for comparing periods while explaining the effects of changing geography.',
      'A senior officer wants a single map to allocate resources. Explain how you would combine spatial evidence with population, need, equity, and local knowledge rather than treating the map as the decision.'
    ]
  },
  'c-comms-leadership': {
    title: 'Communication for Public Officers', focus: 'clear, accountable communication of evidence to stakeholders',
    mcq: [
      ['A technical analysis is going to a non-technical committee. What should the briefing lead with?', ['The decision question, key finding, evidence, and implication', 'Every implementation detail first', 'A dense table without context', 'An unexplained acronym'], 0],
      ['A stakeholder asks for a confident claim beyond the evidence. What is the best response?', ['State what is known, what is uncertain, and what further evidence is needed', 'Remove the caveat', 'Invent a precise number', 'Avoid answering'], 0],
      ['A meeting includes agencies with conflicting priorities. Which leadership practice helps?', ['Make assumptions and trade-offs explicit and invite accountable input', 'Let the loudest person decide', 'Hide disagreement', 'Send an unreadable report'], 0],
      ['A public correction is required after an error. What builds trust?', ['Explain the error, impact, correction, and prevention steps clearly', 'Delete the original silently', 'Blame the audience', 'Ignore the issue'], 0]
    ],
    short: [
      'Turn a complex analytical finding into a two-minute briefing for a senior officer. Explain the structure you would use.',
      'A colleague challenges your recommendation in a meeting. Describe how you would listen, clarify the evidence, and move toward a decision.',
      'Explain how you would communicate uncertainty without making a useful analysis sound indecisive.'
    ],
    long: [
      'Prepare a communication strategy for a data-informed policy recommendation involving several departments. Cover audiences, key messages, evidence, objections, accountability, and follow-up.',
      'A public report contains a material analytical error discovered after release. Develop a correction and stakeholder communication plan that protects accuracy and trust.',
      'You are leading a cross-functional team through a contested decision. Explain how you would create shared understanding, surface trade-offs, record decisions, and maintain momentum.'
    ]
  }
};

function buildAssessment(courseId, blueprint) {
  const questions = [
    ...blueprint.mcq.map(([prompt, options, correctOption], index) => ({
      id: `${courseId}-mcq-${index + 1}`,
      type: 'mcq',
      scenario: `You are applying ${blueprint.focus} in a live workplace task.`,
      prompt,
      options,
      correctOption,
      explanation: 'This response begins with a documented, evidence-based check before taking an irreversible action.'
    })),
    ...blueprint.short.map((prompt, index) => ({
      id: `${courseId}-short-${index + 1}`,
      type: 'short',
      scenario: `A colleague asks you to make a practical decision using ${blueprint.focus}.`,
      prompt,
      expectedPoints: ['clear steps', 'relevant checks', 'limitations or risks']
    })),
    ...blueprint.long.map((prompt, index) => ({
      id: `${courseId}-long-${index + 1}`,
      type: 'long',
      scenario: `You are responsible for delivering a defensible workplace outcome using ${blueprint.focus}.`,
      prompt,
      expectedPoints: ['problem framing', 'method and evidence', 'implementation and review']
    }))
  ];

  return { courseId, questions };
}

export const scenarioAssessments = Object.fromEntries(
  Object.entries(courseBlueprints).map(([courseId, blueprint]) => [courseId, buildAssessment(courseId, blueprint)])
);

export const demoScenarioAssessmentAttempts = [
  {
    id: 'scenario-demo-attempt-1',
    courseId: 'c-python-basics',
    courseTitle: 'Python Basics',
    completedAt: '2026-09-03T09:30:00.000Z',
    mcqScore: 3,
    mcqTotal: 4
  },
  {
    id: 'scenario-demo-attempt-2',
    courseId: 'c-statistical-programming',
    courseTitle: 'Statistical Programming',
    completedAt: '2026-09-12T10:15:00.000Z',
    mcqScore: 2,
    mcqTotal: 4
  },
  {
    id: 'scenario-demo-attempt-3',
    courseId: 'c-python-data-analysis',
    courseTitle: 'Python for Data Analysis',
    completedAt: '2026-09-24T14:00:00.000Z',
    mcqScore: 4,
    mcqTotal: 4
  }
];
