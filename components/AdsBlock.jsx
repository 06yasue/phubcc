'use client';

import { useEffect, useRef } from 'react';

export default function AdsBlock({ html }) {

  const ref = useRef(null);

  useEffect(() => {

    if (!ref.current) return;

    // bersihkan dulu
    ref.current.innerHTML = html;

    // ambil semua script dalam component ini aja
    const scripts = ref.current.querySelectorAll('script');

    scripts.forEach((script) => {

      const newScript = document.createElement('script');

      // copy src
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      }

      // copy inline script
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }

      // replace
      script.parentNode.replaceChild(newScript, script);

    });

  }, [html]);

  return <div ref={ref}></div>;
}
