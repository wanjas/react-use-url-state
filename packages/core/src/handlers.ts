import { MutableRefObject, useCallback, useMemo } from 'react';
import { UrlStateController } from './controller';
import { DefaultSchema, UrlState, UrlStateMethods } from './types';
import { serializeObjectToUrlParams } from './utils';

export function useHandlers<T extends DefaultSchema>(
  controller: UrlStateController,
  stateRef: MutableRefObject<UrlState<T>>,
) {
  const setState = useCallback<UrlStateMethods<T>['setState']>(
    (state) => {
      if (typeof state === 'function') {
        state = state(stateRef.current.data);
      }
      const href = serializeObjectToUrlParams(state);
      controller.push(href);
    },
    [controller, stateRef],
  );

  const setValues = useCallback<UrlStateMethods<T>['setValues']>(
    (state) => {
      if (typeof state === 'function') {
        state = state(stateRef.current.data);
      }
      const href = serializeObjectToUrlParams({
        ...stateRef.current.data,
        ...state,
      });
      controller.push(href);
    },
    [controller, stateRef],
  );

  const setValue = useCallback<UrlStateMethods<T>['setValue']>(
    (key, value) => {
      const href = serializeObjectToUrlParams({
        ...stateRef.current.data,
        [key]: value,
      });
      controller.push(href);
    },
    [controller, stateRef],
  );

  return useMemo(
    () => ({ setState, setValue, setValues }),
    [setState, setValue, setValues],
  );
}
