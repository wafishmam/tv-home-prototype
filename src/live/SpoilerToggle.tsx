import { useFocusable } from '../navigation/useFocusable';
import { toggleSpoilerFree, useSpoilerFree } from './spoilers';
import './SpoilerToggle.css';

/** The focus row the toggle lives in. The home screen lists it above the rails. */
export const TOPBAR_ROW = 'topbar';

/** The spoiler free switch in the top bar. It is a focusable item like any card. */
export function SpoilerToggle() {
  const enabled = useSpoilerFree();
  const { props } = useFocusable<HTMLDivElement>({ rowId: TOPBAR_ROW, index: 0, onSelect: toggleSpoilerFree });

  return (
    <div className="spoiler-toggle" role="switch" aria-checked={enabled} aria-label="Spoiler free mode" {...props}>
      <span className="spoiler-toggle__label">Spoiler free</span>
      <span className="spoiler-toggle__track" data-on={enabled}>
        <span className="spoiler-toggle__knob" />
      </span>
      <span className="spoiler-toggle__state">{enabled ? 'On' : 'Off'}</span>
    </div>
  );
}
