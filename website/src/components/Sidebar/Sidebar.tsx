import React from "react";
import { ILayoutProps } from "types";
import { Header } from "components";

export function Sidebar({ children }: ILayoutProps) {
  return (
    <>
      <div className="mt-4">
        <Header />
        <div className="flex flex-1 flex-col">
          <main className="h-full flex-1 bg-basicColor">{children}</main>
        </div>
      </div>
    </>
  );
}
