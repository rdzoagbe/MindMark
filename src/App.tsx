/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { useTheme } from './hooks/useTheme';

// Lazy load heavy pages
const CreateSession = lazy(() => import('./pages/CreateSession').then(module => ({ default: module.CreateSession })));
const EditSession = lazy(() => import('./pages/EditSession').then(module => ({ default: module.EditSession })));
const SessionDetail = lazy(() => import('./pages/SessionDetail').then(module => ({ default: module.SessionDetail })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Pricing = lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })));
const UpgradeSuccess = lazy(() => import('./pages/UpgradeSuccess').then(module => ({ default: module.UpgradeSuccess })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('./pages/Signup').then(module => ({ default: module.Signup })));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  useTheme(); // Initialize theme

  return (
    <HashRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="create" element={<CreateSession />} />
            <Route path="edit/:id" element={<EditSession />} />
            <Route path="session/:id" element={<SessionDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="upgrade-success" element={<UpgradeSuccess />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </Route>
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default function App() {
  return <AppContent />;
}

