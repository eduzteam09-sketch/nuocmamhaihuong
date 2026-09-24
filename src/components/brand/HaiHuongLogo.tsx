import React, { useState } from 'react';

export const HAI_HUONG_OFFICIAL_LOGO_URL = 'https://haihuong.vn/datafiles/209/default/icon/17646441121503_logo-dai.png';
export const HAI_HUONG_LOCAL_LOGO_URL = '/logo-haihuong.png';

interface HaiHuongLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'white' | 'badge';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withContainer?: boolean;
}

export const HaiHuongLogo: React.FC<HaiHuongLogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  withContainer = false,
}) => {
  const [imgSrc, setImgSrc] = useState(HAI_HUONG_OFFICIAL_LOGO_URL);

  const sizeClasses = {
    sm: 'h-7 sm:h-8 max-h-8 max-w-[135px]',
    md: 'h-9 sm:h-10 max-h-10 max-w-[175px]',
    lg: 'h-12 sm:h-13 max-h-13 max-w-[230px]',
    xl: 'h-15 sm:h-16 max-h-16 max-w-[280px]',
  };

  const imageElement = (
    <img
      src={imgSrc}
      alt="Nước Mắm Hải Hương - Người Bạn Tận Tâm"
      onError={() => {
        if (imgSrc !== HAI_HUONG_LOCAL_LOGO_URL) {
          setImgSrc(HAI_HUONG_LOCAL_LOGO_URL);
        }
      }}
      referrerPolicy="no-referrer"
      className={`${sizeClasses[size]} w-auto object-contain select-none transition-transform duration-200 hover:scale-[1.02]`}
      loading="eager"
    />
  );

  if (withContainer) {
    return (
      <div 
        id="hai-huong-logo-container" 
        className={`inline-flex items-center justify-center px-2.5 py-1 bg-[#3D1B00] rounded-xl border border-[#FFA31A]/30 shadow-xs ${className}`}
      >
        {imageElement}
      </div>
    );
  }

  return (
    <div id="hai-huong-logo-wrapper" className={`inline-flex items-center select-none ${className}`}>
      {imageElement}
    </div>
  );
};
