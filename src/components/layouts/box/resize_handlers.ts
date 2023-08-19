export function createHorizontalResizeHandler(
  targetRef: React.MutableRefObject<HTMLElement | null>,
  invert = false
) {
  const direction = invert ? -1 : 1;
  return function startHorizontalResize(event: React.MouseEvent) {
    const box = targetRef.current;
    if (box == null) {
      return;
    }
    const startX = event.clientX;
    const startRect = box.getBoundingClientRect();
    const drag = (event: MouseEvent) => {
      const deltaX = direction * (event.clientX - startX);
      const newWidth = startRect.width + deltaX;
      box.style.width = `${newWidth}px`;
      event.stopPropagation();
      event.preventDefault();
    };
    const endDrag = () => {
      document.body.removeEventListener('mousemove', drag);
      document.body.removeEventListener('mouseup', endDrag);
      document.body.removeEventListener('mouseleave', endDrag);
      event.stopPropagation();
      event.preventDefault();
    };
    document.body.addEventListener('mousemove', drag);
    document.body.addEventListener('mouseup', endDrag);
    document.body.addEventListener('mouseleave', endDrag);
    event.stopPropagation();
    event.preventDefault();
  };
}
export function createVerticalResizeHandler(
  targetRef: React.MutableRefObject<HTMLElement | null>,
  invert = false
) {
  const direction = invert ? -1 : 1;
  return function startVerticalResize(event: React.MouseEvent) {
    const box = targetRef.current;
    if (box == null) {
      return;
    }
    const startY = event.clientY;
    const startRect = box.getBoundingClientRect();
    const drag = (event: MouseEvent) => {
      const deltaY = direction * (event.clientY - startY);
      const newHeight = startRect.height + deltaY;
      box.style.height = `${newHeight}px`;
      event.stopPropagation();
      event.preventDefault();
    };
    const endDrag = () => {
      document.body.removeEventListener('mousemove', drag);
      document.body.removeEventListener('mouseup', endDrag);
      document.body.removeEventListener('mouseleave', endDrag);
      event.stopPropagation();
      event.preventDefault();
    };
    document.body.addEventListener('mousemove', drag);
    document.body.addEventListener('mouseup', endDrag);
    document.body.addEventListener('mouseleave', endDrag);
    event.stopPropagation();
    event.preventDefault();
  };
}
