import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import { ReactNode } from "react";

export const Label = ({ label, className }: { label: string; className?: string }) => (
  <label className="label">
    <p className={classNames("text-lg font-semibold", className)}>{label}</p>
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
  <div>
    {label && <Label label={label} className="mb-[14px]" />}
    <div>{children}</div>
  </div>
);
