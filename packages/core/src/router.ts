type Callback = (newSearchParams: string) => void;

export abstract class UrlStateRouter {
  push(href: string): void {}
  onSearchParamsChange(): void {}
  destroy(): void {}
}

let genericRouterCurrentStateString = '';
export class GenericRouter extends UrlStateRouter {
  private interval = 0;

  constructor(private callback: Callback) {
    super();

    // 'popstate' event in browser is not reliable, so we need to poll
    if (typeof window !== 'undefined') {
      this.interval = setInterval(() => {
        this.onSearchParamsChange();
      }, 100);
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
