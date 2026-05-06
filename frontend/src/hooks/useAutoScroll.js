import { useEffect } from 'react';

export function useAutoScroll(ref, dependency) {
  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [ref, dependency]);
}
