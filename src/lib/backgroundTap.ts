// A click on a control belongs to that control; a background effect would
// compete with its feedback.
const CONTROLS =
  "a, button, nav, input, select, textarea, label, [role='button']";
const TAP_SLOP_PX = 10;
const TAP_MAX_MS = 500;

/**
 * Calls `onTap` with viewport coordinates for each click or tap that lands
 * outside a control. Returns the cleanup.
 */
export function listenForBackgroundTaps(onTap: (x: number, y: number) => void) {
  let press: { id: number; x: number; y: number; time: number } | null = null;

  // Pointer events, not `click`: iOS Safari fires no click for a tap on a
  // non-clickable element, and a window listener does not make it clickable.
  // A mouse taps on press; a touch waits for a still, short release, because a
  // swipe that starts on the background is a scroll and gets cancelled.
  const handlePointerDown = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest(CONTROLS)) {
      return;
    }
    if (event.pointerType !== "touch") {
      onTap(event.clientX, event.clientY);
      return;
    }
    press = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
    };
  };

  const handlePointerUp = (event: PointerEvent) => {
    if (!press || event.pointerId !== press.id) return;
    const moved = Math.hypot(event.clientX - press.x, event.clientY - press.y);
    const held = event.timeStamp - press.time;
    press = null;
    if (moved < TAP_SLOP_PX && held < TAP_MAX_MS) {
      onTap(event.clientX, event.clientY);
    }
  };

  const handlePointerCancel = () => {
    press = null;
  };

  const passive = { passive: true };
  window.addEventListener("pointerdown", handlePointerDown, passive);
  window.addEventListener("pointerup", handlePointerUp, passive);
  window.addEventListener("pointercancel", handlePointerCancel, passive);

  return () => {
    window.removeEventListener("pointerdown", handlePointerDown);
    window.removeEventListener("pointerup", handlePointerUp);
    window.removeEventListener("pointercancel", handlePointerCancel);
  };
}
