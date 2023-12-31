import React from "react";
import { classnames } from "src/utils/classnames.ts";

export interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    Omit<React.HTMLProps<HTMLButtonElement>, "type"> {
  children: React.ReactNode;
  width?: string;
  height?: string;
  variant?: "primary" | "secondary" | "tertiary";
  style?: React.CSSProperties;
  className?: string;
}

export const Button = React.forwardRef(function Button(
  {
    children,
    width = "auto",
    height = "40px",
    variant = "primary",
    style = {},
    className,
    ...buttonProps
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return (
    <button
      ref={ref}
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
