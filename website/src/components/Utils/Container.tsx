import React, { FC } from "react";
import cn from "classnames";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: FC<ContainerProps> = ({ children, className }): React.ReactNode => (
  <div className="z-10 flex justify-center font-inter">
    <main
      className={cn(
        "mt-[100px] flex min-h-[85vh] max-w-[120rem] flex-1 flex-col bg-basicColor px-4 md:mt-[116px] md:px-10 lg:mt-[146px] lg:px-16 xl:mt-40 xl:px-[152px]",
        className,
      )}
    >
      {children}
    </main>
  </div>
);
