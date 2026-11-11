import { useRef, type ReactNode } from 'react';
import { StageGuides } from '../dev/StageGuides';
import { useStageScale } from './useStageScale';
import './Stage.css';

interface StageProps {
  children?: ReactNode;
  /** Development overlay: safe area outline, centre lines and scale readout. */
  showGuides?: boolean;
}

/**
 * The "TV screen". A fixed 1920 x 1080 box that is scaled with one transform
 * to fit the window and letterboxed, so everything inside can be laid out in
 * absolute TV pixels.
 */
export function Stage({ children, showGuides = false }: StageProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const scale = useStageScale(viewportRef, stageRef);

  return (
    <div ref={viewportRef} className="stage-viewport">
      <div
        ref={stageRef}
        className="stage"
        // translate centres the stage in the viewport, scale fits it.
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
      >
        {children}
        {showGuides && <StageGuides scale={scale} />}
      </div>
    </div>
  );
}
