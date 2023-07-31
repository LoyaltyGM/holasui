import React, { FC } from "react";
import cn from "classnames";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: FC<ContainerProps> = ({ children, className }): React.ReactNode => (
  <main
    className={cn(
      "z-10 mt-[100px] flex min-h-[85vh] flex-col rounded-lg bg-basicColor px-4 md:mt-[130px] md:px-10 lg:mt-40 lg:px-16 xl:px-[152px]",
      className,
    )}
  >
    {children}
  </main>
);