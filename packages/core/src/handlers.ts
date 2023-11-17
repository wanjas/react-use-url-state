import { useCallback } from 'react';
import { UrlStateRouter } from './router';
import { DefaultSchema, UrlState, UrlStateMethods } from './types';

export type Push = (href: string) => void;

export function usePush(router: UrlStateRouter): Push {
  return useCallback(
    (href: string) => {
      router.push(href);
    },
    [router],
  );
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
    [push, stateRef],
  );

  return { reset, replace, setValue };
}
