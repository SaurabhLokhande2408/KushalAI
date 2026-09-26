export const DEFAULT_FILE_NAME = 'AI_ML_Study_Notes_Synthetic.pdf';
export const FILE_SUMMARY = 'This document introduces the fundamentals of Artificial Intelligence and Machine Learning. It covers supervised, unsupervised, and reinforcement learning, along with features and labels, dataset splitting, classification, regression, evaluation metrics, overfitting, underfitting, and a basic machine-learning workflow.';

export function getDemoResponse(question, material) {
  const text = question.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ');
  let response;

  if (text.includes('classification') && text.includes('regression')) {
    response = 'Classification predicts a category or class, while regression predicts a numeric value. Both are supervised-learning tasks that learn from labeled examples.';
  } else if (text.includes('reinforcement')) {
    response = 'Reinforcement learning trains an agent to make decisions by interacting with an environment. The agent receives rewards or penalties and learns a policy that aims to maximize its cumulative reward.';
  } else if (text.includes('unsupervised')) {
    response = 'Unsupervised learning looks for structure in data that has no predefined labels. A common use is clustering, where similar examples are grouped based on their features.';
  } else if (text.includes('supervised')) {
    response = 'Supervised learning is a machine-learning approach where a model learns from labeled training data. Each example contains input features and a known target or label. The model learns the relationship between them so it can make predictions on new, unseen examples. Two common supervised-learning tasks are classification and regression.';
  } else if (text.includes('overfitting')) {
    response = 'Overfitting happens when a model learns the training examples too closely, including noise, and then performs poorly on new data. A separate validation set can help identify it before final testing.';
  } else if (text.includes('underfitting')) {
    response = 'Underfitting happens when a model is too simple to capture important patterns in the training data. It tends to perform poorly on both training examples and new examples.';
  } else if (text.includes('feature')) {
    response = 'A feature is an input variable used by a model to make a prediction. In a dataset about houses, for example, floor area could be a feature.';
  } else if (text.includes('label') || text.includes('target')) {
    response = 'A label, also called a target, is the known answer paired with an example in supervised-learning data. During training, the model learns to predict that target from the example’s features.';
  } else if (text.includes('split') || text.includes('validation') || text.includes('training') || text.includes('testing') || text.includes('test data')) {
    response = 'A train/test split separates examples used to fit a model from examples held back to evaluate it. Training data teaches the model; test data estimates how well it handles unseen examples. A validation set can help tune model choices before the final test.';
  } else if (text.includes('evaluation') || text.includes('evaluate') || text.includes('metric')) {
    response = 'Model evaluation uses measures suited to the task to compare predictions with known outcomes. Classification and regression need different evaluation measures.';
  } else if (text.includes('workflow') || text.includes('steps')) {
    response = 'A basic machine-learning workflow is to define the problem, prepare features and labels, split the data into training, validation, and testing sets, train a model, evaluate it, and refine it before final testing.';
  } else if (text.includes('artificial intelligence') || text.includes('machine learning')) {
    response = 'Artificial intelligence is the broader field of building systems that perform tasks associated with intelligent behavior. Machine learning is an approach within AI where models learn patterns from data.';
  } else {
    response = 'I can help with supervised, unsupervised, or reinforcement learning; classification; regression; overfitting; features and labels; or train/test splits.';
  }

  if (!material) return response;
  if (material.fileName === DEFAULT_FILE_NAME) return `From your AI and Machine Learning study notes: ${response}`;
  return `I can’t inspect the contents of ${material.fileName} in this local demo. In general: ${response}`;
}