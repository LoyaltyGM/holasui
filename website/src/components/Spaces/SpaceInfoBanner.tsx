import Image from "next/image";
import { classNames, formatNumber } from "utils";
import frensLogo from "/public/img/frens-logo.svg";
import iconTicketStar from "/public/img/IconTicketStar.svg";
import cn from "classnames";

// TODO: total hola points and completed quests logic
export const SpaceInfoBanner = ({ totalHolaPointsOnchain }: { totalHolaPointsOnchain: number }) => {
  const AddNewQuestBtn = ({ className }: { className?: string }) => (
    <button
      className={cn("button-secondary-purple button-shadow button-shadow:active w-full", className)}
    >
      Add new quest
    </button>
  );
  return (
    <div className="flex max-h-[547px] flex-col rounded-xl border-[1px] border-black2Color bg-[#FFFFFF] px-3 pb-6 pt-4 md:flex md:h-[483px] md:p-[25px] md:pt-[30px] lg:h-[365px]">
      <div className="flex flex-col items-center gap-8 rounded-2xl md:flex-row md:items-start md:gap-12">
        <div className="flex h-[150px] w-[150px] items-center md:ml-7">
          <Image src={frensLogo} alt={"logo"} height={150} width={150} />
        </div>
        <div className="flex w-full flex-1 items-start justify-between">
          <div>
            <p className={classNames("text-2xl font-extrabold text-blackColor md:text-3xl")}>
              SuiFrens
            </p>
            <p className={classNames("mt-2 font-medium text-black2Color")}>
              Each staked frens will earn 1 point per minute
            </p>
          </div>
          <AddNewQuestBtn className="hidden lg:block" />
        </div>
      </div>
      <div className="mt-4 w-full flex-1 md:mt-[30px]">
        <div className="flex h-full flex-col items-center gap-[10px] lg:flex-row lg:gap-4">
          <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-yellowColor px-3 py-4 text-start text-white lg:mt-0 lg:flex-col lg:items-start">
            <p
              className={classNames(
                "justify-between text-[18px] font-semibold leading-[22px] md:mt-0",
              )}
            >
              Your Available Hola Points
            </p>
            <div className="flex content-center items-center gap-2 lg:w-full">
              <Image
                src={iconTicketStar}
                alt={"ticketLogo"}
                height={28}
                width={28}
                className="min-h-[28px] min-w-[28px]"
              />
              <p className={classNames("text-[26px] font-extrabold leading-8 md:text-3xl")}>
                {totalHolaPointsOnchain ? formatNumber(2345) : 0}
              </p>
            </div>
          </div>
          <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-pinkColor px-3 py-4 text-start text-white lg:mt-0 lg:h-full lg:flex-col lg:items-start">
            <p className={classNames("text-[18px] font-semibold leading-[22px]")}>
              Completed quests
            </p>
            {/* FIXME: Completed quests logic */}
            <p className={classNames("text-[26px] font-extrabold leading-8 md:text-3xl")}>
              4<span className="text-[22px] font-medium">/20</span>
            </p>
          </div>
        </div>
      </div>
      <AddNewQuestBtn className="mx-auto mt-[30px] text-center md:mt-5 lg:hidden" />
    </div>
  );
};
