import { PRICE_STACKED, PRICE_UNSTACKED } from "utils";
import { classNames } from "utils";

export const StakingRules = ({ isStakingDialog }: { isStakingDialog: boolean }) => {
  return (
    <div className="items-top flex flex-wrap gap-2 text-sm font-medium text-black2Color md:gap-4">
      <div className={classNames("mr-1 md:w-auto", isStakingDialog ? "" : "w-full")}>
        {isStakingDialog ? "Fees:" : "Fees for each:"}
      </div>
      <span className="inline-flex items-center gap-x-1 rounded-full ring-gray-200">
        <svg className="h-2 w-2 fill-yellowColor" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
        {PRICE_STACKED} SUI STAKE
      </span>
      <span className="inline-flex items-center gap-x-1 rounded-full ring-gray-200">
        <svg className="h-2 w-2 fill-purpleColor" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
        {PRICE_UNSTACKED} SUI UNSTAKE
      </span>
    </div>
  );
};
