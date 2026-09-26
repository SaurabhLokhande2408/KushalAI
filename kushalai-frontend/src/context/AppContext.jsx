import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { demoOfficer, demoAdmin } from '../data/mockUsers';
import { roadmapNodes as initialRoadmap } from '../data/mockRoadmap';
import { quizTrendHistory as initialQuizHistory } from '../data/mockQuizzes';
import { demoScenarioAssessmentAttempts } from '../data/mockScenarioAssessments';

const STORAGE_KEY = 'kushalai-demo-state-v1';

const AppContext = createContext(null);

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getCalendarDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function daysBetween(startDate, endDate) {
  return Math.floor(
    (new Date(`${endDate}T00:00:00.000Z`) - new Date(`${startDate}T00:00:00.000Z`)) /
      86400000
  );
}

function addCalendarDays(date, days) {
  const result = new Date(`${date}T00:00:00.000Z`);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function createInitialState() {
  const persisted = loadPersisted();
  const lastLoginDate = isCalendarDate(persisted?.lastLoginDate) ? persisted.lastLoginDate : null;
  let lastInactivityPenaltyDate = isCalendarDate(persisted?.lastInactivityPenaltyDate)
    ? persisted.lastInactivityPenaltyDate
    : null;
  let disciplineScore = Number.isFinite(persisted?.disciplineScore)
    ? persisted.disciplineScore
    : demoOfficer.disciplineScore;
  let disciplineLog = Array.isArray(persisted?.disciplineLog) ? persisted.disciplineLog : [];

  if (lastLoginDate) {
    const elapsedDays = Math.max(0, daysBetween(lastLoginDate, getCalendarDate()));
    const eligiblePeriods = Math.floor(elapsedDays / 7);
    const daysAlreadyPenalized = lastInactivityPenaltyDate
      ? daysBetween(lastLoginDate, lastInactivityPenaltyDate)
      : 0;
    const appliedPeriods = daysAlreadyPenalized >= 7
      ? Math.floor(daysAlreadyPenalized / 7)
      : 0;
    const newPenalties = Math.max(0, eligiblePeriods - appliedPeriods);

    if (newPenalties > 0) {
      const date = new Date().toISOString();
      const penalties = Array.from({ length: newPenalties }, () => ({
        delta: -1,
        label: 'No login for 7 days',
        date
      }));
      disciplineScore -= newPenalties;
      disciplineLog = [...penalties, ...disciplineLog].slice(0, 8);
      lastInactivityPenaltyDate = addCalendarDays(lastLoginDate, eligiblePeriods * 7);
    }
  } else {
    lastInactivityPenaltyDate = null;
  }

  return {
    user: persisted?.user ?? null,
    disciplineScore,
    disciplineLog,
    roadmap: persisted?.roadmap ?? initialRoadmap,
    quizHistory: persisted?.quizHistory ?? initialQuizHistory,
    completedScenarioAssessments: Array.isArray(persisted?.completedScenarioAssessments) && persisted.completedScenarioAssessments.length >= 3
      ? persisted.completedScenarioAssessments
      : demoScenarioAssessmentAttempts.map((attempt) => attempt.courseId),
    scenarioAssessmentAttempts: Array.isArray(persisted?.scenarioAssessmentAttempts) && persisted.scenarioAssessmentAttempts.length >= 3
      ? persisted.scenarioAssessmentAttempts
      : demoScenarioAssessmentAttempts,
    courseCompletion: persisted?.courseCompletion ?? { completed: 9, inProgress: 3, recommended: 4 },
    lastLoginDate,
    lastInactivityPenaltyDate
  };
}

export function AppProvider({ children }) {
  const [initialState] = useState(createInitialState);
  const [user, setUser] = useState(initialState.user);
  const [disciplineScore, setDisciplineScore] = useState(initialState.disciplineScore);
  const [disciplineLog, setDisciplineLog] = useState(initialState.disciplineLog);
  const [roadmap, setRoadmap] = useState(initialState.roadmap);
  const [quizHistory, setQuizHistory] = useState(initialState.quizHistory);
  const [completedScenarioAssessments, setCompletedScenarioAssessments] = useState(
    initialState.completedScenarioAssessments
  );
  const [scenarioAssessmentAttempts, setScenarioAssessmentAttempts] = useState(
    initialState.scenarioAssessmentAttempts
  );
  const [courseCompletion, setCourseCompletion] = useState(initialState.courseCompletion);
  const [lastLoginDate, setLastLoginDate] = useState(initialState.lastLoginDate);
  const [lastInactivityPenaltyDate, setLastInactivityPenaltyDate] = useState(
    initialState.lastInactivityPenaltyDate
  );
  const lastLoginDateRef = useRef(initialState.lastLoginDate);
  const completedNodeIdsRef = useRef(
    new Set(initialState.roadmap.filter((node) => node.status === 'completed').map((node) => node.id))
  );
  const completedScenarioAssessmentsRef = useRef(new Set(initialState.completedScenarioAssessments));
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const payload = {
      user,
      disciplineScore,
      disciplineLog,
      roadmap,
      quizHistory,
      completedScenarioAssessments,
      scenarioAssessmentAttempts,
      courseCompletion,
      lastLoginDate,
      lastInactivityPenaltyDate
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [user, disciplineScore, disciplineLog, roadmap, quizHistory, completedScenarioAssessments, scenarioAssessmentAttempts, courseCompletion, lastLoginDate, lastInactivityPenaltyDate]);

  function showToast(message, variant = 'info') {
    setToast({ message, variant, id: Date.now() });
  }

  function loginAsDemo(role) {
    const account = role === 'admin' ? demoAdmin : demoOfficer;
    setUser(account);
    if (role !== 'admin') {
      const today = getCalendarDate();
      const isNewLoginDay = lastLoginDateRef.current !== today;

      if (isNewLoginDay) {
        const date = new Date().toISOString();
        lastLoginDateRef.current = today;
        setDisciplineScore((score) => score + 1);
        setDisciplineLog((log) => [
          { label: 'Daily login', delta: 1, date },
          ...log
        ].slice(0, 8));
        setLastLoginDate(today);
        setLastInactivityPenaltyDate(null);
      }

      showToast(
        isNewLoginDay
          ? 'Welcome back — daily login recorded (+1 Discipline Score).'
          : 'Welcome back — daily login already recorded today.',
        'success'
      );
    }
  }

  function logout() {
    setUser(null);
  }

  function completeNode(nodeId) {
    const node = roadmap.find((item) => item.id === nodeId);
    if (!node || node.status === 'completed' || completedNodeIdsRef.current.has(nodeId)) return;

    completedNodeIdsRef.current.add(nodeId);
    setRoadmap((prev) => {
      const updated = prev.map((n) => (n.id === nodeId ? { ...n, status: 'completed' } : n));
      // Unlock any locked node whose prerequisites are now all completed
      const completedIds = new Set(updated.filter((n) => n.status === 'completed').map((n) => n.id));
      return updated.map((n) => {
        if (n.status === 'locked' && n.prereqs.every((p) => completedIds.has(p))) {
          return { ...n, status: 'recommended' };
        }
        return n;
      });
    });
    const date = new Date().toISOString();
    setDisciplineScore((score) => score + 10);
    setDisciplineLog((log) => [
      { label: 'Course completed', delta: 10, date },
      ...log
    ].slice(0, 8));
    setCourseCompletion((c) => ({ ...c, completed: c.completed + 1, inProgress: Math.max(0, c.inProgress - 1) }));
  }

  function recordQuizResult(courseTitle, scorePercent) {
    setQuizHistory((h) => [...h.slice(-5), { attempt: `Attempt ${h.length + 1}`, score: scorePercent }]);
  }

  function recordScenarioAssessment(courseId, courseTitle, mcqScore, mcqTotal) {
    if (!courseId) return false;

    const isFirstCompletion = !completedScenarioAssessmentsRef.current.has(courseId);
    if (isFirstCompletion) {
      completedScenarioAssessmentsRef.current.add(courseId);
      setCompletedScenarioAssessments((assessments) => [...assessments, courseId]);
    }

    setScenarioAssessmentAttempts((attempts) => [
      ...attempts,
      {
        id: `scenario-attempt-${Date.now()}`,
        courseId,
        courseTitle,
        completedAt: new Date().toISOString(),
        mcqScore,
        mcqTotal
      }
    ]);

    if (!isFirstCompletion) return false;

    const date = new Date().toISOString();
    setDisciplineScore((score) => score + 5);
    setDisciplineLog((log) => [
      { label: 'Scenario assessment submitted', delta: 5, date },
      ...log
    ].slice(0, 8));
    return true;
  }

  const value = useMemo(
    () => ({
      user,
      loginAsDemo,
      logout,
      disciplineScore,
      disciplineLog,
      roadmap,
      setRoadmap,
      completeNode,
      quizHistory,
      recordQuizResult,
      completedScenarioAssessments,
      scenarioAssessmentAttempts,
      recordScenarioAssessment,
      courseCompletion,
      toast,
      showToast,
      clearToast: () => setToast(null)
    }),
    [user, disciplineScore, disciplineLog, roadmap, quizHistory, completedScenarioAssessments, scenarioAssessmentAttempts, courseCompletion, lastLoginDate, toast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
