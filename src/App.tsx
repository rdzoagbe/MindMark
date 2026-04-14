/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CreateSession } from './pages/CreateSession';
import { EditSession } from './pages/EditSession';
import { SessionDetail } from './pages/SessionDetail';
import { Settings } from './pages/Settings';
import { Pricing } from './pages/Pricing';
import { UpgradeSuccess } from './pages/UpgradeSuccess';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useTheme } from './hooks/useTheme';

function AppContent() {
  useTheme(); // Initialize theme

  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default function App() {
  return <AppContent />;
}

