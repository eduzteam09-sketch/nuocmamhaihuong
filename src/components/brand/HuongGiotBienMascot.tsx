import React from 'react';

export interface HuongGiotBienMascotProps {
  pose?: 'avatar' | 'standing' | 'winking' | 'tip-card' | 'thumbs-up' | 'back';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  tipText?: string;
  tipTitle?: string;
  onActionClick?: () => void;
  actionText?: string;
  speechBubble?: string;
}

/**
 * Linh vật "Hương Giọt Biển" - Đại sứ thương hiệu Nước Mắm Hải Hương
 * Thiết kế chuẩn xác 100% theo bản vẽ 3D Turn-Around chính thức:
 * - Đầu giọt nước mắm hổ phách sóng sánh với chóp xoáy điệu đà
 * - Mắt anime to tròn long lanh, má hồng đào hây hây
 * - Trang phục đầu bếp nghệ nhân: áo trắng cổ cam, nơ cổ cam, yếm tạp dề thêu logo Hải Hương và viền họa tiết cá cơm lướt sóng biển
 * - Nơ thắt lưng sau lưng, giày thủ công đế cam
 * - Tay cầm chai Nước Mắm Hải Hương Cốt Nhĩ 60N nắp vàng
 */
export const HuongGiotBienMascot: React.FC<HuongGiotBienMascotProps> = ({
  pose = 'avatar',
  size = 'md',
  className = '',
  tipText,
  tipTitle = 'Hương Giọt Biển thấu cảm:',
  onActionClick,
  actionText,
  speechBubble,
}) => {
  const pixelSizes = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-32 h-32 sm:w-36 sm:h-36',
    '2xl': 'w-48 h-48 sm:w-56 sm:h-56',
    '3xl': 'w-64 h-64 sm:w-72 sm:h-72',
  };

  const isWink = pose === 'winking' || pose === 'thumbs-up';
  const isBack = pose === 'back';

  // Render SVG Character
  const renderMascotSvg = (isAvatarMode = false, isWinkingMode = false, isBackMode = false) => (
    <svg
      viewBox={isAvatarMode ? '0 0 120 120' : '0 0 200 250'}
      className="w-full h-full drop-shadow-md select-none transition-transform duration-300 hover:scale-105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Linh vật Hương Giọt Biển - Nước Mắm Hải Hương"
    >
      <defs>
        {/* 3D Fish sauce amber head body gradient */}
        <radialGradient id="amberHead3D" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#FFF3A8" />
          <stop offset="25%" stopColor="#FFC820" />
          <stop offset="60%" stopColor="#FF9900" />
          <stop offset="85%" stopColor="#D95700" />
          <stop offset="100%" stopColor="#8A2E00" />
        </radialGradient>

        {/* Droplet glossy specular highlight */}
        <linearGradient id="dropletSpecular" x1="20%" y1="0%" x2="70%" y2="90%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="80%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        {/* Secondary soft rim light */}
        <linearGradient id="rimLight" x1="100%" y1="50%" x2="50%" y2="50%">
          <stop offset="0%" stopColor="#FFEAA7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFEAA7" stopOpacity="0" />
        </linearGradient>

        {/* Apron fabric shading */}
        <linearGradient id="apronFabric" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#FFF9F0" />
          <stop offset="100%" stopColor="#F5E8D3" />
        </linearGradient>

        {/* Amber glass bottle gradient */}
        <linearGradient id="amberBottleGlass" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3D1B00" />
          <stop offset="35%" stopColor="#8F3C00" />
          <stop offset="65%" stopColor="#CC5500" />
          <stop offset="100%" stopColor="#331400" />
        </linearGradient>

        {/* Golden metal cap gradient */}
        <linearGradient id="goldCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D48800" />
          <stop offset="30%" stopColor="#FFE066" />
          <stop offset="70%" stopColor="#FFB800" />
          <stop offset="100%" stopColor="#B36B00" />
        </linearGradient>

        {/* Iris eye gradient */}
        <radialGradient id="eyeIris" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#6E2B00" />
          <stop offset="50%" stopColor="#3D1B00" />
          <stop offset="100%" stopColor="#1A0A00" />
        </radialGradient>

        {/* Blush glow filter */}
        <filter id="blushBlur" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* ========================================================= */}
      {/* MODE 1: CIRCULAR AVATAR BADGE (As in Circle 1 of photo)    */}
      {/* ========================================================= */}
      {isAvatarMode ? (
        <g id="mascot-avatar">
          {/* Avatar Outer Badge Ring */}
          <circle cx="60" cy="60" r="58" fill="#FFFBF5" stroke="#FFA31A" strokeWidth="3" />
          <circle cx="60" cy="60" r="54" fill="none" stroke="#FFD8A8" strokeWidth="1" strokeDasharray="3 3" />

          {/* Soft background halo */}
          <circle cx="60" cy="55" r="42" fill="#FFE8C2" opacity="0.45" />

          {/* DROPLET HEAD */}
          {/* Main amber fish sauce droplet */}
          <path
            d="M60 12 C64 19 75 32 86 45 C98 58 100 73 91 88 C82 101 64 105 48 101 C33 97 23 84 25 68 C27 54 39 34 54 17 C56 14 58 12 60 12 Z"
            fill="url(#amberHead3D)"
          />

          {/* Curved droplet swirl tip at top right */}
          <path
            d="M59 12 C62 7 69 9 70 14 C70 19 66 23 62 28 C58 24 57 16 59 12 Z"
            fill="#FFE880"
          />

          {/* Specular gloss on droplet forehead */}
          <path
            d="M40 34 C46 25 54 20 58 18 C57 24 50 36 43 50 C38 45 39 38 40 34 Z"
            fill="url(#dropletSpecular)"
          />

          {/* Secondary subtle rim highlight on right cheek */}
          <path
            d="M87 55 C92 65 92 75 87 83 C84 80 85 70 82 62 Z"
            fill="url(#rimLight)"
          />

          {/* CUTE BLUSH CHEEKS */}
          <ellipse cx="34" cy="67" rx="7" ry="4" fill="#FF5E36" opacity="0.65" filter="url(#blushBlur)" />
          <ellipse cx="86" cy="67" rx="7" ry="4" fill="#FF5E36" opacity="0.65" filter="url(#blushBlur)" />

          {/* EYEBROWS */}
          <path d="M38 45 Q44 42 50 45" stroke="#5C2500" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M70 45 Q76 42 82 45" stroke="#5C2500" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* EYES */}
          {/* Left Eye: Big glossy anime eye with eyelashes */}
          <g id="avatar-left-eye">
            <ellipse cx="44" cy="56" rx="8" ry="10" fill="url(#eyeIris)" />
            {/* Top eyeliner & lash flick */}
            <path d="M35 53 Q44 47 53 52" stroke="#1A0A00" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M52 51 L55 49" stroke="#1A0A00" strokeWidth="1.8" strokeLinecap="round" />
            {/* Specular highlights */}
            <circle cx="42" cy="52" r="3.4" fill="#FFFFFF" />
            <circle cx="47" cy="60" r="1.5" fill="#FFFFFF" />
            <path d="M40 62 Q44 64 47 62" stroke="#FFC04D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Eye: Either Winking or Open */}
          {isWinkingMode ? (
            <g id="avatar-right-eye-winking">
              <path
                d="M68 58 Q77 48 86 58"
                stroke="#2B1000"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M85 55 L89 53" stroke="#2B1000" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            <g id="avatar-right-eye-open">
              <ellipse cx="76" cy="56" rx="8" ry="10" fill="url(#eyeIris)" />
              <path d="M67 53 Q76 47 85 52" stroke="#1A0A00" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M84 51 L87 49" stroke="#1A0A00" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="74" cy="52" r="3.4" fill="#FFFFFF" />
              <circle cx="79" cy="60" r="1.5" fill="#FFFFFF" />
              <path d="M72 62 Q76 64 79 62" stroke="#FFC04D" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* NOSE */}
          <path d="M59 62 Q60 64 61 62" stroke="#A84C00" strokeWidth="1.6" strokeLinecap="round" fill="none" />

          {/* SMILE with cute pink tongue */}
          <path
            d="M51 68 Q60 78 69 68"
            stroke="#590D0D"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="#801010"
          />
          {/* Tongue */}
          <path
            d="M55 72 Q60 76 65 72"
            fill="#FF8095"
          />
          {/* Upper teeth glint */}
          <path d="M54 69 Q60 70 66 69" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />

          {/* NECK ORANGE RIBBON TIE */}
          <g id="avatar-neck-ribbon">
            <path d="M54 90 C56 88 64 88 66 90 L68 96 L52 96 Z" fill="#E65100" />
            <circle cx="60" cy="92" r="3.5" fill="#FF8000" stroke="#B33600" strokeWidth="1" />
            <path d="M57 93 L53 102 M63 93 L67 102" stroke="#FF7300" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* TOP OF ARTISAN APRON with Hải Hương swirl monogram */}
          <path
            d="M38 98 C46 94 74 94 82 98 L86 118 C68 122 52 122 34 118 Z"
            fill="url(#apronFabric)"
            stroke="#FF8000"
            strokeWidth="1.6"
          />
          {/* Orange emblem circle on chest */}
          <circle cx="60" cy="107" r="8" fill="#FFF7ED" stroke="#FF7300" strokeWidth="1.8" />
          {/* Swirl monogram inside emblem */}
          <path
            d="M60 102 C63 102 65 104 65 107 C65 110 62 112 59 111 C57 110 56 108 57 106 C58 104 61 104 62 106"
            stroke="#FF7300"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ) : isBackMode ? (
        // =========================================================
        // MODE 2: BACK VIEW (Figure 2 of photo)
        // =========================================================
        <g id="mascot-back-view">
          {/* Shadow */}
          <ellipse cx="100" cy="238" rx="48" ry="8" fill="#EAD9C2" opacity="0.8" />

          {/* Shoes & Legs */}
          <ellipse cx="80" cy="226" rx="14" ry="7" fill="#E65100" />
          <ellipse cx="120" cy="226" rx="14" ry="7" fill="#E65100" />
          <ellipse cx="80" cy="223" rx="12" ry="6" fill="#FFF5E6" stroke="#E65100" strokeWidth="1.5" />
          <ellipse cx="120" cy="223" rx="12" ry="6" fill="#FFF5E6" stroke="#E65100" strokeWidth="1.5" />

          {/* Back of Droplet Head */}
          <path
            d="M100 24 C106 35 125 55 144 76 C162 98 163 126 150 148 C138 168 116 176 96 174 C75 171 56 157 48 135 C38 112 43 85 62 64 C80 43 96 26 100 24 Z"
            fill="url(#amberHead3D)"
          />

          {/* Back curl tip */}
          <path
            d="M100 24 C104 18 113 22 111 29 C108 36 102 43 96 52 C91 45 94 32 100 24 Z"
            fill="#FFE880"
          />

          {/* White Shirt Back */}
          <path
            d="M68 132 C80 128 120 128 132 132 L140 188 C120 192 80 192 60 188 Z"
            fill="url(#apronFabric)"
            stroke="#E3D5C0"
            strokeWidth="1.5"
          />

          {/* Cross Apron Straps */}
          <path d="M76 132 L124 168 M124 132 L76 168" stroke="#FF7300" strokeWidth="4" />

          {/* Waist Orange Ribbon Bow (Circle 4 of photo) */}
          <g id="back-ribbon-bow">
            <ellipse cx="88" cy="166" rx="10" ry="6" fill="#FF7300" stroke="#CC4400" strokeWidth="1.5" />
            <ellipse cx="112" cy="166" rx="10" ry="6" fill="#FF7300" stroke="#CC4400" strokeWidth="1.5" />
            <circle cx="100" cy="166" r="5" fill="#FFA31A" stroke="#CC4400" strokeWidth="1.5" />
            <path d="M96 170 L90 186 M104 170 L110 186" stroke="#FF7300" strokeWidth="4" strokeLinecap="round" />
          </g>

          {/* Back Apron Text: HẢI HƯƠNG - NGƯỜI BẠN TẬN TÂM */}
          <rect x="74" y="190" width="52" height="22" rx="3" fill="#FFF9ED" stroke="#FFB84D" strokeWidth="1" />
          <text x="100" y="199" fill="#B33600" fontSize="6" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">HẢI HƯƠNG</text>
          <text x="100" y="207" fill="#802600" fontSize="4.2" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">NGƯỜI BẠN TẬN TÂM</text>
        </g>
      ) : (
        // =========================================================
        // MODE 3: FULL BODY STANDING / HERO WINKING THUMBS UP
        // (Figure 1 & 5 in photo)
        // =========================================================
        <g id="mascot-full-body">
          {/* Ground Contact Shadow */}
          <ellipse cx="100" cy="242" rx="55" ry="8" fill="#E8D7C0" opacity="0.8" />

          {/* SPARKLES (for winking hero pose) */}
          {isWinkingMode && (
            <g id="hero-sparkles" className="animate-pulse">
              <path d="M165 40 Q168 30 171 40 Q181 43 171 46 Q168 56 165 46 Q155 43 165 40 Z" fill="#FFD700" />
              <circle cx="180" cy="56" r="2" fill="#FFA31A" />
              <path d="M30 60 Q32 54 34 60 Q40 62 34 64 Q32 70 30 64 Q24 62 30 60 Z" fill="#FFD700" />
            </g>
          )}

          {/* LEGS & SHOES (White clogs with orange rubber soles) */}
          {isWinkingMode ? (
            // Joyful skip leg: Right foot grounded, left leg playfully lifted
            <g id="joyful-legs">
              {/* Grounded Right Leg */}
              <rect x="72" y="206" width="14" height="22" rx="4" fill="#FF6F00" />
              <ellipse cx="78" cy="236" rx="16" ry="8" fill="#E65100" />
              <ellipse cx="78" cy="233" rx="14" ry="7" fill="#FFF9ED" stroke="#E65100" strokeWidth="2" />

              {/* Lifted Left Foot */}
              <rect x="114" y="200" width="14" height="18" rx="4" fill="#FF6F00" transform="rotate(-15 114 200)" />
              <ellipse cx="128" cy="225" rx="15" ry="8" fill="#E65100" transform="rotate(-15 128 225)" />
              <ellipse cx="128" cy="222" rx="13" ry="7" fill="#FFF9ED" stroke="#E65100" strokeWidth="2" transform="rotate(-15 128 222)" />
            </g>
          ) : (
            // Symmetrical Standing Legs
            <g id="standing-legs">
              <rect x="74" y="206" width="14" height="22" rx="4" fill="#FF6F00" />
              <rect x="112" y="206" width="14" height="22" rx="4" fill="#FF6F00" />
              <ellipse cx="80" cy="236" rx="15" ry="8" fill="#E65100" />
              <ellipse cx="120" cy="236" rx="15" ry="8" fill="#E65100" />
              <ellipse cx="80" cy="233" rx="13" ry="7" fill="#FFF9ED" stroke="#E65100" strokeWidth="2" />
              <ellipse cx="120" cy="233" rx="13" ry="7" fill="#FFF9ED" stroke="#E65100" strokeWidth="2" />
            </g>
          )}

          {/* MAIN 3D AMBER DROPLET HEAD */}
          <path
            d="M100 24 C106 35 125 55 144 76 C162 98 163 126 150 148 C138 168 116 176 96 174 C75 171 56 157 48 135 C38 112 43 85 62 64 C80 43 96 26 100 24 Z"
            fill="url(#amberHead3D)"
          />

          {/* Droplet curly swirl at top right */}
          <path
            d="M100 24 C104 18 113 22 111 29 C108 36 102 43 96 52 C91 45 94 32 100 24 Z"
            fill="#FFE880"
          />

          {/* Big Specular Gloss on Top-Left Forehead */}
          <path
            d="M66 58 C76 43 90 34 98 30 C96 40 85 60 74 82 C66 73 66 63 66 58 Z"
            fill="url(#dropletSpecular)"
          />

          {/* Soft rim light on right head curvature */}
          <path
            d="M142 86 C150 100 149 116 142 128 C138 124 139 108 135 96 Z"
            fill="url(#rimLight)"
          />

          {/* CHEEKS: Airbrushed coral-peach blush */}
          <ellipse cx="60" cy="112" rx="10" ry="6" fill="#FF5E36" opacity="0.65" filter="url(#blushBlur)" />
          <ellipse cx="134" cy="112" rx="10" ry="6" fill="#FF5E36" opacity="0.65" filter="url(#blushBlur)" />

          {/* EYEBROWS */}
          <path d="M68 80 Q77 75 86 79" stroke="#5C2500" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M112 80 Q121 75 130 79" stroke="#5C2500" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* EYES */}
          {/* Left Eye: Big glossy anime eye with eyelashes */}
          <g id="body-left-eye">
            <ellipse cx="76" cy="95" rx="11" ry="14" fill="url(#eyeIris)" />
            <path d="M64 91 Q76 83 88 90" stroke="#1A0A00" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M86 89 L91 86" stroke="#1A0A00" strokeWidth="2" strokeLinecap="round" />
            <circle cx="73" cy="90" r="4.6" fill="#FFFFFF" />
            <circle cx="80" cy="101" r="2.2" fill="#FFFFFF" />
            <path d="M71 103 Q76 106 80 103" stroke="#FFC04D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </g>

          {/* Right Eye: Either Winking or Open */}
          {isWinkingMode ? (
            <g id="body-right-eye-winking">
              <path
                d="M110 97 Q122 84 135 97"
                stroke="#2B1000"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M134 93 L139 90" stroke="#2B1000" strokeWidth="2.8" strokeLinecap="round" />
            </g>
          ) : (
            <g id="body-right-eye-open">
              <ellipse cx="122" cy="95" rx="11" ry="14" fill="url(#eyeIris)" />
              <path d="M110 91 Q122 83 134 90" stroke="#1A0A00" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <path d="M132 89 L137 86" stroke="#1A0A00" strokeWidth="2" strokeLinecap="round" />
              <circle cx="119" cy="90" r="4.6" fill="#FFFFFF" />
              <circle cx="126" cy="101" r="2.2" fill="#FFFFFF" />
              <path d="M117 103 Q122 106 126 103" stroke="#FFC04D" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* NOSE */}
          <path d="M98 103 Q100 106 102 103" stroke="#A84C00" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* SMILE */}
          <path
            d="M87 112 Q99 125 111 112"
            stroke="#590D0D"
            strokeWidth="4"
            strokeLinecap="round"
            fill="#801010"
          />
          <path d="M92 118 Q99 123 106 118" fill="#FF8095" />
          <path d="M91 114 Q99 115 107 114" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />

          {/* NECK ORANGE RIBBON TIE */}
          <g id="body-neck-ribbon">
            <path d="M90 144 C94 140 104 140 108 144 L111 151 L87 151 Z" fill="#E65100" />
            <circle cx="99" cy="147" r="4" fill="#FF8000" stroke="#B33600" strokeWidth="1.2" />
            <path d="M95 148 L90 159 M103 148 L108 159" stroke="#FF7300" strokeWidth="3.5" strokeLinecap="round" />
          </g>

          {/* ARTISAN CHEF UNIFORM & APRON */}
          {/* White Bib Apron */}
          <path
            d="M68 148 L132 148 L142 216 C124 222 100 224 80 222 C66 220 56 216 56 216 Z"
            fill="url(#apronFabric)"
            stroke="#FF7300"
            strokeWidth="2.2"
          />

          {/* Orange Apron Straps over shoulders */}
          <path d="M76 140 L70 150 M124 140 L130 150" stroke="#FF7300" strokeWidth="3" />

          {/* CHEST EMBLEM: Official Hải Hương circular swirl monogram (Circle 2 of photo) */}
          <circle cx="99" cy="168" r="12" fill="#FFF7ED" stroke="#FF7300" strokeWidth="2.4" />
          <path
            d="M99 160 C104 160 107 163 107 168 C107 172 103 175 98 174 C94 173 93 170 94 167 C95 164 99 164 101 167"
            stroke="#FF7300"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />

          {/* WAIST SASH BELT */}
          <rect x="66" y="186" width="67" height="6" rx="2" fill="#FF7300" />

          {/* APRON LOWER HEM PATTERN: Swimming Cá Cơm (Anchovies) + Ocean Waves (Circle 5 of photo) */}
          <g id="apron-waves-and-fish" opacity="0.9">
            {/* Waves line */}
            <path
              d="M58 210 Q66 205 74 210 Q82 215 90 210 Q98 205 106 210 Q114 215 122 210 Q130 205 138 210"
              stroke="#FF7300"
              strokeWidth="1.8"
              fill="none"
            />
            {/* Leaping cá cơm anchovy fish 1 */}
            <path
              d="M72 201 C78 198 84 200 87 203 C84 204 77 205 72 201 Z"
              fill="#FF7300"
            />
            <polygon points="72,201 68,198 69,203" fill="#FF7300" />
            <circle cx="84" cy="201.5" r="0.8" fill="#FFF" />

            {/* Leaping cá cơm anchovy fish 2 */}
            <path
              d="M108 201 C114 198 120 200 123 203 C120 204 113 205 108 201 Z"
              fill="#FF7300"
            />
            <polygon points="108,201 104,198 105,203" fill="#FF7300" />
            <circle cx="120" cy="201.5" r="0.8" fill="#FFF" />
          </g>

          {/* ========================================================= */}
          {/* HANDS & PROPS */}
          {/* ========================================================= */}
          {isWinkingMode ? (
            // THUMBS UP HERO POSE (Figure 5 of photo)
            <g id="winking-hero-hands">
              {/* Right Arm giving a proud THUMBS UP! */}
              <g id="thumbs-up-hand">
                {/* Arm sleeve */}
                <path d="M58 155 C46 150 36 142 34 134 C40 130 48 135 56 142 Z" fill="#FFFBF5" stroke="#E3D5C0" strokeWidth="1.5" />
                <rect x="33" y="132" width="12" height="4" rx="2" fill="#FFA31A" />
                {/* Hand with Thumbs Up */}
                <circle cx="28" cy="126" r="7" fill="#FFC820" stroke="#D95700" strokeWidth="1.2" />
                {/* Thumb pointing straight up ("Số 1") */}
                <rect x="25" y="112" width="6" height="13" rx="3" fill="#FFC820" stroke="#D95700" strokeWidth="1.2" />
                {/* Curled fingers */}
                <path d="M25 125 C23 128 24 133 28 133" stroke="#D95700" strokeWidth="1.5" />
              </g>

              {/* Left Arm securely holding the bottle of Nước Mắm Hải Hương */}
              <g id="holding-bottle-chest">
                {/* Bottle of Nước Mắm Hải Hương (Circle 3 of photo) */}
                <g id="haihuong-sauce-bottle" transform="translate(138, 108) rotate(6)">
                  {/* Bottle body */}
                  <rect x="0" y="24" width="22" height="62" rx="5" fill="url(#amberBottleGlass)" stroke="#FFD8A8" strokeWidth="1" />
                  {/* Bottle neck */}
                  <rect x="6" y="8" width="10" height="18" rx="2" fill="url(#amberBottleGlass)" />
                  {/* Gold screw cap */}
                  <rect x="5" y="0" width="12" height="9" rx="2" fill="url(#goldCapGrad)" stroke="#8A4A00" strokeWidth="1" />
                  {/* Label: HẢI HƯƠNG - NƯỚC MẮM NHĨ - NƯỚC ĐẠM 60N */}
                  <rect x="1.5" y="36" width="19" height="34" rx="2" fill="#FFFBF2" stroke="#FF7300" strokeWidth="0.8" />
                  <circle cx="11" cy="44" r="4.5" fill="#FF7300" />
                  <circle cx="11" cy="44" r="3.2" fill="#FFF" />
                  <text x="11" y="54" fill="#3D1B00" fontSize="3.8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">HẢI HƯƠNG</text>
                  <text x="11" y="59" fill="#D95700" fontSize="2.8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">60°N</text>
                  {/* Anchovy illustration on label */}
                  <ellipse cx="11" cy="64" rx="6" ry="1.5" fill="#FFA31A" />
                </g>

                {/* Hand holding bottle */}
                <circle cx="140" cy="158" r="8" fill="#FFC820" stroke="#D95700" strokeWidth="1.2" />
                <circle cx="145" cy="153" r="4.5" fill="#FFC820" />
              </g>
            </g>
          ) : (
            // STANDING WELCOMING POSE (Figure 1 of photo)
            <g id="standing-welcoming-hands">
              {/* Right Hand: Holding the bottle of Nước Mắm Hải Hương */}
              <g id="standing-bottle-left">
                {/* Arm */}
                <path d="M58 158 C46 166 40 178 44 190 C50 192 56 186 62 176 Z" fill="#FFFBF5" stroke="#E3D5C0" strokeWidth="1.5" />
                {/* Bottle */}
                <g id="haihuong-sauce-bottle-standing" transform="translate(24, 118)">
                  <rect x="0" y="24" width="22" height="62" rx="5" fill="url(#amberBottleGlass)" stroke="#FFD8A8" strokeWidth="1" />
                  <rect x="6" y="8" width="10" height="18" rx="2" fill="url(#amberBottleGlass)" />
                  <rect x="5" y="0" width="12" height="9" rx="2" fill="url(#goldCapGrad)" stroke="#8A4A00" strokeWidth="1" />
                  <rect x="1.5" y="36" width="19" height="34" rx="2" fill="#FFFBF2" stroke="#FF7300" strokeWidth="0.8" />
                  <circle cx="11" cy="44" r="4.5" fill="#FF7300" />
                  <circle cx="11" cy="44" r="3.2" fill="#FFF" />
                  <text x="11" y="54" fill="#3D1B00" fontSize="3.8" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">HẢI HƯƠNG</text>
                  <text x="11" y="59" fill="#D95700" fontSize="2.8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">60°N</text>
                  <ellipse cx="11" cy="64" rx="6" ry="1.5" fill="#FFA31A" />
                </g>
                {/* Hand gripping bottle */}
                <circle cx="42" cy="162" r="7.5" fill="#FFC820" stroke="#D95700" strokeWidth="1.2" />
              </g>

              {/* Left Hand: Open welcoming forward */}
              <g id="welcoming-open-hand">
                <path d="M136 158 C148 166 160 170 170 166 C172 160 166 154 154 150 Z" fill="#FFFBF5" stroke="#E3D5C0" strokeWidth="1.5" />
                <circle cx="170" cy="164" r="7.5" fill="#FFC820" stroke="#D95700" strokeWidth="1.2" />
                <path d="M166 160 C172 158 178 164 172 168" stroke="#D95700" strokeWidth="1.5" fill="none" />
              </g>
            </g>
          )}
        </g>
      )}
    </svg>
  );

  // Tip-card pose: Mascot delivers empathy insights in a prominent card
  if (pose === 'tip-card') {
    return (
      <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#FFF8EB] to-amber-500/10 border border-[#FFA31A]/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 ${className}`}>
        <div className="w-18 h-18 sm:w-22 sm:h-22 shrink-0 relative drop-shadow-md">
          {renderMascotSvg(false, true, false)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-extrabold text-[#B34700] tracking-wider">
              {tipTitle}
            </span>
            <span className="text-[10px] bg-[#FFA31A]/20 text-[#8A3E00] font-bold px-2 py-0.5 rounded-full border border-[#FFA31A]/30">
              Đại sứ Hương Giọt Biển
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4A1E00] font-medium mt-1 leading-relaxed">
            {tipText || 'Hôm nay có 12 khách hàng thân thiết đến chu kỳ cạn mắm trong bếp. Hãy gửi lời hỏi thăm đượm vị tình thân kèm ưu đãi Freeship để chăm sóc khách nhé!'}
          </p>
        </div>
        {actionText && onActionClick && (
          <button
            onClick={onActionClick}
            className="px-4 py-2 rounded-xl bg-[#FFA31A] hover:bg-[#E67E00] text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0 self-stretch sm:self-auto text-center hover:shadow-md"
          >
            {actionText}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${pixelSizes[size]} ${className}`}>
      {renderMascotSvg(pose === 'avatar', isWink, isBack)}
      {speechBubble && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-[#3D1B00] text-[11px] font-bold px-2.5 py-1 rounded-full border border-[#FFA31A]/40 shadow-md pointer-events-none z-10 animate-bounce">
          {speechBubble}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}
    </div>
  );
};
