import React from "react";
import { ILayoutProps } from "types";
import { Header } from "components";
import { useJourneyStore } from "store";

export function Sidebar({ children }: ILayoutProps) {
  const { bgColor } = useJourneyStore();

  return (
    <>
      <div className="mt-4">
        <Header />
        <div className="flex flex-1 flex-col">
          <main className={`h-full flex-1 bg-${bgColor}`}>{children}</main>
        </div>
      </div>
    </>
  );
}
