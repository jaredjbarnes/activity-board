export function PopoverVeil({
  onClick,
  style,
}: {
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  return (
    <div
      onClick={(e) => {
        onClick();
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{
        backgroundColor: "rgba(0,0,0,0.05)",
        position: "absolute",
        inset: 0,
        opacity: 1,
        ...style,
      }}
    ></div>
  );
}
