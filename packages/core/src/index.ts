import { useCallback, useEffect, useRef, useState } from 'react';
import { useHandlers, usePush } from './handlers';
import { getGenericRouter, UrlStateRouter } from './router';
import {
  DefaultSchema,
  UrlState,
  UrlStateMethods,
  UrlStateOptions,
  UrlStateValue,
} from './types';
import {
  searchIsEmpty,
  urlParamsToObject,
  useShallowEqualValue,
} from './utils';

export function useUrlState<T extends DefaultSchema>(
  schema: T,
  initialValue?: UrlStateValue<T> | null,
  options?: UrlStateOptions,
) {
  const [router] = useState<UrlStateRouter>(() => getGenericRouter());

  return useUrlStateWithRouter(schema, initialValue || null, {
    applyInitialValue: false,
    ...options,
    router: router,
  });
}

export function useUrlStateWithRouter<T extends DefaultSchema>(
  schema: T,
  initialValue: UrlStateValue<T> | null,
  options: UrlStateOptions & { router: UrlStateRouter },
): UrlState<T> & UrlStateMethods<T> {
  const schemaRef = useRef(schema);
  const cachedInitialValue = useShallowEqualValue(initialValue);

  const [state, setState] = useState<UrlState<T>>({
    data: cachedInitialValue,
    error: null,
    isError: false,
    isReady: false,
  });

  // needed it order to make handler functions stable
  const stateRef = useRef(state);
  stateRef.current = state;

  const recalculateState = useCallback((searchString: string) => {
    const params = new URLSearchParams(searchString);
    const object = urlParamsToObject(params);

    const validationResult = schemaRef.current.safeParse(object);

    const result = validationResult.success
      ? { success: true, data: validationResult.data ?? null, error: null }
      : { success: false, data: object, error: validationResult.error };

    setState({
      data: result.data,
      isError: !result.success,
      error: result.error,
      isReady: true,
    });
  }, []);

  useEffect(() => {
    options.router.subscribe(recalculateState);

    return () => {
      options.router.unsubscribe(recalculateState);
    };
  }, [options.router, recalculateState]);

  const push = usePush(options.router);

  const handlers = useHandlers<T>(push, stateRef);

  // set the state from initial url
  useEffect(() => {
    const searchString = window.location.search;

    if (!searchIsEmpty(searchString)) {
      recalculateState(searchString);
    } else if (cachedInitialValue && options.applyInitialValue) {
      handlers.setState(cachedInitialValue);
    } else {
      setState((st) => ({
        ...st,
        isReady: true,
      }));
    }
  }, [
    cachedInitialValue,
    handlers,
    options.applyInitialValue,
    recalculateState,
  ]);

  return { ...state, ...handlers };
}
