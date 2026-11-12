import { MotionConfig } from 'motion/react';
import { Home } from './components/Home';
import { homeInitialRowId, homeRows } from './components/homeRows';
import { FeedMonitor } from './dev/FeedMonitor';
import { devFlags } from './dev/flags';
import { PosterSheet } from './dev/PosterSheet';
import { TokenSpecimen } from './dev/TokenSpecimen';
import { FocusProvider } from './navigation/FocusContext';
import { Stage } from './stage/Stage';
import { TouchPad } from './touch/TouchPad';
import { useIsTouch } from './touch/useIsTouch';

export function App() {
  const touch = useIsTouch();

  if (devFlags.tokens) return <TokenSpecimen />;
  if (devFlags.posters) return <PosterSheet />;
  if (devFlags.feed) return <FeedMonitor />;

  return (
    // reducedMotion="user": when the system asks for reduced motion, the motion
    // library drops movement and keeps fades.
    <MotionConfig reducedMotion="user">
      {/* The focus provider wraps both the stage and the touch pad: the pad
          sits outside the scaled stage but drives the same navigation. */}
      <FocusProvider rows={homeRows} initialRowId={homeInitialRowId}>
        <div className="shell" data-touch={touch}>
          <Stage showGuides={devFlags.guides}>
            <Home />
          </Stage>
          {touch && <TouchPad />}
        </div>
      </FocusProvider>
    </MotionConfig>
  );
}
