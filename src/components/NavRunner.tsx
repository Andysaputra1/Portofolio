import { useId } from 'react';
import runSprite from '../images/andy-nav-run.png';

/** Remove the atlas's dark matte at render time, retaining the pixel outline. */
export default function NavRunner() {
  const maskId = useId();
  return (
    <svg className="nav-pixel-runner" viewBox="0 0 887 887" aria-hidden="true" focusable="false">
      <defs>
        <filter id={maskId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          {/* The matte is RGB 11–16; the colored character starts above it. */}
          <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  .2126 .7152 .0722 0 0" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="255" intercept="-18" />
          </feComponentTransfer>
          {/* Recover the thin black pixel outlines surrounding colored areas. */}
          <feMorphology operator="dilate" radius="7" result="characterMask" />
          <feComposite in="SourceGraphic" in2="characterMask" operator="in" />
        </filter>
      </defs>
      <image className="nav-run-frames" href={runSprite} width="1774" height="887" filter={`url(#${maskId})`} />
    </svg>
  );
}
