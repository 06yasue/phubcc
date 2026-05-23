'use client';

import { useEffect, useRef } from 'react';

export default function AdsBlock({ html }) {

  const adsRef = useRef(null);

  useEffect(() => {

    if (!adsRef.current) return;

    // Cari semua script
    const scripts = adsRef.current.querySelectorAll('script');

    scripts.forEach((oldScript) => {

      const newScript = document.createElement('script');

      // Copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // Copy isi script
      newScript.text = oldScript.innerHTML;

      // Replace script lama
      oldScript.parentNode.replaceChild(newScript, oldScript);

    });

  }, [html]);

  return (
    <div
      ref={adsRef}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
