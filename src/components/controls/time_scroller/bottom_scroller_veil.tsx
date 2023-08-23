export function BottomScrollerVeil() {
  return (
    <div
      style={{
        position: "absolute",
        top: "65px",
        left: "0",
        height: "34px",
        width: "100%",
        boxSizing: "border-box",
        borderTop: "1px solid black",
        backgroundColor: "rgba(255,255,255, 0.65)",
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(1px)",
        pointerEvents: "none",
      }}
    ></div>
  );
}
