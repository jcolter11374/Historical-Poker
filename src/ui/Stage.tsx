/**
 * Every screen is laid out on a fixed 1600 x 900 stage (the shape of the art)
 * and scaled to fit the window, with dark bars where the window is a
 * different shape. Positions in chapter files are stage pixels.
 */
import { useEffect, useState, type ReactNode } from 'react';

export const STAGE_W = 1600;
export const STAGE_H = 900;

export function Stage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H));
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return (
    <div className="viewport">
      <div className="stage" style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})` }}>
        {children}
      </div>
    </div>
  );
}
