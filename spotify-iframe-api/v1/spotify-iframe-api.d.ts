// Spotify iFrame API v1 — https://open.spotify.com/embed/iframe-api/v1
// Checked against https://developer.spotify.com/documentation/embeds/references/iframe-api
// and the bundle source (undocumented parts are marked).

type SpotifyEmbedHeight = 80 | 152 | 232 | 352;

declare namespace SpotifyIframe {
  interface EmbedOptions {
    /** Spotify URI, e.g. `spotify:track:…`. If `url` is set, it takes precedence. */
    uri?: string;
    /** An open.spotify.com link or a short spotify.link. */
    url?: string;
    /** Iframe width. Defaults to `"100%"`. */
    width?: number | string;
    /** Iframe height. Defaults to `352`. */
    height?: number | string;
    /** The only supported value is `"dark"`. */
    theme?: "dark";
    /** Load the video version of an episode/show when available. */
    preferVideo?: boolean;
    /** Second to start playback from after `play()`. */
    startAt?: number;
  }

  interface PlaybackState {
    playingURI: string;
    isPaused: boolean;
    isBuffering: boolean;
    /** Milliseconds. */
    duration: number;
    /** Milliseconds. */
    position: number;
  }

  interface EmbedError {
    code: "invalid_uri" | "playback_error";
    message: string;
    recoverable: boolean;
  }

  interface EventMap {
    ready: object;
    playback_started: Pick<PlaybackState, "playingURI">;
    playback_update: PlaybackState;
    error: EmbedError;
    "uiaction/enterfullscreen": object;
    "uiaction/exitfullscreen": object;
  }

  type Listener<E extends keyof EventMap> = (e: { data: EventMap[E] }) => void;

  interface EmbedController {
    /** Accepts a Spotify URI or a full link. */
    loadEntity(uriOrUrl: string, preferVideo?: boolean, startAtSeconds?: number): void;
    /** Deprecated variant of `loadEntity`, accepts URIs only. */
    loadUri(uri: string, preferVideo?: boolean, startAtSeconds?: number): void;
    play(): void;
    playFromStart(): void;
    /** Alias of `playFromStart`. */
    restart(): void;
    pause(): void;
    resume(): void;
    togglePlay(): void;
    seek(seconds: number): void;
    /** Removes the iframe from the DOM. */
    destroy(): void;
    /** @returns unsubscribe function */
    addListener<E extends keyof EventMap>(event: E, handler: Listener<E>): () => void;
    /** Requires the same handler reference that was passed to `addListener`. */
    removeListener<E extends keyof EventMap>(event: E, handler: Listener<E>): void;
    /** Undocumented. */
    once<E extends keyof EventMap>(event: E, handler: Listener<E>): void;
    /** Undocumented. Alias of `addListener`. */
    on: EmbedController["addListener"];
    /** Undocumented. Alias of `removeListener`. */
    off: EmbedController["removeListener"];
    /** Undocumented. */
    setIframeDimensions(width: number | string, height: number | string): void;
    /** Undocumented. */
    readonly iframeElement: HTMLIFrameElement;
  }

  /** Undocumented. Alternative to the callback in `createController`. */
  interface ControllerHandlers {
    onCreateCallback?: (controller: EmbedController) => void;
    events?: {
      onReady?: Listener<"ready">;
      onPlaybackStarted?: Listener<"playback_started">;
      onPlaybackUpdate?: Listener<"playback_update">;
      onError?: Listener<"error">;
      onEnterFullscreen?: Listener<"uiaction/enterfullscreen">;
      onExitFullscreen?: Listener<"uiaction/exitfullscreen">;
    };
  }

  interface IFrameAPI {
    /** `element` is replaced with the iframe. */
    createController(
      element: Element,
      options: EmbedOptions,
      callback: ((controller: EmbedController) => void) | ControllerHandlers,
    ): void;
    /** Undocumented. Whether the episode/show has a video version. */
    supportsVideo(uri: string): Promise<boolean>;
  }
}

interface Window {
  onSpotifyIframeApiReady?: (api: SpotifyIframe.IFrameAPI) => void;
}
