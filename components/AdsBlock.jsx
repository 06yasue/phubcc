'use client';

import { useEffect, useRef } from 'react';

export default function AdsBlock({ html }) {

  const ref = useRef(null);

  useEffect(() => {

    if (!ref.current) return;

    // inject html
    ref.current.innerHTML = html;

    // rerun scripts
    const scripts = ref.current.querySelectorAll('script');

    scripts.forEach((script) => {

      const newScript = document.createElement('script');

      // copy src
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      }

      // copy inline js
      newScript.innerHTML = script.innerHTML;

      script.parentNode.replaceChild(newScript, script);

    });

  }, [html]);

  return <div ref={ref}></div>;
}
