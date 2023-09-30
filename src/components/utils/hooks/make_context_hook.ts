import React from "react";

export type NonUndefined<T> = T extends undefined ? never : T;

const makeContextHook = <T>(context: React.Context<T>) => {
  return () => {
    const contextValue = React.useContext(context);
    if (contextValue === undefined) {
      throw new Error("Context must be used within a Context Provider!");
    }
    return contextValue as NonUndefined<T>;
  };
};
export { makeContextHook };
