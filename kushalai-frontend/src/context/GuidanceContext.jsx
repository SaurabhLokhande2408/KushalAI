import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getDemoResponse } from '../utils/guidanceResponses';

const STORAGE_KEY = 'kushalai_guidance_conversations';
const GuidanceContext = createContext(null);

function createId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizeMaterial(material) {
  if (!material || typeof material.fileName !== 'string') return null;

  return {
    fileName: material.fileName,
    fileSize: Number.isFinite(material.fileSize) ? material.fileSize : null,
    fileType: typeof material.fileType === 'string' ? material.fileType : '',
    courseId: typeof material.courseId === 'string' ? material.courseId : null,
    courseTitle: typeof material.courseTitle === 'string' ? material.courseTitle : null,
    uploadedAt: typeof material.uploadedAt === 'string' ? material.uploadedAt : new Date().toISOString()
  };
}

function isValidMessage(message) {
  return message && typeof message.id === 'string' &&
    (message.role === 'user' || message.role === 'assistant') &&
    typeof message.content === 'string' && typeof message.timestamp === 'string';
}

function loadStore() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || !Array.isArray(parsed.conversations)) {
      return { conversations: [], selectedConversationId: null };
    }

    const conversations = parsed.conversations
      .filter((conversation) => conversation && typeof conversation.id === 'string')
      .map((conversation) => ({
        id: conversation.id,
        title: typeof conversation.title === 'string' ? conversation.title : 'New conversation',
        createdAt: typeof conversation.createdAt === 'string' ? conversation.createdAt : new Date().toISOString(),
        updatedAt: typeof conversation.updatedAt === 'string' ? conversation.updatedAt : new Date().toISOString(),
        material: normalizeMaterial(conversation.material),
        messages: Array.isArray(conversation.messages) ? conversation.messages.filter(isValidMessage) : []
      }));
    const selectedConversationId = conversations.some((item) => item.id === parsed.selectedConversationId)
      ? parsed.selectedConversationId
      : conversations[0]?.id || null;

    return { conversations, selectedConversationId };
  } catch {
    return { conversations: [], selectedConversationId: null };
  }
}

function titleForMaterial(material) {
  if (material?.courseTitle) return material.courseTitle;
  if (material?.fileName) return material.fileName.replace(/\.[^.]+$/, '');
  return 'New conversation';
}

function createMessage(role, content, timestamp) {
  return { id: createId(), role, content, timestamp };
}

export function GuidanceProvider({ children }) {
  const [store, setStore] = useState(loadStore);
  const storeRef = useRef(store);
  storeRef.current = store;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      // Keep the workspace usable when storage is unavailable or full.
    }
  }, [store]);

  function updateStore(updater) {
    const next = updater(storeRef.current);
    storeRef.current = next;
    setStore(next);
    return next;
  }

  function createConversation({ title, material } = {}) {
    const timestamp = new Date().toISOString();
    const normalizedMaterial = normalizeMaterial(material);
    const conversation = {
      id: createId(),
      title: title?.trim() || titleForMaterial(normalizedMaterial),
      createdAt: timestamp,
      updatedAt: timestamp,
      material: normalizedMaterial,
      messages: []
    };

    updateStore((current) => ({
      conversations: [conversation, ...current.conversations],
      selectedConversationId: conversation.id
    }));
    return conversation;
  }

  function ensureConversation() {
    const current = storeRef.current;
    const selected = current.conversations.find((item) => item.id === current.selectedConversationId);
    if (selected) return selected;

    const existing = current.conversations[0];
    if (existing) {
      updateStore((state) => ({ ...state, selectedConversationId: existing.id }));
      return existing;
    }

    return createConversation();
  }

  function selectConversation(id) {
    if (!storeRef.current.conversations.some((item) => item.id === id)) return;
    updateStore((current) => ({ ...current, selectedConversationId: id }));
  }

  function attachMaterial(material, conversationId) {
    const normalizedMaterial = normalizeMaterial({ ...material, uploadedAt: new Date().toISOString() });
    if (!normalizedMaterial) return null;

    const current = storeRef.current;
    const selected = current.conversations.find((item) => item.id === (conversationId || current.selectedConversationId));
    if (!selected) return createConversation({ material: normalizedMaterial });

    updateStore((state) => ({
      ...state,
      selectedConversationId: selected.id,
      conversations: state.conversations.map((item) => item.id === selected.id
        ? {
            ...item,
            title: item.title === 'New conversation' ? titleForMaterial(normalizedMaterial) : item.title,
            material: normalizedMaterial,
            updatedAt: normalizedMaterial.uploadedAt
          }
        : item)
    }));
    return selected.id;
  }

  function sendMessage(content) {
    const question = content.trim();
    if (!question) return;

    let current = storeRef.current;
    let conversation = current.conversations.find((item) => item.id === current.selectedConversationId);
    if (!conversation) conversation = ensureConversation();

    const timestamp = new Date().toISOString();
    const answer = getDemoResponse(question, conversation.material);
    const firstUserMessage = !conversation.messages.some((message) => message.role === 'user');
    const nextTitle = firstUserMessage && conversation.title === 'New conversation'
      ? question.length > 42 ? `${question.slice(0, 39)}...` : question
      : conversation.title;

    updateStore((state) => ({
      ...state,
      conversations: state.conversations.map((item) => item.id === conversation.id
        ? {
            ...item,
            title: nextTitle,
            updatedAt: timestamp,
            messages: [
              ...item.messages,
              createMessage('user', question, timestamp),
              createMessage('assistant', answer, timestamp)
            ]
          }
        : item)
    }));
  }

  function renameConversation(id, title) {
    const nextTitle = title.trim();
    if (!nextTitle) return;
    updateStore((current) => ({
      ...current,
      conversations: current.conversations.map((item) => item.id === id
        ? { ...item, title: nextTitle, updatedAt: new Date().toISOString() }
        : item)
    }));
  }

  function deleteConversation(id) {
    updateStore((current) => {
      const conversations = current.conversations.filter((item) => item.id !== id);
      const selectedConversationId = current.selectedConversationId === id
        ? conversations[0]?.id || null
        : current.selectedConversationId;
      return { conversations, selectedConversationId };
    });
  }

  const selectedConversation = store.conversations.find(
    (item) => item.id === store.selectedConversationId
  ) || null;

  const value = useMemo(() => ({
    conversations: store.conversations,
    selectedConversation,
    selectedConversationId: store.selectedConversationId,
    createConversation,
    ensureConversation,
    selectConversation,
    attachMaterial,
    sendMessage,
    renameConversation,
    deleteConversation
  }), [store, selectedConversation]);

  return <GuidanceContext.Provider value={value}>{children}</GuidanceContext.Provider>;
}

export function useGuidance() {
  const context = useContext(GuidanceContext);
  if (!context) throw new Error('useGuidance must be used within GuidanceProvider');
  return context;
}