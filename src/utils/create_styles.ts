export function createStyles<
  TProps,
  TInputStyles extends Record<
    string,
    React.CSSProperties & Record<string, string>
  >,
  TOutputStyles extends Record<string, React.CSSProperties>
>(styles: TInputStyles | ((props: TProps) => TInputStyles)) {
  const isFunction = typeof styles === "function";

  if (isFunction) {
    return styles as unknown as (props: TProps) => TOutputStyles;
  }

  return (_props: TProps) => {
    return styles as unknown as TOutputStyles;
  };
}
