import { useEffect, useState } from 'react';
import { supabase } from './supabase';

/**
 * Loads a page's text from the Supabase table `page_content` (page, key, value).
 * `fallback` is the local copy, shown first and kept for any key the database doesn't have.
 */
export default function useContent(page, fallback) {
  const [content, setContent] = useState(fallback);
  const [source, setSource] = useState('local');

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    supabase
      .from('page_content')
      .select('key, value')
      .eq('page', page)
      .then(({ data, error }) => {
        if (!alive || error || !data || !data.length) return;
        const fromDb = Object.fromEntries(data.map((row) => [row.key, row.value]));
        setContent((prev) => ({ ...prev, ...fromDb }));
        setSource('supabase');
      });
    return () => { alive = false; };
  }, [page]);

  return { content, source };
}
