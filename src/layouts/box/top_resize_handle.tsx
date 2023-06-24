import React from 'react';
import { createVerticalResizeHandler } from './resize_handlers.ts';
const topResizeHandleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '-5px',
  left: '0px',
  height: '10px',
  width: '100%',
  cursor: 'ns-resize',
};
export interface TopResizeHandleProps {
  targetRef: React.MutableRefObject<HTMLElement | null>;
}
export function TopResizeHandle({ targetRef }: TopResizeHandleProps) {
  const resizeHandler = createVerticalResizeHandler(targetRef, true);
  return <div onMouseDown={resizeHandler} style={topResizeHandleStyle}></div>;
}
