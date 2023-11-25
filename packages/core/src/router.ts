type Callback = (newSearchParams: string) => void;

export abstract class UrlStateRouter {
  push(href: string): void {}
  onSearchParamsChange(): void {}
  init(): void {}
  destroy(): void {}
}

export type GenericRouterOptions = {
  poolingIntervalMs?: number;
};

let genericRouterCurrentStateString = '';
export class GenericRouter extends UrlStateRouter {
  private interval = 0;

  constructor(
    private callback: Callback,
    private options: GenericRouterOptions,
  ) {
    super();
    this.options = { poolingIntervalMs: 100, ...options };
  }

  override init(): void {
    // 'popstate' event in browser is not reliable, so we need to poll
    if (typeof window !== 'undefined') {
      this.interval = setInterval(() => {
        this.onSearchParamsChange();
      }, this.options.poolingIntervalMs);
    }
  }

  override push(href: string): void {
    window.history.pushState({}, '', href);
    this.onSearchParamsChange();
  }

  override onSearchParamsChange(): void {
    if (window.location.search !== genericRouterCurrentStateString) {
      genericRouterCurrentStateString = window.location.search;
      this.callback(window.location.search);
    }
  }

  override destroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
