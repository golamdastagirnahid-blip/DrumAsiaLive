/**
 * lib/time-loop.ts — a SINGLE shared requestAnimationFrame loop for the whole
 * site (SECTION 2.1). Consumers subscribe; the loop starts lazily and pauses
 * itself on `document.hidden` so nothing burns frames in a background tab.
 */

type FrameCallback = (nowPerfMs: number) => void;

const callbacks = new Set<FrameCallback>();
let rafId = 0;
let running = false;

function frame(now: number) {
  for (const cb of callbacks) cb(now);
  if (running) rafId = requestAnimationFrame(frame);
}

function start() {
  if (running || typeof requestAnimationFrame === "undefined") return;
  running = true;
  rafId = requestAnimationFrame(frame);
}

function stop() {
  running = false;
  if (rafId) cancelAnimationFrame(rafId);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else if (callbacks.size > 0) start();
  });
}

/** Subscribe to the shared loop. Returns an unsubscribe function. */
export function subscribeLoop(cb: FrameCallback): () => void {
  callbacks.add(cb);
  start();
  return () => {
    callbacks.delete(cb);
    if (callbacks.size === 0) stop();
  };
}
