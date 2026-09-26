import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button, EmptyState } from '../components/common/UI';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EmptyState
        icon={<Compass size={26} />}
        title="Page not found"
        message="The page you're looking for doesn't exist or may have moved."
        action={<Button onClick={() => navigate('/')}>Back to home</Button>}
      />
    </div>
  );
}
