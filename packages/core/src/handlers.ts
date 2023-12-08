import { MutableRefObject, useCallback, useMemo } from 'react';
import { UrlStateRouter } from './router';
import { DefaultSchema, UrlState, UrlStateMethods } from './types';
import { serializeObjectToUrlParams } from './utils';

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
  stateRef: MutableRefObject<UrlState<T>>,
) {
  const setState = useCallback<UrlStateMethods<T>['setState']>(
    (state) => {
      if (typeof state === 'function') {
        state = state(stateRef.current.data);
      }
      const href = serializeObjectToUrlParams(state);
      push(href);
    },
    [push, stateRef],
  );

  const updateState = useCallback<UrlStateMethods<T>['updateState']>(
    (state) => {
      if (typeof state === 'function') {
        state = state(stateRef.current.data);
      }
      const href = serializeObjectToUrlParams({
        ...stateRef.current.data,
        ...state,
      });
      push(href);
    },
    [push, stateRef],
  );

  const setValue = useCallback<UrlStateMethods<T>['setValue']>(
    (key, value) => {
      const href = serializeObjectToUrlParams({
        ...stateRef.current.data,
        [key]: value,
      });
      push(href);
    },
    [push, stateRef],
  );

  return useMemo(
    () => ({ setState, setValue, updateState }),
    [setState, setValue, updateState],
  );
}
