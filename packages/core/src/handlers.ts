import { useCallback } from 'react';
import { DefaultSchema, UrlState, UrlStateMethods } from './types';

export type Push = (href: string) => void;

export function usePush(update: () => void): Push {
  return useCallback((href: string) => {
    window.history.pushState({}, '', href);
    update();
  }, []);
}

export function useHandlers<T extends DefaultSchema>(
  push: Push,
  stateRef: React.MutableRefObject<UrlState<T>>,
) {
  const reset = useCallback<UrlStateMethods<T>['reset']>(() => {
    const href = `?${new URLSearchParams({}).toString()}`;
    push(href);
  }, [push]);

  const replace = useCallback<UrlStateMethods<T>['replace']>(
    (data) => {
      const href = `?${new URLSearchParams(data).toString()}`;
      push(href);
    },
    [push],
  );

  const setValue = useCallback<UrlStateMethods<T>['setValue']>(
    (key, value) => {
      const href = `?${new URLSearchParams({
        ...stateRef.current.data,
        [key]: value,
      }).toString()}`;
      push(href);
    },
    [push],
  );

  return { reset, replace, setValue };
}
