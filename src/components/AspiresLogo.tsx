/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useId } from 'react';

interface AspiresLogoProps {
  className?: string;
  size?: number; // Size in pixels
  showText?: boolean; // Whether to include the branding text underneath
}

export default function AspiresLogo({ className = '', size = 120, showText = true }: AspiresLogoProps) {
  // We use viewbox 0 0 500 500 for the full logo with text, or 0 0 500 280 for just the crest icon
  const viewBox = showText ? "0 0 500 500" : "0 0 500 285";
  const height = showText ? size : Math.round(size * 0.57);

  // Generate unique IDs for SVG definitions to prevent conflicts when multiple logos exist on the page
  const uniqueId = useId();
  const safeId = uniqueId.replace(/:/g, '-');
  const flameGradId = `flame-grad-${safeId}`;
  const goldGradId = `gold-grad-${safeId}`;

  return (
    <svg
      width={size}
      height={height}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      id="aspires-academy-vector-logo"
    >
      <defs>
        {/* Flame gradient: vibrant orange-red to yellow */}
        <linearGradient id={flameGradId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#EA4335" />
          <stop offset="60%" stopColor="#FBBC05" />
          <stop offset="100%" stopColor="#FFEA00" />
        </linearGradient>

        {/* Premium Gold gradient for laurels, star, and accents */}
        <linearGradient id={goldGradId} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#B58920" />
          <stop offset="40%" stopColor="#E5C158" />
          <stop offset="70%" stopColor="#F5D770" />
          <stop offset="100%" stopColor="#967010" />
        </linearGradient>
      </defs>

      {/* Wrapping group - removed the filter to prevent cross-browser rendering or iframe resolution blockages */}
      <g>
        
        {/* ========================================== */}
        {/* 1. TOP SEMI-CIRCULAR ARCH                 */}
        {/* ========================================== */}
        <path 
          d="M 125,242 A 125,125 0 0 1 375,242" 
          fill="none" 
          stroke="#002B49" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />

        {/* ========================================== */}
        {/* 2. GOLDEN LAUREL BRANCHES (LEFT & RIGHT)   */}
        {/* ========================================== */}
        {/* Left Laurel Leaves with solid paint server fallbacks */}
        <path d="M 140,240 Q 120,230 115,200 Q 130,210 140,240 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 125,210 Q 110,195 105,170 Q 120,180 125,210 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 115,180 Q 105,160 105,135 Q 118,148 115,180 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 112,145 Q 105,120 115,100 Q 122,118 112,145 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 120,115 Q 115,90 130,75 Q 132,95 120,115 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 135,90 Q 135,70 155,60 Q 152,80 135,90 Z" fill={`url(#${goldGradId}) #B58920`} />

        {/* Right Laurel Leaves with solid paint server fallbacks */}
        <path d="M 360,240 Q 380,230 385,200 Q 370,210 360,240 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 375,210 Q 390,195 395,170 Q 380,180 375,210 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 385,180 Q 395,160 395,135 Q 382,148 385,180 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 388,145 Q 395,120 385,100 Q 378,118 388,145 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 380,115 Q 385,90 370,75 Q 368,95 380,115 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 365,90 Q 365,70 345,60 Q 348,80 365,90 Z" fill={`url(#${goldGradId}) #B58920`} />


        {/* ========================================== */}
        {/* 3. CENTER ALPHA "A" CRADLE                 */}
        {/* ========================================== */}
        {/* Large stylized navy blue A */}
        <path 
          d="M 250,110 L 168,245 L 208,245 L 230,205 L 270,205 L 292,245 L 332,245 Z" 
          fill="#002B49" 
        />


        {/* ========================================== */}
        {/* 4. SYMBOLIC KNOWLEDGE BOOK AT THE BASE     */}
        {/* ========================================== */}
        {/* Left main page */}
        <path d="M 250,260 C 220,245 180,245 145,260 L 145,225 C 180,210 220,210 250,225 Z" fill="#002B49" />
        {/* Right main page */}
        <path d="M 250,260 C 280,245 320,245 355,260 L 355,225 C 320,210 280,210 250,225 Z" fill="#002B49" />

        {/* Thick golden edges for open book premium aesthetic */}
        <path d="M 250,267 C 220,252 180,252 140,267 L 140,262 C 180,247 220,247 250,262 Z" fill={`url(#${goldGradId}) #B58920`} />
        <path d="M 250,267 C 280,252 320,252 360,267 L 360,262 C 320,247 280,247 250,262 Z" fill={`url(#${goldGradId}) #B58920`} />

        {/* Additional outline depth below pages */}
        <path d="M 134,272 L 250,285 L 366,272 L 358,266 L 250,277 L 142,266 Z" fill="#002B49" />


        {/* ========================================== */}
        {/* 5. INTERACTIVE TORCH & VIBRANT FLAME       */}
        {/* ========================================== */}
        {/* Torch Stand & Bowl Structure inside the inner core */}
        <path d="M 247,156 L 253,156 L 251,215 L 249,215 Z" fill="#002B49" />
        
        {/* Separator background white ring for the flame container */}
        <circle cx="250" cy="155" r="23" fill="#FFFFFF" stroke="#002B49" strokeWidth="3" />

        {/* Tapered Torch Bowl */}
        <path d="M 235,155 L 265,155 C 265,163 260,167 257,167 L 243,167 C 240,167 235,163 235,155 Z" fill="#002B49" />
        {/* Gold Accent Ring on Torch Rim */}
        <ellipse cx="250" cy="155" rx="15" ry="2" fill={`url(#${goldGradId}) #B58920`} />

        {/* Dynamic Multi-layered Flame */}
        {/* Outer Flame (Orange-Red) */}
        <path 
          d="M 250,95 C 230,123 235,145 240,154 C 242,156 258,156 260,154 C 265,145 270,123 250,95 Z" 
          fill={`url(#${flameGradId}) #EA4335`} 
        />
        {/* Inner core flame (Vibrant Yellow) */}
        <path 
          d="M 250,112 C 238,128 241,142 244,152 C 245,153 255,153 256,152 C 259,142 262,128 250,112 Z" 
          fill="#FFF200" 
          opacity="0.9" 
        />


        {/* ========================================== */}
        {/* 6. TYPOGRAPHY & BRAND FOOTER LAYOUT        */}
        {/* ========================================== */}
        {showText && (
          <>
            {/* Primary Slogan Title: ASPIRES */}
            <text 
              x="250" 
              y="328" 
              fontFamily="'Times New Roman', Times, 'Georgia', serif" 
              fontWeight="900" 
              fontSize="52" 
              fill="#002B49" 
              textAnchor="middle" 
              letterSpacing="6"
            >
              ASPIRES
            </text>

            {/* Sub-Headline: ACADEMY with framing sidebars */}
            <line 
              x1="65" 
              y1="358" 
              x2="150" 
              y2="358" 
              stroke={`url(#${goldGradId}) #B58920`} 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />
            <text 
              x="250" 
              y="368" 
              fontFamily="'Inter', 'Outfit', sans-serif" 
              fontWeight="800" 
              fontSize="28" 
              fill={`url(#${goldGradId}) #B58920`} 
              textAnchor="middle" 
              letterSpacing="8"
            >
              ACADEMY
            </text>
            <line 
              x1="350" 
              y1="358" 
              x2="435" 
              y2="358" 
              stroke={`url(#${goldGradId}) #B58920`} 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />

            {/* Tagline: DREAM • PREPARE • ACHIEVE */}
            <text 
              x="250" 
              y="402" 
              fontFamily="'Inter', sans-serif" 
              fontWeight="800" 
              fontSize="12.5" 
              fill="#002B49" 
              textAnchor="middle" 
              letterSpacing="3.5"
            >
              DREAM  •  PREPARE  •  ACHIEVE
            </text>

            {/* Main structural divider line with centered golden star */}
            <line 
              x1="90" 
              y1="419" 
              x2="410" 
              y2="419" 
              stroke="#002B49" 
              strokeWidth="1.5" 
            />
            <polygon 
              points="250,413 252.5,417.5 257.5,417.5 253.5,420.5 255,425 250,422.5 245,425 246.5,420.5 242.5,417.5 247.5,417.5" 
              fill={`url(#${goldGradId}) #B58920`} 
            />

            {/* Three Column Footer Boards Mapped */}
            {/* Left Column: TNPSC */}
            <text x="155" y="449" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="19" fill="#002B49" textAnchor="middle" letterSpacing="1.5">TNPSC</text>
            <text x="155" y="462" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="8" fill="#475569" textAnchor="middle" letterSpacing="0.5">TAMIL NADU</text>
            <text x="155" y="472" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="7" fill="#64748B" textAnchor="middle" letterSpacing="0.2">PUBLIC SERVICE COMMISSION</text>

            {/* Center Column: Parliament / Secretariat Dome Symbol */}
            {/* Left/Right dividing columns */}
            <line x1="212" y1="436" x2="212" y2="478" stroke="#002B49" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="288" y1="436" x2="288" y2="478" stroke="#002B49" strokeWidth="1.5" strokeLinecap="round" />

            {/* Domed building drawing */}
            {/* Base block steps */}
            <rect x="230" y="472" width="40" height="4" rx="0.5" fill="#002B49" />
            <rect x="233" y="468" width="34" height="4" rx="0.5" fill="#002B49" />
            <rect x="236" y="464" width="28" height="4" rx="0.5" fill="#002B49" />
            
            {/* Pillars framework */}
            <rect x="238" y="451" width="24" height="13" fill="none" stroke="#002B49" strokeWidth="1.5" />
            <line x1="242" y1="451" x2="242" y2="464" stroke="#002B49" strokeWidth="1" />
            <line x1="246" y1="451" x2="246" y2="464" stroke="#002B49" strokeWidth="1" />
            <line x1="250" y1="451" x2="250" y2="464" stroke="#002B49" strokeWidth="1" />
            <line x1="254" y1="451" x2="254" y2="464" stroke="#002B49" strokeWidth="1" />
            <line x1="258" y1="451" x2="258" y2="464" stroke="#002B49" strokeWidth="1" />
            
            {/* Dome platform & main dome */}
            <rect x="236" y="448" width="28" height="3" fill="#002B49" />
            <path d="M 238,448 C 238,433 262,433 262,448 Z" fill="#002B49" />
            
            {/* Tiny flag and staff */}
            <line x1="250" y1="433" x2="250" y2="426" stroke="#002B49" strokeWidth="1" />
            <polygon points="250,426 258,428 250,430" fill={`url(#${goldGradId}) #B58920`} />

            {/* Right Column: UPSC */}
            <text x="345" y="449" fontFamily="'Inter', sans-serif" fontWeight="900" fontSize="19" fill="#002B49" textAnchor="middle" letterSpacing="1.5">UPSC</text>
            <text x="345" y="462" fontFamily="'Inter', sans-serif" fontWeight="800" fontSize="8" fill="#475569" textAnchor="middle" letterSpacing="0.5">UNION PUBLIC SERVICE</text>
            <text x="345" y="472" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="7" fill="#64748B" textAnchor="middle" letterSpacing="0.2">COMMISSION</text>
          </>
        )}
      </g>
    </svg>
  );
}
