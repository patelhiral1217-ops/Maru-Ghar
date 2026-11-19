import { Capacitor } from '@capacitor/core';
import { CapacitorUpdater } from '@capgo/capacitor-updater';

// The manifest and every bundle must come from this exact HTTPS Firebase Hosting origin.
const OTA_ORIGIN = 'https://maru-ghar-gandhinagar-8dbe4.web.app';
const OTA_MANIFEST = `${OTA_ORIGIN}/ota/latest.json`;

async function checkForMaruGharUpdate() {
  if (!Capacitor.isNativePlatform()) return;

  // This must happen on every native launch, before any network request.
  try {
    await CapacitorUpdater.notifyAppReady();
  } catch (error) {
    console.warn('[Maru Ghar OTA] App-ready confirmation unavailable:', error);
    return;
  }

  try {
    const response = await fetch(OTA_MANIFEST, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'omit',
      redirect: 'error',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) return;

    const manifest = await response.json();
    if (!manifest || typeof manifest.version !== 'string' ||
        !/^\d+\.\d+\.\d+$/.test(manifest.version) ||
        typeof manifest.url !== 'string') return;

    const bundleUrl = new URL(manifest.url);
    if (bundleUrl.protocol !== 'https:' ||
        bundleUrl.origin !== OTA_ORIGIN ||
        !/^\/ota\/bundles\/[\w.-]+\.zip$/.test(bundleUrl.pathname)) return;

    const current = await CapacitorUpdater.current();
    if (current && current.version === manifest.version) return;

    const bundle = await CapacitorUpdater.download({
      url: bundleUrl.href,
      version: manifest.version
    });
    if (!bundle || typeof bundle.id !== 'string' || !bundle.id) return;

    // Queue safely; apply on the next app background/restart, not mid-session.
    await CapacitorUpdater.next({ id: bundle.id });
    console.info('[Maru Ghar OTA] Update downloaded and queued:', manifest.version);
  } catch (error) {
    // Network/update failure must never prevent the current app from opening.
    console.warn('[Maru Ghar OTA] Update check skipped:', error);
  }
}

void checkForMaruGharUpdate();
