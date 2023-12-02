export type Callback = (newSearchParams: string) => void;

export abstract class UrlStateRouter {
  push(href: string): void {}

  subscribe(fn: Callback): void {}
  unsubscribe(fn: Callback): void {}
}

export type GenericRouterOptions = {
  poolingIntervalMs?: number;
};

const subscribers = new Map<Callback, Callback>();

let genericRouterCurrentStateString = '';
export class GenericRouter extends UrlStateRouter {
  private interval: number = 0;

  constructor(private options: GenericRouterOptions) {
    super();
    this.options = { poolingIntervalMs: 100, ...options };
  }

  override push(href: string): void {
    window.history.pushState({}, '', href);
    this.onSearchParamsChange();
  }

  override subscribe(fn: Callback): void {
    subscribers.set(fn, fn);

    if (!this.interval) {
      this.startPolling();
    }
  }

  override unsubscribe(fn: Callback): void {
    subscribers.delete(fn);

    if (subscribers.size === 0) {
      this.stopPolling();
    }
  }

  onSearchParamsChange(): void {
    if (window.location.search !== genericRouterCurrentStateString) {
      genericRouterCurrentStateString = window.location.search;
      subscribers.forEach((subscriber) =>
        subscriber(genericRouterCurrentStateString),
      );
    }
  }

  private startPolling(): void {
    // 'popstate' event in browser is not reliable, so we need to poll
    if (typeof window !== 'undefined') {
      this.interval = setInterval(() => {
        this.onSearchParamsChange();
      }, this.options.poolingIntervalMs) as unknown as number; // fix for NodeJS
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
