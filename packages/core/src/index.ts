import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod'

let isSubscribed = false;

type StateUpdateNotifier = (searchString: string) => void;
const subscribers = new Map<StateUpdateNotifier, StateUpdateNotifier>();

let currentStateString = ''

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

  window.addEventListener("popstate", update);
}

function unsubscribeFromHistory(fn: StateUpdateNotifier) {
  subscribers.delete(fn);

  if (subscribers.size === 0) {
    window.removeEventListener("popstate", update);
    isSubscribed = false;
  }
}

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

export type UrlStateOptions = {
  preserveUnknown: boolean;
}

export type UrlState<T extends z.ZodObject<any>> = {
  data: T['_type'];
  isError: boolean;
}

export function useUrlState<T extends z.ZodObject<any>>(schema: T, options?: UrlStateOptions): UrlState<T> {
  options = {
    preserveUnknown: false,
    ...options,
  }

  const schemaRef = useRef(schema);
  const rawDataRef = useRef<Record<string, unknown>>({});

  const recalculateState = useCallback((searchString: string) => {
    const params = new URLSearchParams(searchString);

  }, [])

  useEffect(() => {
    subscribeToHistory(recalculateState)

    return () => {
      unsubscribeFromHistory(recalculateState)
    }
  }, []);


  return {
    data: schema.parse({ name: 'John', age: 42 }),
    isError: false,
  }
}
