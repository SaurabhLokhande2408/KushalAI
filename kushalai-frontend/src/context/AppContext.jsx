import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoOfficer, demoAdmin } from '../data/mockUsers';
import { roadmapNodes as initialRoadmap } from '../data/mockRoadmap';
import { quizTrendHistory as initialQuizHistory } from '../data/mockQuizzes';

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

export function AppProvider({ children }) {
  const persisted = loadPersisted();

  const [user, setUser] = useState(persisted?.user ?? null);
  const [disciplineScore, setDisciplineScore] = useState(persisted?.disciplineScore ?? demoOfficer.disciplineScore);
  const [disciplineLog, setDisciplineLog] = useState(
    persisted?.disciplineLog ?? [{ label: 'Daily login', delta: 1 }]
  );
  const [roadmap, setRoadmap] = useState(persisted?.roadmap ?? initialRoadmap);
  const [quizHistory, setQuizHistory] = useState(persisted?.quizHistory ?? initialQuizHistory);
  const [courseCompletion, setCourseCompletion] = useState(
    persisted?.courseCompletion ?? { completed: 9, inProgress: 3, recommended: 4 }
  );
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const payload = { user, disciplineScore, disciplineLog, roadmap, quizHistory, courseCompletion };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [user, disciplineScore, disciplineLog, roadmap, quizHistory, courseCompletion]);

  function showToast(message, variant = 'info') {
    setToast({ message, variant, id: Date.now() });
  }

  function loginAsDemo(role) {
    const account = role === 'admin' ? demoAdmin : demoOfficer;
    setUser(account);
    if (role !== 'admin') {
      setDisciplineLog((log) => [{ label: 'Daily login', delta: 1 }, ...log].slice(0, 8));
      showToast('Welcome back — daily login recorded (+1 Discipline Score).', 'success');
    }
  }

  function logout() {
    setUser(null);
  }

  function completeNode(nodeId) {
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
    setDisciplineScore((s) => s + 10);
    setDisciplineLog((log) => [{ label: 'Course completed', delta: 10 }, ...log].slice(0, 8));
    setCourseCompletion((c) => ({ ...c, completed: c.completed + 1, inProgress: Math.max(0, c.inProgress - 1) }));
  }

  function recordQuizResult(courseTitle, scorePercent) {
    setQuizHistory((h) => [...h.slice(-5), { attempt: `Attempt ${h.length + 1}`, score: scorePercent }]);
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
      courseCompletion,
      toast,
      showToast,
      clearToast: () => setToast(null)
    }),
    [user, disciplineScore, disciplineLog, roadmap, quizHistory, courseCompletion, toast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
