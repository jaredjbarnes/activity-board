import React from 'react';
import { createHorizontalResizeHandler } from './resize_handlers';
const rightResizeHandleStyle: React.CSSProperties = {
  position: 'absolute',
  top: '0px',
  right: '-5px',
  height: '100%',
  width: '10px',
  cursor: 'ew-resize',
};
export interface RightResizeHandleProps {
  targetRef: React.MutableRefObject<HTMLElement | null>;
}
export function RightResizeHandle({ targetRef }: RightResizeHandleProps) {
  const resizeHandler = createHorizontalResizeHandler(targetRef);
  return <div onMouseDown={resizeHandler} style={rightResizeHandleStyle}></div>;
}
