'use client';

import { useEffect, useRef } from 'react';

export default function AdsBlock({ html }) {

  const ref = useRef(null);

  useEffect(() => {

    if (!ref.current) return;

    ref.current.innerHTML = html;

    const scripts = ref.current.querySelectorAll('script');

    scripts.forEach((script) => {

      const newScript = document.createElement('script');

      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      }

      newScript.innerHTML = script.innerHTML;

      script.parentNode.replaceChild(newScript, script);

    });

  }, [html]);

  return <div ref={ref}></div>;
}
