import { urlParamsToObject } from './utils';

export type Callback = (newParams: Record<string, string | string[]>) => void;

export interface UrlStateControllerInterface {
  push(href: string): void;

  subscribe(fn: Callback): void;
  unsubscribe(fn: Callback): void;
}

export type UrlStateControllerOptions = {
  poolingIntervalMs?: number;
};

export class UrlStateController implements UrlStateControllerInterface {
  static singleton: UrlStateController | null = null;

  private stateString = '';
  private previousHref = '';
  private interval: number = 0;
  private subscribers = new Map<Callback, Callback>();

  private constructor(private options: UrlStateControllerOptions) {
    this.options = { poolingIntervalMs: 100, ...options };
  }

  static getUrlStateController() {
    if (!UrlStateController.singleton) {
      UrlStateController.singleton = new UrlStateController({});
    }
    return UrlStateController.singleton;
  }

  push(href: string): void {
    window.history.pushState({}, '', href);

    // Use a timeout to ensure the URL is updated before checking
    setTimeout(() => {
      this.onSearchParamsChange();
    }, 0);
  }

  subscribe(fn: Callback): void {
    this.subscribers.set(fn, fn);

    const newSearchParams = new URLSearchParams(this.stateString);
    const search = urlParamsToObject(newSearchParams);
    setTimeout(() => fn(search), 0);

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
    if (window.location.href !== this.previousHref) {
      this.previousHref = window.location.href;

      const newSearchParams = new URLSearchParams(window.location.search);
      const search = urlParamsToObject(newSearchParams);
      this.subscribers.forEach((subscriber) => subscriber(search));
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
      this.interval = 0;
    }
  }
}
