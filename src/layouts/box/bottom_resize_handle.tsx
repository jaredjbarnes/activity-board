import React from 'react';
import { createVerticalResizeHandler } from './resize_handlers.ts';
const bottomResizeHandleStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: '-5px',
  left: '0px',
  height: '10px',
  width: '100%',
  zIndex: 1,
  cursor: 'ns-resize',
};
export interface BottomResizeHandleProps {
  targetRef: React.MutableRefObject<HTMLElement | null>;
}
export function BottomResizeHandle({ targetRef }: BottomResizeHandleProps) {
  const resizeHandler = createVerticalResizeHandler(targetRef);
  return <div onMouseDown={resizeHandler} style={bottomResizeHandleStyle}></div>;
}
