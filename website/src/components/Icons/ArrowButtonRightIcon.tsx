export const ArrowButtonIconRight = ({ disabled }: { disabled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M7.5 4.16669L12.5 10L7.5 15.8334"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={disabled ? "stroke-grayColor" : "stroke-blackColor"}
    />
  </svg>
);
