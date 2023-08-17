import React from "react";
import { classnames } from "src/classnames.ts";

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  width?: string;
  height?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  style?: React.CSSProperties;
  className?: string;
}

export const Button = React.forwardRef(function Button({
  width = "auto",
  height = "40px",
  variant = "primary",
  children,
  style = {},
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      style={{
        ...style,
        display: "inline-grid",
        placeItems: "center center",
        padding: "0 16px",
        borderRadius: "20px",
        userSelect: "none",
        width,
        height,
      }}
      className={classnames(className, variant, "no-select")}
      {...buttonProps}
    >
      {children}
    </button>
  );
});
