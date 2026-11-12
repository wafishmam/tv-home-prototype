import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { useNavigation } from '../navigation/FocusContext';
import type { NavAction } from '../navigation/focusStore';
import { tokenMs } from '../styles/tokens';
import './TouchPad.css';

/**
 * An on-screen remote for touch devices: direction pad, OK and Back.
 *
 * It sends the same actions through the same dispatch function as the
 * keyboard, so nothing else in the app knows or cares which one was used.
 * It is rendered outside the scaled stage, at real screen size, so the
 * buttons stay finger sized however small the stage gets.
 */
export function TouchPad() {
  return (
    <div className="touch-pad" role="group" aria-label="Remote control">
      <div className="touch-pad__dpad">
        <PadButton action="up" label="Up" className="touch-pad__up" repeat>
          <Arrow rotate={0} />
        </PadButton>
        <PadButton action="left" label="Left" className="touch-pad__left" repeat>
          <Arrow rotate={-90} />
        </PadButton>
        <PadButton action="right" label="Right" className="touch-pad__right" repeat>
          <Arrow rotate={90} />
        </PadButton>
        <PadButton action="down" label="Down" className="touch-pad__down" repeat>
          <Arrow rotate={180} />
        </PadButton>
      </div>
      <div className="touch-pad__actions">
        <PadButton action="back" label="Back" className="touch-pad__back">
          Back
        </PadButton>
        <PadButton action="select" label="OK" className="touch-pad__ok">
          OK
        </PadButton>
      </div>
    </div>
  );
}

interface PadButtonProps {
  action: NavAction;
  label: string;
  className: string;
  /** Keep firing while held, like a held arrow key. */
  repeat?: boolean;
  children: ReactNode;
}

function PadButton({ action, label, className, repeat = false, children }: PadButtonProps) {
  const navigation = useNavigation();
  const timers = useRef<{ delay?: number; interval?: number }>({});

  const stop = () => {
    window.clearTimeout(timers.current.delay);
    window.clearInterval(timers.current.interval);
  };
  // Never leave a repeat running if the button goes away mid-press.
  useEffect(() => stop, []);

  const start = (event: PointerEvent<HTMLButtonElement>) => {
    // Act on press, not on release: it feels immediate, like a real remote.
    event.preventDefault();
    navigation.dispatch(action);
    if (!repeat) return;

    stop();
    timers.current.delay = window.setTimeout(() => {
      timers.current.interval = window.setInterval(
        () => navigation.dispatch(action),
        tokenMs('--nav-repeat-interval'),
      );
    }, tokenMs('--touch-repeat-delay'));
  };

  return (
    <button
      type="button"
      className={`touch-pad__button ${className}`}
      aria-label={label}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerCancel={stop}
      onPointerLeave={stop}
      // A long press must not open the browser's context menu.
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
}

function Arrow({ rotate }: { rotate: number }) {
  return (
    <svg className="touch-pad__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 6 L19 16 H5 Z" transform={`rotate(${rotate} 12 12)`} />
    </svg>
  );
}
