import React from 'react';

export function CartoonAiHeroIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="w-full max-w-[320px] sm:max-w-[380px] h-auto drop-shadow-[4px_4px_0px_rgba(15,23,42,0.8)]" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Decorative Cloud/Shape */}
        <path d="M40 90C40 60 70 40 100 40C120 20 160 20 180 40C210 30 250 50 260 80C280 90 290 120 280 150C290 180 270 210 240 220C220 235 180 240 150 230C120 240 80 230 60 210C30 200 20 160 30 130C20 110 25 95 40 90Z" fill="#FDE047" stroke="#0F172A" strokeWidth="4" />
        
        {/* Floating Digital Cards */}
        {/* ChatGPT Badge */}
        <g transform="translate(30, 35) rotate(-8)">
          <rect width="80" height="42" rx="10" fill="#10B981" stroke="#0F172A" strokeWidth="3" />
          <text x="40" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="800" fontFamily="sans-serif">GPT-4o</text>
        </g>
        
        {/* Claude Badge */}
        <g transform="translate(210, 45) rotate(10)">
          <rect width="85" height="42" rx="10" fill="#D97706" stroke="#0F172A" strokeWidth="3" />
          <text x="42" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">Claude 3.5</text>
        </g>

        {/* Gemini Badge */}
        <g transform="translate(220, 160) rotate(-6)">
          <rect width="80" height="40" rx="10" fill="#2563EB" stroke="#0F172A" strokeWidth="3" />
          <text x="40" y="25" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="800" fontFamily="sans-serif">Gemini Pro</text>
        </g>

        {/* Main Robot / Digital Character */}
        <g transform="translate(90, 75)">
          {/* Head Antenna */}
          <line x1="70" y1="20" x2="70" y2="0" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
          <circle cx="70" cy="0" r="10" fill="#EF4444" stroke="#0F172A" strokeWidth="3" />
          
          {/* Body */}
          <rect x="25" y="80" width="90" height="70" rx="18" fill="#60A5FA" stroke="#0F172A" strokeWidth="4" />
          
          {/* Chest Heart/Spark */}
          <circle cx="70" cy="115" r="14" fill="#F43F5E" stroke="#0F172A" strokeWidth="3" />
          <path d="M70 106L73 112L79 115L73 118L70 124L67 118L61 115L67 112Z" fill="#FFFFFF" />

          {/* Arms */}
          <path d="M25 95C10 95 0 110 5 125" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="5" cy="125" r="8" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
          
          <path d="M115 95C130 95 140 100 145 110" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <circle cx="145" cy="110" r="8" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />

          {/* Head Box */}
          <rect x="20" y="15" width="100" height="70" rx="20" fill="#3B82F6" stroke="#0F172A" strokeWidth="4" />
          
          {/* Screen Visor */}
          <rect x="32" y="28" width="76" height="42" rx="12" fill="#0F172A" />

          {/* Robot Eyes (Glowing Blue / Cute) */}
          <circle cx="52" cy="48" r="8" fill="#38BDF8" />
          <circle cx="50" cy="46" r="3" fill="#FFFFFF" />
          
          <circle cx="88" cy="48" r="8" fill="#38BDF8" />
          <circle cx="86" cy="46" r="3" fill="#FFFFFF" />

          {/* Happy Mouth Curve */}
          <path d="M63 58 Q70 65 77 58" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>

        {/* Sparkles / Stars */}
        <path d="M40 180 L44 188 L52 190 L44 192 L40 200 L36 192 L28 190 L36 188 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="2" />
        <path d="M270 110 L273 115 L278 116 L273 117 L270 122 L267 117 L262 116 L267 115 Z" fill="#F43F5E" stroke="#0F172A" strokeWidth="2" />
      </svg>
    </div>
  );
}

export function CartoonSpeedIllustration({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg className="w-full max-w-[320px] sm:max-w-[360px] h-auto drop-shadow-[4px_4px_0px_rgba(15,23,42,0.8)]" viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Circle */}
        <circle cx="160" cy="120" r="100" fill="#6EE7B7" stroke="#0F172A" strokeWidth="4" />
        
        {/* Speed Lines */}
        <line x1="30" y1="70" x2="90" y2="70" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
        <line x1="10" y1="120" x2="70" y2="120" stroke="#0F172A" strokeWidth="6" strokeLinecap="round" />
        <line x1="40" y1="170" x2="100" y2="170" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />

        {/* Rocket / Zap Character */}
        <g transform="translate(100, 40) rotate(15)">
          {/* Flame */}
          <path d="M20 120 C10 140 30 160 40 170 C50 160 70 140 60 120 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="4" />
          <path d="M30 125 C25 135 35 145 40 152 C45 145 55 135 50 125 Z" fill="#FACC15" />

          {/* Rocket Body */}
          <path d="M40 10 C70 40 70 100 70 120 L10 120 C10 100 10 40 40 10 Z" fill="#FFFFFF" stroke="#0F172A" strokeWidth="4" />
          
          {/* Rocket Fins */}
          <path d="M10 90 L-15 120 L10 120 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />
          <path d="M70 90 L95 120 L70 120 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="4" />

          {/* Window / Eye */}
          <circle cx="40" cy="55" r="18" fill="#38BDF8" stroke="#0F172A" strokeWidth="4" />
          <circle cx="36" cy="50" r="5" fill="#FFFFFF" />

          {/* Cute Smile on Window */}
          <path d="M33 60 Q40 66 47 60" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* Checkmark Tag */}
        <g transform="translate(200, 150) rotate(-8)">
          <rect width="90" height="45" rx="12" fill="#FACC15" stroke="#0F172A" strokeWidth="3" />
          <text x="45" y="28" textAnchor="middle" fill="#0F172A" fontSize="13" fontWeight="800">OTOMATIS</text>
        </g>
      </svg>
    </div>
  );
}

export function CartoonProductLogo({ name, logoBg, iconName, className = 'w-12 h-12' }: { name: string; logoBg: string; iconName: string; className?: string }) {
  return (
    <div className={`relative flex items-center justify-center rounded-2xl border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] shrink-0 font-extrabold text-white text-lg ${logoBg} ${className}`}>
      {name.substring(0, 2).toUpperCase()}
    </div>
  );
}
