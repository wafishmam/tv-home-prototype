import { useId } from 'react';
import './TopBar.css';

/** The strip across the top: brand mark on the left, controls on the right (later). */
export function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <BrandMark />
        <span className="topbar__wordmark">Nightjar</span>
      </div>
    </header>
  );
}

/** A crescent with one coral "eye". The crescent is a disc with a bite masked out. */
function BrandMark() {
  const maskId = useId();
  return (
    <svg className="topbar__mark" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <mask id={maskId}>
        <rect width="48" height="48" fill="#fff" />
        <circle cx="30" cy="19" r="15" fill="#000" />
      </mask>
      <circle className="topbar__mark-moon" cx="22" cy="24" r="18" mask={`url(#${maskId})`} />
      <circle className="topbar__mark-eye" cx="33" cy="21" r="5" />
    </svg>
  );
}
