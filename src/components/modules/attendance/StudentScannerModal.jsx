import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Zap,
  ZapOff,
  FlipHorizontal,
  AlertTriangle
} from 'lucide-react';
import Modal from '../../common/Modal';
import Button from '../../common/Button';
import Badge from '../../common/Badge';
import { useAttendance } from '../../../context/AttendanceContext';
import { useAuth } from '../../../context/AuthContext';

export default function StudentScannerModal({
  isOpen,
  onClose,
  lecture
}) {
  const { verifyAttendance, gpsSimStatus, setGpsSimStatus } = useAttendance();
  const { user } = useAuth();

  const html5QrCodeRef = useRef(null);
  const [cameraStatus, setCameraStatus] = useState('idle'); // 'idle' | 'initializing' | 'active' | 'error' | 'success'
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' | 'user'
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [decodedData, setDecodedData] = useState(null);

  const activeLecture = lecture || {
    id: 'sat-2',
    title: 'تصميم وإنتاج بيئات الوسائط المتكاملة (تطبيقات)',
    location: 'معمل كمبيوتر 274 (الدور الثاني)'
  };

  // Stop scanner safely and prevent memory leaks
  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      const scanner = html5QrCodeRef.current;
      html5QrCodeRef.current = null;
      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
        scanner.clear();
      } catch (err) {
        console.warn('Camera stop cleanup warning:', err);
      }
    }
    setTorchOn(false);
    setHasTorch(false);
  }, []);

  // Handle successful QR scan
  const handleScanSuccess = useCallback(async (decodedText) => {
    if (isVerifying || cameraStatus === 'success') return;

    // Trigger haptic vibration on mobile
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([80, 40, 80]);
      } catch {
        // ignore
      }
    }

    setDecodedData(decodedText);
    setCameraStatus('success');
    setIsVerifying(true);

    // Stop camera immediately once code is recognized
    await stopScanner();

    const success = await verifyAttendance(activeLecture, decodedText);
    setIsVerifying(false);

    if (success) {
      setTimeout(() => {
        onClose();
      }, 1400);
    } else {
      setTimeout(() => {
        setCameraStatus('idle');
      }, 2000);
    }
  }, [activeLecture, cameraStatus, isVerifying, onClose, stopScanner, verifyAttendance]);

  // Start low-level camera scanner with constraints
  const startScanner = useCallback(async (mode = 'environment') => {
    await stopScanner();

    const container = document.getElementById('qr-reader');
    if (!container) return;

    setCameraStatus('initializing');
    setCameraError(null);

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      const config = {
        fps: 15,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      // 1. Resolve Best Camera Constraint / Device ID
      let cameraSource = { facingMode: { ideal: mode } };

      try {
        if (navigator?.mediaDevices?.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((d) => d.kind === 'videoinput');

          if (videoDevices.length > 0) {
            // Check if a dedicated rear/back camera exists
            const backCamera = videoDevices.find((d) =>
              /back|rear|environment|خلفي/i.test(d.label)
            );

            if (mode === 'environment' && backCamera) {
              cameraSource = backCamera.deviceId;
            } else if (mode === 'user') {
              const frontCamera = videoDevices.find((d) =>
                /front|user|webcam|facetime|أمامي/i.test(d.label)
              );
              cameraSource = frontCamera ? frontCamera.deviceId : videoDevices[0].deviceId;
            } else {
              // Laptops, Desktops, or single-camera devices: fallback seamlessly to the available webcam
              cameraSource = videoDevices[0].deviceId;
            }
          }
        }
      } catch (enumErr) {
        console.warn('enumerateDevices detection notice:', enumErr);
      }

      // 2. Start Scanner with Graceful Multi-Tier Fallback
      try {
        await html5QrCode.start(
          cameraSource,
          config,
          (decodedText) => handleScanSuccess(decodedText),
          () => {} // Frame parse miss — normal during video scanning
        );
      } catch (firstStartErr) {
        console.warn('Primary camera source start failed, applying universal video fallback:', firstStartErr);
        // Fallback tier: flexible ideal facingMode or generic video input
        await html5QrCode.start(
          { facingMode: { ideal: 'user' } },
          config,
          (decodedText) => handleScanSuccess(decodedText),
          () => {}
        );
      }

      setCameraStatus('active');

      // Detect torch / flashlight capability if available
      try {
        const capabilities = html5QrCode.getRunningTrackCameraCapabilities();
        if (capabilities && capabilities.torchFeature && capabilities.torchFeature().isSupported()) {
          setHasTorch(true);
        } else {
          setHasTorch(false);
        }
      } catch {
        setHasTorch(false);
      }
    } catch (err) {
      console.warn('Native mobile camera init error:', err);
      setCameraStatus('error');
      let msg = 'تعذر تشغيل الكاميرا المباشرة في المتصفح الحالي.';
      if (err?.name === 'NotAllowedError') {
        msg = 'تم رفض إذن الكاميرا. يرجى تفعيل الكاميرا من إعدادات المتصفح أو المتابعة بالمحاكاة.';
      } else if (err?.name === 'NotFoundError') {
        msg = 'لم يتم العثور على كاميرا في هذا الجهاز. يمكنك إتمام الحضور بالمحاكاة الذكية.';
      } else if (err?.name === 'NotReadableError') {
        msg = 'الكاميرا قيد الاستخدام بواسطة تطبيق آخر.';
      }
      setCameraError(msg);
    }
  }, [handleScanSuccess, stopScanner]);

  // Start when modal opens, clean up when modal closes
  useEffect(() => {
    let timer;
    if (isOpen) {
      setDecodedData(null);
      // Small timeout to allow Modal DOM mount
      timer = setTimeout(() => {
        startScanner(facingMode);
      }, 150);
    } else {
      stopScanner();
      setCameraStatus('idle');
      setCameraError(null);
    }

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isOpen, facingMode, startScanner, stopScanner]);

  // Flip between back and front camera
  const handleFlipCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startScanner(nextMode);
  };

  // Toggle flashlight / torch
  const handleToggleTorch = async () => {
    if (!html5QrCodeRef.current || !hasTorch) return;
    try {
      const nextState = !torchOn;
      await html5QrCodeRef.current.applyVideoConstraints({
        advanced: [{ torch: nextState }]
      });
      setTorchOn(nextState);
    } catch (err) {
      console.warn('Torch toggle error:', err);
    }
  };

  // Fallback Simulation Scan
  const handleSimulateScan = async () => {
    await stopScanner();
    setIsVerifying(true);
    setCameraStatus('success');
    const success = await verifyAttendance(activeLecture, 'SIMULATED-CAMERA-SCAN-PAYLOAD');
    setIsVerifying(false);
    if (success) {
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setTimeout(() => {
        setCameraStatus('idle');
        startScanner(facingMode);
      }, 1800);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ماسح الحضور الذكي بالكاميرا"
      subtitle={activeLecture.title}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* =====================================================================
            CAMERA VIEWFINDER VIEWPORT & OVERLAY ARCHITECTURE
           ===================================================================== */}
        <div className="relative w-full aspect-square max-w-[280px] bg-[#0e0918] rounded-2xl border-2 border-[#3e3a46] overflow-hidden flex flex-col items-center justify-center shadow-2xl">
          
          {/* Native HTML5-QRCode Mount Node */}
          <div
            id="qr-reader"
            className="w-full h-full overflow-hidden rounded-2xl"
          />

          {/* Initializing / Loading Indicator */}
          {cameraStatus === 'initializing' && (
            <div className="absolute inset-0 bg-[#0e0918]/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4 space-y-3">
              <RefreshCw className="w-8 h-8 text-[#fd8925] animate-spin" />
              <span className="text-xs text-[#d1cece] font-medium">جارِ تشغيل الكاميرا الخلفية...</span>
            </div>
          )}

          {/* Active Scanning Overlay (Reticle Brackets & Laser Sweep) */}
          {cameraStatus === 'active' && (
            <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
              {/* Corner Viewport Brackets */}
              <div className="relative w-[210px] h-[210px]">
                {/* Top-Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#fd8925] rounded-tl-lg" />
                {/* Top-Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#fd8925] rounded-tr-lg" />
                {/* Bottom-Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#fd8925] rounded-bl-lg" />
                {/* Bottom-Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#fd8925] rounded-br-lg" />

                {/* Laser Sweep Beam */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#fd8925] to-transparent shadow-[0_0_10px_#fd8925] animate-attendance-laser" />
              </div>
            </div>
          )}

          {/* Camera Error / No Permission Fallback View */}
          {cameraStatus === 'error' && (
            <div className="absolute inset-0 bg-[#1a1624] z-20 flex flex-col items-center justify-center p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <CameraOff className="w-6 h-6" />
              </div>
              <p className="text-xs text-[#d1cece] leading-relaxed max-w-[220px]">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={() => startScanner(facingMode)}
                className="text-xs font-semibold text-[#fd8925] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          )}

          {/* Success / Confirmed State Overlay */}
          {cameraStatus === 'success' && (
            <div className="absolute inset-0 bg-[#0e0918]/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-4 space-y-3 animate-attendance-pop">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-sm font-bold text-white">تم التقاط الرمز بنجاح!</h4>
              <p className="text-xs text-emerald-300 font-mono">جارِ توثيق الحضور الأكاديمي...</p>
            </div>
          )}

          {/* Camera Top Control Pills (Flash & Flip) */}
          {cameraStatus === 'active' && (
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-black/80 transition-colors cursor-pointer"
                title="تبديل الكاميرا (الأمامية / الخلفية)"
                aria-label="تبديل الكاميرا"
              >
                <FlipHorizontal className="w-4 h-4" />
              </button>

              {hasTorch && (
                <button
                  type="button"
                  onClick={handleToggleTorch}
                  className={`p-2 rounded-xl backdrop-blur-md border transition-colors cursor-pointer ${
                    torchOn
                      ? 'bg-amber-500/30 text-amber-300 border-amber-500/50'
                      : 'bg-black/60 text-white border-white/10 hover:bg-black/80'
                  }`}
                  title="تشغيل إضاءة الفلاش"
                  aria-label="إضاءة الفلاش"
                >
                  {torchOn ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                </button>
              )}
            </div>
          )}

          {/* Bottom Live Hint */}
          <div className="absolute bottom-2 inset-x-0 z-20 flex justify-center pointer-events-none">
            <span className="text-[10px] font-medium text-white/80 bg-black/70 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
              {cameraStatus === 'active' ? 'ضع كود المحاضر داخل المربع' : 'نظام المسح بالكاميرا'}
            </span>
          </div>

        </div>

        {/* Student Active ID Telemetry */}
        <div className="flex items-center justify-between w-full max-w-[280px] px-1 text-xs">
          <span className="text-[#9d9797]">المعرف النشط للطالب:</span>
          <span className="font-mono text-white font-bold">{user?.code || '20230894'}</span>
        </div>

        {/* GPS Geofence Proximity Tester (Dev & Simulation Feature) */}
        <div className="w-full p-3 rounded-xl bg-[#1b1728] border border-[#3e3a46]/60 text-right space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#fd8925]" />
              <span>محاكاة الموقع الجغرافي (Geofence):</span>
            </span>

            <Badge
              variant={gpsSimStatus === 'in_range' ? 'success' : 'danger'}
              size="xs"
              icon={gpsSimStatus === 'in_range' ? ShieldCheck : ShieldAlert}
            >
              {gpsSimStatus === 'in_range' ? 'داخل النطاق (18م)' : 'خارج النطاق (2,420م)'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setGpsSimStatus('in_range')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                gpsSimStatus === 'in_range'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#2c2834] text-[#9d9797] border-[#3e3a46]'
              }`}
            >
              داخل الحرم (18 متر)
            </button>

            <button
              type="button"
              onClick={() => setGpsSimStatus('out_of_range')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                gpsSimStatus === 'out_of_range'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-[#2c2834] text-[#9d9797] border-[#3e3a46]'
              }`}
            >
              خارج الحرم (2.4 كم)
            </button>
          </div>

          <p className="text-[10px] text-[#9d9797]">
            النطاق المسموح به رسمياً: 150 متراً من مبنى الكلية بالدقي.
          </p>
        </div>

        {/* Fallback Simulation / Instant Verify Action Button */}
        <Button
          variant="ember"
          size="md"
          loading={isVerifying}
          onClick={handleSimulateScan}
          className="w-full"
        >
          محاكاة المسح وتأكيد الحضور
        </Button>

      </div>
    </Modal>
  );
}
