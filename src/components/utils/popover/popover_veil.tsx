export function PopoverVeil({ onClick }: { onClick: () => void }) {
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
      }}
    ></div>
  );
}
