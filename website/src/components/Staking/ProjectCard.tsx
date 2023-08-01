import Image from "next/image";
import { classNames, formatNumber } from "utils";
import { IProjectCard } from "types";
import frensLogo from "/public/img/frens-logo.svg";
import iconTicketStar from "/public/img/IconTicketStar.svg";

export const ProjectCard = ({
  totalStaked,
  setOpenRules,
  stakedList,
  totalHolaPointsOnchain,
  availablePointsToClaim,
  claimPointsFunction,
}: IProjectCard) => {
  // TODO: BUTTON FOR CLAIM POINT ADD LATER TO YOUR POINTS CARD
  //   const button = {stakedList !== null && stakedList?.length !== 0 && availablePointsToClaim > 0 && (
  //     <button
  //       className="text-sm underline"
  //       onClick={() => claimPointsFunction(stakedList.map((ticket) => ticket.id))}
  //     >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
  //   )}
  // </div>
  // {/* TODO: rewrite this part */}
  // {/* //this claim is available only on desktop */}
  // <div className="flex text-left text-xs underline md:hidden ">
  //   {stakedList?.length && availablePointsToClaim ? (
  //     <button
  //       className="underline"
  //       onClick={() => claimPointsFunction(stakedList?.map((ticket) => ticket.id))}
  //     >{`Claim ${formatNumber(availablePointsToClaim)} `}</button>
  //   ) : (
  //     <button></button>
  //   )}
  return (
    <div className="mb-10 flex max-h-[547px] flex-col rounded-xl border-[1px] border-black2Color bg-[#FFFFFF] px-3 pb-6 pt-4 md:flex md:h-[483px] md:p-[25px] md:pt-[30px] lg:mb-[50px] lg:h-[365px] xl:mb-[70px]">
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
          <button
            onClick={() => setOpenRules(true)}
            className={classNames(
              "text-md font-medium text-black2Color underline hover:no-underline",
            )}
          >
            FAQs
          </button>
        </div>
      </div>
      <div className="mt-4 w-full flex-1 md:mt-[30px]">
        <div className="flex h-full flex-col gap-[10px] lg:flex-row lg:gap-4">
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
                {totalHolaPointsOnchain ? formatNumber(totalHolaPointsOnchain) : 0}
              </p>
            </div>
          </div>
          <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-orangeColor px-3 py-4 text-start text-white lg:mt-0 lg:h-full lg:flex-col lg:items-start">
            <p className={classNames("text-[18px] font-semibold leading-[22px]")}>
              You Total Staked
            </p>
            <p className={classNames("text-[26px] font-extrabold leading-8 md:text-3xl")}>
              {stakedList?.length ? stakedList.length : 0}
            </p>
          </div>
          <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-[#5A5A95] px-3 py-4 text-start text-white lg:mt-0 lg:h-full lg:flex-col lg:items-start">
            <p className={classNames("text-[18px] font-semibold leading-[22px]")}>Total Staked</p>
            <p className={classNames("text-[26px] font-extrabold leading-8 md:text-3xl")}>
              {totalStaked ? totalStaked : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
