import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { AuthenticatedFooter } from '../components/common/Footer';

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <AuthenticatedFooter />
    </>
  );
}