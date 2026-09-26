import React from 'react';
import { Outlet } from 'react-router-dom';
import ToastHost from '../components/common/ToastHost';

export default function OfficerLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <main className="container page-shell page-enter">
        <Outlet />
      </main>

      <ToastHost />
    </div>
  );
}
