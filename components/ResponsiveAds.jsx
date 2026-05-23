'use client';

import { useEffect, useState } from 'react';
import AdsBlock from './AdsBlock';

export default function ResponsiveAds({
  mobileAds,
  desktopAds,
}) {

  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {

    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };

    check();

    window.addEventListener('resize', check);

    return () => window.removeEventListener('resize', check);

  }, []);

  // biar gak flicker SSR
  if (isMobile === null) return null;

  return (
    <div className="top-ads-wrapper">

      {isMobile ? (
        mobileAds && (
          <div className="adsterra-mobile">
            <AdsBlock html={mobileAds} />
          </div>
        )
      ) : (
        desktopAds && (
          <div className="adsterra-desktop">
            <AdsBlock html={desktopAds} />
          </div>
        )
      )}

    </div>
  );
}
