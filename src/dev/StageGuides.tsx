import './StageGuides.css';

interface StageGuidesProps {
  scale: number;
}

/**
 * Development overlay drawn on top of the stage. Enable with ?guides in the URL.
 * Shows the safe area, the centre lines and the current scale factor.
 */
export function StageGuides({ scale }: StageGuidesProps) {
  return (
    <div className="guides" aria-hidden="true">
      <div className="guides__safe" />
      <div className="guides__line guides__line--vertical" />
      <div className="guides__line guides__line--horizontal" />
      <p className="guides__label">
        Stage 1920 x 1080 <span className="guides__value">scale {scale.toFixed(3)}</span>
      </p>
    </div>
  );
}
