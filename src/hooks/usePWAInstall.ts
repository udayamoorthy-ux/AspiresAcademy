/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  const reportInstallation = async (platformOverride?: string) => {
    try {
      const userAgent = navigator.userAgent;
      let platform = 'Other';
      if (/android/i.test(userAgent)) platform = 'Android';
      else if (/iphone|ipad|ipod/i.test(userAgent)) platform = 'iOS';
      else if (/win/i.test(userAgent)) platform = 'Windows';
      else if (/mac/i.test(userAgent)) platform = 'Mac';
      else if (/linux/i.test(userAgent)) platform = 'Linux';

      let deviceId = localStorage.getItem('aspires_device_id');
      if (!deviceId) {
        deviceId = `dev-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem('aspires_device_id', deviceId);
      }

      const savedEmail = localStorage.getItem('aspires_logged_in_email') || '';
      const currentExam = localStorage.getItem('aspires_selected_exam') || 'UPSC';

      await fetch('/api/installations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          email: savedEmail,
          platform: platformOverride || platform,
          exam: currentExam,
          browser: navigator.vendor || 'Browser',
          screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : undefined,
          isStandalone: window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
        })
      });
    } catch (err) {}
  };

  useEffect(() => {
    // Detect standalone mode (already installed or running as standalone PWA)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    if (isStandalone) {
      reportInstallation();
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      reportInstallation();
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    try {
      await deferredPrompt.prompt();
      const { outcome, platform } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        reportInstallation(platform);
        return true;
      }
    } catch (err) {
      console.error('Failed to trigger PWA install prompt:', err);
    }
    return false;
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    install,
  };
}
