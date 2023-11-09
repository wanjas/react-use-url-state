import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { urlParamsToObject } from './utils';

type StateUpdateNotifier = (searchString: string) => void;

let isSubscribed = false;
const subscribers = new Map<StateUpdateNotifier, StateUpdateNotifier>();

let currentStateString = '';

function update() {
  if (document.location.search !== currentStateString) {
    currentStateString = document.location.search;
    subscribers.forEach((subscriber) => subscriber(currentStateString));
  }
}

function subscribeToHistory(fn: StateUpdateNotifier) {
  subscribers.set(fn, fn);

  if (isSubscribed) {
    return;
  }

  window.addEventListener('popstate', update);
}

function unsubscribeFromHistory(fn: StateUpdateNotifier) {
  subscribers.delete(fn);

  if (subscribers.size === 0) {
    window.removeEventListener('popstate', update);
    isSubscribed = false;
  }
}

// const schema = z.object({
//   name: z.string(),
//   age: z.number(),
// });

export type UrlStateOptions = {
  preserveUnknown: boolean;
};

export type UrlState<T extends z.ZodObject<Record<string, z.ZodTypeAny>>> = {
  data: z.infer<T> | null;
  isError: boolean;
  error: z.ZodError | null;
};

// export type UrlStateValue =
//   | string
//   | { toString: () => string }
//   | (string | { toString: () => string })[];

export type UrlStateMethods<
  T extends z.ZodObject<Record<string, z.ZodTypeAny>>,
> = {
  reset: () => void;
  replace: (data: z.infer<T>) => void;
  setValue: <K extends keyof z.infer<T>>(key: K, value: z.infer<T>[K]) => void;
};

function usePush(): (href: string) => void {
  return useCallback((href: string) => {
    window.history.pushState({}, '', href);
  }, []);
}

export function useUrlState<
  T extends z.ZodObject<Record<string, z.ZodTypeAny>>,
>(schema: T, options?: UrlStateOptions): UrlState<T> & UrlStateMethods<T> {
  options = {
    preserveUnknown: false,
    ...options,
  };

  const schemaRef = useRef(schema);

  const [state, setState] = useState<UrlState<T>>({
    data: null,
    isError: false,
    error: null,
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

  const push = usePush();

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

  return { ...state, replace, setValue, reset };
}

function useTest() {
  const rez = useUrlState(
    z.object({
      name: z.string(),
      age: z.number(),
      birthDate: z.date().optional(),
    }),
  );

  rez.setValue('age', 10);
  rez.setValue('birthDate', new Date());

  console.log(rez.data?.birthDate);

  rez.replace({ name: 'test', age: 10, birthDate: new Date() });
  rez.replace({ name: 'test', age: 10 });
}
