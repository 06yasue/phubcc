'use client';

import { useEffect, useState } from 'react';

export default function AdsBlock({ html }) {

  const [content, setContent] = useState('');

  useEffect(() => {

    // Delay sedikit biar DOM ready
    const timer = setTimeout(() => {
      setContent(html);
    }, 100);

    return () => clearTimeout(timer);

  }, [html]);

  useEffect(() => {

    const scripts = document.querySelectorAll('.ads-block script');

    scripts.forEach((oldScript) => {

      const newScript = document.createElement('script');

      // copy attributes
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });

      // inline script
      newScript.text = oldScript.innerHTML;

      oldScript.parentNode.replaceChild(newScript, oldScript);

    });

  }, [content]);

  return (
    <div
      className="ads-block"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
