export type DispatchTrack = {
  trackId: string;
  storagePath: string;
  title?: string;
  artist?: string;
};

type DispatchPayload = {
  queue: DispatchTrack[];
  startIndex?: number;
  autoplay?: boolean;
};

export function dispatchPlayerQueue(payload: DispatchPayload) {
  window.dispatchEvent(
    new CustomEvent("symphira:setQueue", {
      detail: {
        queue: payload.queue,
        startIndex: payload.startIndex ?? 0,
        autoplay: payload.autoplay ?? true,
      },
    })
  );
}
