type Callback = (newSearchParams: string) => void;

export abstract class UrlStateRouter {
  push(href: string): void {}
  onSearchParamsChange(): void {}
  destroy(): void {}
}

let genericRouterCurrentStateString = '';
export class GenericRouter extends UrlStateRouter {
  private interval: number;

  constructor(private callback: Callback) {
    super();

    // 'popstate' event in browser is not reliable, so we need to poll
    this.interval = setInterval(() => {
      this.onSearchParamsChange();
    }, 100);
  }

  override push(href: string): void {
    window.history.pushState({}, '', href);
    this.onSearchParamsChange();
  }

  override onSearchParamsChange(): void {
    if (document.location.search !== genericRouterCurrentStateString) {
      genericRouterCurrentStateString = document.location.search;
      this.callback(window.location.search);
    }
  }

  override destroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
