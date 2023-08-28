import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import cn from "classnames";
import { ReactNode } from "react";

export const Label = ({
  label,
  textSize = "text-lg",
  className,
}: {
  label: string;
  textSize?: string;
  className?: string;
}) => (
  <label className="label">
    <p className={cn("font-semibold", className, textSize)}>{label}</p>
  </label>
);
export const LabeledInput = ({
  label,
  children,
  className,
}: {
  label?: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    {label && <Label label={label} className="mb-[14px]" />}
    <div>{children}</div>
  </div>
);
