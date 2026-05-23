'use client';

import { useEffect, useRef, useState } from 'react';

export default function AdsBlock({ html }) {

  const adsRef = useRef(null);
  const [content, setContent] = useState('');

  // render html setelah mount
  useEffect(() => {

    const timer = setTimeout(() => {
      setContent(html);
    }, 100);

    return () => clearTimeout(timer);

  }, [html]);

  // rerun script khusus dalam component ini aja
  useEffect(() => {

    if (!adsRef.current) return;

    const scripts = adsRef.current.querySelectorAll('script');

    scripts.forEach((oldScript) => {

      const newScript = document.createElement('script');

      // copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // copy isi script
      newScript.innerHTML = oldScript.innerHTML;

      oldScript.parentNode.replaceChild(newScript, oldScript);

    });

  }, [content]);

  return (
    <div
      ref={adsRef}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
