// This file is for global type declarations

// It tells TypeScript about the global `Telegram` object provided by the Telegram Web App environment.
// See: https://core.telegram.org/bots/webapps/webview#window-telegram

interface Window {
  Telegram: {
    WebApp: {
      /**
       * A string containing the Web App init data.
       */
      initData: string;
      /**
       * The current theme parameters.
       */
      themeParams: object;
      /**
       * The current viewport height.
       */
      viewportHeight: number;
      /**
       * True, if the viewport is stable.
       */
      isVersionAtLeast(version: string): boolean;
      /**
       * An object with the current color scheme.
       */
      colorScheme: 'light' | 'dark';
      /**
       * The back button object.
       */
      BackButton: {
        show(): void;
        hide(): void;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
      };
      /**
       * The main button object.
       */
      MainButton: {
        show(): void;
        hide(): void;
        setParams(params: {
          text?: string;
          color?: string;
          text_color?: string;
          is_active?: boolean;
          is_visible?: boolean;
        }): void;
        onClick(callback: () => void): void;
        offClick(callback: () => void): void;
      };
      /**
       * A method that expands the Web App to the maximum available height.
       */
      expand(): void;
      /**
       * A method that informs the host app that the Web App is ready.
       */
      ready(): void;
      /**
       * A method to close the Web App.
       */
      close(): void;
      /**
       * A method that registers an event handler.
       */
      onEvent(eventType: 'viewportChanged', eventHandler: (payload: { isStateStable: boolean }) => void): void;
      /**
       * A method that removes an event handler.
       */
      offEvent(eventType: 'viewportChanged', eventHandler: (payload: { isStateStable: boolean }) => void): void;
    };
  };
} 