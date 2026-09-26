import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { PublicFooter } from '../components/common/Footer';

export default function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <PublicFooter />
    </>
  );
}