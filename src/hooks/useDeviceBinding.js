import { useState, useEffect } from 'react';
import { getDeviceFingerprint, resetDeviceBinding } from '../utils/deviceUtils';

export function useDeviceBinding() {
  const [device, setDevice] = useState(() => getDeviceFingerprint());

  useEffect(() => {
    setDevice(getDeviceFingerprint());
  }, []);

  const resetBinding = () => {
    const updated = resetDeviceBinding();
    setDevice(updated);
    return updated;
  };

  return {
    device,
    deviceId: device.deviceId,
    model: device.model,
    isTrusted: Boolean(device.trusted),
    resetBinding
  };
}

export default useDeviceBinding;
