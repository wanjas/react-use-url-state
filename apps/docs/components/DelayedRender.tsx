import { ReactNode, useEffect, useState } from 'react';

export function DelayedRender({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsReady(true);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return isReady ? <>{children}</> : null;
}
