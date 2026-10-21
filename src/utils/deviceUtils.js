/**
 * Device Fingerprint & Hardware Binding Utilities
 */

const STORAGE_KEY = 'hader_device_fingerprint';

export function getDeviceFingerprint() {
  if (typeof window === 'undefined') {
    return { deviceId: 'DEV-SRV-000', platform: 'Server', browser: 'Node' };
  }

  let stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const userAgent = navigator.userAgent;
    let model = 'متصفح ويب غير محدد';
    if (/iPhone/i.test(userAgent)) model = 'Apple iPhone';
    else if (/iPad/i.test(userAgent)) model = 'Apple iPad';
    else if (/Android/i.test(userAgent)) model = 'Android Device';
    else if (/Macintosh/i.test(userAgent)) model = 'Apple Mac';
    else if (/Windows/i.test(userAgent)) model = 'Windows PC';

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generated = {
      deviceId: `DEV-HW-${randomSuffix}-${navigator.platform ? navigator.platform.substring(0, 3).toUpperCase() : 'WEB'}`,
      model,
      boundAt: new Date().toISOString(),
      trusted: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(generated));
    return generated;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { deviceId: 'DEV-HW-ERR', model: 'Unknown', trusted: true };
  }
}

export function resetDeviceBinding() {
  localStorage.removeItem(STORAGE_KEY);
  return getDeviceFingerprint();
}
