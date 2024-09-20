export type Callback = (newSearchParams: string) => void;

declare global {
  interface Window {
    next?: {
      router?: {
        push: (href: string) => void;
      };
    };
  }
}

export interface UrlStateRouter {
  push(href: string): void;

  subscribe(fn: Callback): void;
  unsubscribe(fn: Callback): void;
}

export type GenericRouterOptions = {
  poolingIntervalMs?: number;
};

let genericRouterCurrentStateString = '';
export class GenericRouter implements UrlStateRouter {
  private interval: number = 0;
  private subscribers = new Map<Callback, Callback>();

  constructor(private options: GenericRouterOptions) {
    this.options = { poolingIntervalMs: 100, ...options };
  }

  push(href: string): void {
    // Use Next.js router if available
    // Next.js exposes a global object `window.next.router` with a `push` method for both /pages and /app routes
    // if (typeof window.next?.router?.push === 'function') {
    //   console.log('Next.js router is available');
    //   window.next.router.push(href);
    // } else {
    // console.log('Next.js router is NOT available');
    window.history.pushState({}, '', href);
    // }
    this.onSearchParamsChange();
  }

  subscribe(fn: Callback): void {
    this.subscribers.set(fn, fn);

    if (!this.interval) {
      this.startPolling();
    }
  }

  unsubscribe(fn: Callback): void {
    this.subscribers.delete(fn);

    if (this.subscribers.size === 0) {
      this.stopPolling();
    }
  }

  onSearchParamsChange(): void {
    if (window.location.search !== genericRouterCurrentStateString) {
      genericRouterCurrentStateString = window.location.search;
      this.subscribers.forEach((subscriber) =>
        subscriber(genericRouterCurrentStateString),
      );
    }
  }

  private startPolling(): void {
    // 'popstate' event in browser is not reliable, so we need to poll
    // https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event#when_popstate_is_sent
    if (typeof window !== 'undefined') {
      this.interval = setInterval(() => {
        this.onSearchParamsChange();
      }, this.options.poolingIntervalMs) as unknown as number; // type fix for NodeJS
    }
  }

  private stopPolling(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}

let genericRouterInstance: GenericRouter | null = null;
export function getGenericRouter() {
  if (!genericRouterInstance) {
    genericRouterInstance = new GenericRouter({});
  }

  return genericRouterInstance;
}
