import cn from "classnames";

export const ArrowDropdownIcon = ({
  className,
  dropDownOpened,
}: {
  className?: string;
  dropDownOpened: boolean;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="20"
    viewBox="0 0 21 20"
    fill="none"
    className={cn({ "rotate-180": !dropDownOpened })}
  >
    <path
      d="M16.3335 12.5L10.5002 7.5L4.66683 12.5"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("stroke-blackColor", className)}
    />
  </svg>
);
