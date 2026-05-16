import { useState, useEffect } from 'react';

/**
 * useSkeletonDelay
 *
 * Prevents skeleton flash when data loads very quickly.
 * Only shows skeleton if loading takes longer than `delayMs`.
 *
 * Usage:
 *   const showSkeleton = useSkeletonDelay(isPending, 200);
 */
export function useSkeletonDelay(isLoading: boolean, delayMs = 200) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }

    const timer = setTimeout(() => {
      setShow(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [isLoading, delayMs]);

  return show;
}
