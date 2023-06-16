import React from 'react';
import { createHorizontalResizeHandler } from './resize_handlers';
const leftResizeHandleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0px',
  left: '-5px',
  height: '100%',
  width: '10px',
  cursor: 'ew-resize',
};
export interface LeftResizeHandleProps {
  targetRef: React.MutableRefObject<HTMLElement | null>;
}
export function LeftResizeHandle({ targetRef }: LeftResizeHandleProps) {
  const resizeHandler = createHorizontalResizeHandler(targetRef, true);
  return <div onMouseDown={resizeHandler} style={leftResizeHandleStyle}></div>;
}
