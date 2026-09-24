import { useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import AppShell from './components/AppShell';
import SlidePanel from './components/SlidePanel';
import Overlays from './components/Overlays';
import { loadPortalScript } from './runtime/legacyBridge';

export default function App() {
  useEffect(() => {
    loadPortalScript();
  }, []);

  return (
    <>
      <LandingPage />
      <LoginScreen />
      <AppShell />
      <SlidePanel />
      <Overlays />
    </>
  );
}
