export function TopScrollerVeil() {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        height: "31px",
        width: "100%",
        boxSizing: "border-box",
        borderBottom: "1px solid black",
        backgroundColor: "rgba(255,255,255, 0.65)",
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(1px)",
        pointerEvents: "none",
      }}
    ></div>
  );
}
