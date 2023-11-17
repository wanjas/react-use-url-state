import { useCallback, useEffect, useRef, useState } from 'react';
import { useHandlers, usePush } from './handlers';
import { GenericRouter, UrlStateRouter } from './router';
import {
  DefaultSchema,
  UrlState,
  UrlStateMethods,
  UrlStateOptions,
} from './types';
import { urlParamsToObject } from './utils';

type StateUpdateNotifier = (searchString: string) => void;

const subscribers = new Map<StateUpdateNotifier, StateUpdateNotifier>();

let currentStateString = '';

function update(newSearchParams: string) {
  console.log('Update');

  if (newSearchParams !== currentStateString) {
    currentStateString = newSearchParams;
    subscribers.forEach((subscriber) => subscriber(currentStateString));
  }
}

function subscribeToHistory(fn: StateUpdateNotifier) {
  subscribers.set(fn, fn);
}

function unsubscribeFromHistory(fn: StateUpdateNotifier) {
  subscribers.delete(fn);
}

export function useUrlState<T extends DefaultSchema>(
  schema: T,
  options?: UrlStateOptions,
) {
  const [router] = useState<UrlStateRouter>(new GenericRouter(update));

  useEffect(() => {
    return () => {
      router.destroy();
    };
  }, [router]);

  return useUrlStateWithRouter(schema, {
    ...options,
    preserveUnknown: false,
    router: router,
  });
}

export function useUrlStateWithRouter<T extends DefaultSchema>(
  schema: T,
  options: UrlStateOptions & { router: UrlStateRouter },
): UrlState<T> & UrlStateMethods<T> {
  // options = {
  //   preserveUnknown: false,
  //   ...options,
  // };

  const schemaRef = useRef(schema);

  const [state, setState] = useState<UrlState<T>>({
    data: null,
    isError: false,
    error: null,
    isReady: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const recalculateState = useCallback(
    (searchString: string) => {
      const params = new URLSearchParams(searchString);
      const object = urlParamsToObject(params);

      const validationResult = schemaRef.current.safeParse(object);

      const result = validationResult.success
        ? { success: true, data: validationResult.data, error: null }
        : { success: false, data: null, error: validationResult.error };

      if (options?.preserveUnknown) {
        result.data = { ...object, ...result.data };
      }

      setState({
        data: result.data,
        isError: !result.success,
        error: result.error,
        isReady: true,
      });
    },
    [options?.preserveUnknown],
  );

  useEffect(() => {
    subscribeToHistory(recalculateState);

    return () => {
      unsubscribeFromHistory(recalculateState);
    };
  }, [recalculateState]);

  // set the state from initial url
  useEffect(() => {
    update(window.location.search);
  }, []);

  const push = usePush(options.router);

  const handlers = useHandlers<T>(push, stateRef);

  return { ...state, ...handlers };
}
