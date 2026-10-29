import React, { useState } from 'react';

/**
 * AttendanceStatusIndicator
 * Interactive 60fps GPU-accelerated SVG attendance status indicator.
 *
 * States:
 * - State A: 'scanning' (amber/orange #fd8925) with breathing viewport brackets,
 *   concentric radar rings with ripples, and linear-gradient laser sweep.
 * - State B: 'confirmed' (emerald green #10b981) with smooth color transition,
 *   spring pop bounce (scale-110 to scale-100), outward shockwave ping, and checkmark draw.
 */
export default function AttendanceStatusIndicator({
  status: controlledStatus,
  onStatusChange,
  interactive = true,
  size = 220,
  showLabel = true,
  className = ''
}) {
  // Support both controlled and uncontrolled states
  const [internalStatus, setInternalStatus] = useState('scanning');
  const currentStatus = controlledStatus !== undefined ? controlledStatus : internalStatus;

  const isScanning = currentStatus === 'scanning';
  const isConfirmed = currentStatus === 'confirmed';

  const handleToggle = () => {
    if (!interactive) return;
    const nextStatus = isScanning ? 'confirmed' : 'scanning';
    if (onStatusChange) {
      onStatusChange(nextStatus);
    } else {
      setInternalStatus(nextStatus);
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={isConfirmed ? 'تم تأكيد الحضور بنجاح' : 'جارِ مسح كود الحضور والتحقق'}
      className={`flex flex-col items-center justify-center select-none ${className}`}
    >
      <div
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={interactive ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        } : undefined}
        aria-label={interactive ? (isConfirmed ? 'التبديل إلى وضع المسح' : 'التبديل إلى وضع التأكيد') : undefined}
        onClick={interactive ? handleToggle : undefined}
        title={interactive ? 'انقر للتبديل التفاعلي بين وضع المسح والتأكيد' : undefined}
        style={{ width: size, height: size }}
        className={`relative flex items-center justify-center rounded-3xl bg-[#0e0918]/90 border transition-all duration-500 overflow-hidden ${
          isConfirmed
            ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.18)]'
            : 'border-[#fd8925]/30 shadow-[0_0_30px_rgba(253,137,37,0.14)]'
        } ${interactive ? 'cursor-pointer hover:border-white/20 active:scale-[0.98]' : ''}`}
      >
        {/* Ambient background glow gradient */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            isConfirmed
              ? 'opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/40 via-transparent to-transparent'
              : 'opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fd8925]/40 via-transparent to-transparent'
          }`}
        />

        <svg
          viewBox="0 0 240 240"
          width="100%"
          height="100%"
          className="relative z-10 w-full h-full p-2"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Amber / Ember Linear Gradients */}
            <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fd8925" />
              <stop offset="100%" stopColor="#ff492c" />
            </linearGradient>

            {/* Emerald Linear Gradients */}
            <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            {/* Laser Sweep Horizontal Beam */}
            <linearGradient id="laserSweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fd8925" stopOpacity="0" />
              <stop offset="20%" stopColor="#fd8925" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="80%" stopColor="#fd8925" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fd8925" stopOpacity="0" />
            </linearGradient>

            {/* Laser Ambient Glow Vertical Ribbon */}
            <linearGradient id="laserGlowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fd8925" stopOpacity="0" />
              <stop offset="50%" stopColor="#fd8925" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#fd8925" stopOpacity="0" />
            </linearGradient>

            {/* Delicate Matrix Grid Pattern */}
            <pattern id="scannerGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="0.8" fill="#3e3a46" fillOpacity="0.5" />
            </pattern>
          </defs>

          {/* Background subtle micro-dot matrix */}
          <rect x="36" y="36" width="168" height="168" rx="16" fill="url(#scannerGrid)" opacity="0.6" />

          {/* =================================================================
              1. OUTER VIEWPORT BRACKETS (Gentle breathing pulse scale 0.98 -> 1.02)
             ================================================================= */}
          <g
            className={`transition-colors duration-500 ${
              isScanning ? 'animate-attendance-brackets text-[#fd8925]' : 'text-emerald-400'
            }`}
          >
            {/* Top-Left Bracket */}
            <path
              d="M 34,56 L 34,34 L 56,34"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Top-Right Bracket */}
            <path
              d="M 184,34 L 206,34 L 206,56"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom-Right Bracket */}
            <path
              d="M 206,184 L 206,206 L 184,206"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Bottom-Left Bracket */}
            <path
              d="M 56,206 L 34,206 L 34,184"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Subtle Crosshairs ticks on edges */}
            <line x1="120" y1="28" x2="120" y2="34" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="120" y1="206" x2="120" y2="212" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="28" y1="120" x2="34" y2="120" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="206" y1="120" x2="212" y2="120" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" />
          </g>

          {/* =================================================================
              2. MINI QR CODE RETICLE CORNER FINDERS
             ================================================================= */}
          <g className={`transition-opacity duration-500 ${isScanning ? 'opacity-40' : 'opacity-20'}`}>
            {/* Top-Left QR Marker */}
            <rect x="46" y="46" width="20" height="20" rx="4" fill="none" stroke="#9d9797" strokeWidth="1.5" />
            <rect x="52" y="52" width="8" height="8" rx="2" fill="#9d9797" />

            {/* Top-Right QR Marker */}
            <rect x="174" y="46" width="20" height="20" rx="4" fill="none" stroke="#9d9797" strokeWidth="1.5" />
            <rect x="180" y="52" width="8" height="8" rx="2" fill="#9d9797" />

            {/* Bottom-Left QR Marker */}
            <rect x="46" y="174" width="20" height="20" rx="4" fill="none" stroke="#9d9797" strokeWidth="1.5" />
            <rect x="52" y="180" width="8" height="8" rx="2" fill="#9d9797" />
          </g>

          {/* =================================================================
              3. RADAR RINGS (Pings / Ripples around Raised Hand)
             ================================================================= */}
          {isScanning && (
            <g className="transition-opacity duration-300">
              {/* Ring 1 - Fast Ripple */}
              <circle
                cx="120"
                cy="118"
                r="42"
                fill="none"
                stroke="#fd8925"
                strokeWidth="1.5"
                className="animate-radar-ring-1 svg-origin-center"
              />
              {/* Ring 2 - Mid Ripple */}
              <circle
                cx="120"
                cy="118"
                r="56"
                fill="none"
                stroke="#fd8925"
                strokeWidth="1.25"
                className="animate-radar-ring-2 svg-origin-center"
              />
              {/* Ring 3 - Outer Ripple */}
              <circle
                cx="120"
                cy="118"
                r="70"
                fill="none"
                stroke="#fd8925"
                strokeWidth="1"
                className="animate-radar-ring-3 svg-origin-center"
              />
            </g>
          )}

          {/* Verification Momentary Ring Ping Outward (State B) */}
          {isConfirmed && (
            <circle
              key="verified-shockwave"
              cx="120"
              cy="118"
              r="44"
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              className="animate-verified-ring svg-origin-center"
            />
          )}

          {/* =================================================================
              4. SOFT LINEAR-GRADIENT SWEEP (Laser scanning beam)
             ================================================================= */}
          {isScanning && (
            <g className="animate-attendance-laser svg-origin-center pointer-events-none">
              {/* Glow field */}
              <rect x="36" y="110" width="168" height="20" fill="url(#laserGlowGradient)" />
              {/* Sharp laser line */}
              <line x1="36" y1="120" x2="204" y2="120" stroke="url(#laserSweepGradient)" strokeWidth="2.5" />
            </g>
          )}

          {/* =================================================================
              5. CENTRAL MOTIF: RAISED HAND ("حاضر") & CHECKMARK
             ================================================================= */}
          <g
            className={`transition-all duration-500 svg-origin-center ${
              isConfirmed ? 'animate-attendance-pop text-emerald-400' : 'text-amber-500'
            }`}
          >
            {/* Center Base Plate */}
            <circle
              cx="120"
              cy="118"
              r="34"
              fill={isConfirmed ? '#10b981' : '#1b1728'}
              fillOpacity={isConfirmed ? '0.15' : '0.85'}
              stroke={isConfirmed ? '#10b981' : '#3e3a46'}
              strokeWidth="1.5"
              className="transition-colors duration-500"
            />

            {/* State A: RAISED HAND ("حاضر" - Classroom Attendance Raised Hand) */}
            {isScanning ? (
              <g
                key="raised-hand-motif"
                className="transition-transform duration-300 transform scale-100 svg-origin-center"
              >
                {/* Authentic Stylized Raised Hand Silhouette */}
                <path
                  d="M116,146 C116,148 118,150 120,150 C122,150 124,148 124,146 L124,130 C125.5,130 127,129 128,127.5 C129,126 129,118 129,114 C129,111.5 127,110 125,110 C123,110 122,111.5 122,114 L122,106 C122,103.5 120,102 118,102 C116,102 115,103.5 115,106 L115,101 C115,98.5 113,97 111,97 C109,97 107.5,98.5 107.5,101 L107.5,107 C107.5,104.5 105.5,103 103.5,103 C101.5,103 100,104.5 100,107 L100,123 C96.5,121.5 94,121 92.5,122 C90.5,123 90,126 92,128.5 C95,133.5 104,139 116,146 Z"
                  fill="url(#amberGradient)"
                  className="drop-shadow-[0_2px_8px_rgba(253,137,37,0.4)]"
                  transform="translate(10, -5)"
                />
                {/* Biometric Center Dot */}
                <circle cx="120" cy="122" r="2.5" fill="#ffffff" opacity="0.9" />
              </g>
            ) : (
              /* State B: VERIFIED PRESENCE CHECKMARK & EMBLEM */
              <g key="confirmed-motif" className="svg-origin-center">
                {/* Verified Circle Shield */}
                <circle
                  cx="120"
                  cy="118"
                  r="26"
                  fill="url(#emeraldGradient)"
                  className="shadow-lg shadow-emerald-500/50"
                />

                {/* Animated Crisp Checkmark Path */}
                <path
                  d="M108,118 L116,126 L133,108"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-check-stroke"
                />
              </g>
            )}
          </g>

          {/* Peripheral Status Satellite Indicators */}
          <circle
            cx="120"
            cy="46"
            r="3"
            fill={isConfirmed ? '#10b981' : '#fd8925'}
            className="transition-colors duration-500"
          />
          <circle
            cx="120"
            cy="194"
            r="3"
            fill={isConfirmed ? '#10b981' : '#fd8925'}
            className="transition-colors duration-500"
          />
        </svg>

        {/* Live Status Badge Overlay at Bottom */}
        <div className="absolute bottom-2.5 left-0 right-0 flex items-center justify-center pointer-events-none">
          <span
            className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-all duration-500 ${
              isConfirmed
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-[#fd8925]/20 text-[#fd8925] border-[#fd8925]/40 shadow-sm'
            }`}
          >
            {isConfirmed ? 'حاضر • تم التوثيق' : 'SCANNING • جارِ المسح'}
          </span>
        </div>
      </div>

      {/* Optional Descriptive Label & Interactive Helper */}
      {showLabel && (
        <div className="mt-3 text-center space-y-1">
          <p
            className={`text-xs font-bold transition-colors duration-300 ${
              isConfirmed ? 'text-emerald-400' : 'text-white'
            }`}
          >
            {isConfirmed ? 'تم تأكيد حضور المحاضرة بنجاح ✅' : 'وجّه الكاميرا نحو كود القاعة الذكي'}
          </p>
          {interactive && (
            <p className="text-[10px] text-[#9d9797]">
              (انقر على المؤشر لتجربة الانتقال الفوري بين الحالتين)
            </p>
          )}
        </div>
      )}
    </div>
  );
}
