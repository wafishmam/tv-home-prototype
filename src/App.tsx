import { MotionConfig } from 'motion/react';
import { Home } from './components/Home';
import { FeedMonitor } from './dev/FeedMonitor';
import { devFlags } from './dev/flags';
import { PosterSheet } from './dev/PosterSheet';
import { TokenSpecimen } from './dev/TokenSpecimen';
import { Stage } from './stage/Stage';

export function App() {
  if (devFlags.tokens) return <TokenSpecimen />;
  if (devFlags.posters) return <PosterSheet />;
  if (devFlags.feed) return <FeedMonitor />;

  return (
    // reducedMotion="user": when the system asks for reduced motion, the motion
    // library drops movement and keeps fades.
    <MotionConfig reducedMotion="user">
      <Stage showGuides={devFlags.guides}>
        <Home />
      </Stage>
    </MotionConfig>
  );
}
