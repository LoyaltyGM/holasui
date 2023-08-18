import Image from "next/image";
import { classNames, formatNumber } from "utils";
import frensLogo from "/public/img/frens-logo.svg";
import mockup_image from "/public/img/mockup1.png";
import iconTicketStar from "/public/img/IconTicketStar.svg";
import cn from "classnames";
import { Button } from "components";
import { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";

// TODO: total hola points and completed quests logic
export const SpaceInfoBanner = ({ totalHolaPointsOnchain }: { totalHolaPointsOnchain: number }) => {
  const CompanyImage = () => (
    <div className="flex h-[150px] w-[150px] items-center md:ml-7">
      <Image src={mockup_image} alt={"logo"} height={150} width={150} className="rounded-xl" />
    </div>
  );

  const CompanyInfo = ({ className }: { className?: string }) => (
    <div className={cn(className)}>
      <p className={classNames("text-2xl font-extrabold text-blackColor md:text-3xl")}>SuiFrens</p>
      <p className={classNames("mt-2 font-medium text-black2Color")}>
        Each staked frens will earn 1 point per minute
      </p>
    </div>
  );

  const NewQuestDropdown = ({ className }: { className?: string }) => {
    const [dropDownOpened, setDropDownOpened] = useState(false);
    const ArrowIcon = ({ className }: { className?: string }) => (
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
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          className={cn("stroke-blackColor", className)}
        />
      </svg>
    );
    return (
      <div className={cn("relative text-center", className)}>
        <Button
          btnType="button"
          variant="button-secondary-puprle"
          size="sm-full"
          className="group flex items-center justify-center gap-1"
          onClick={() => setDropDownOpened(!dropDownOpened)}
        >
          Add new quest
          <ArrowIcon
            className={
              "transition-all duration-200 group-hover:stroke-purpleColorHover group-active:stroke-blackColor"
            }
          />
        </Button>
        <Transition
          show={dropDownOpened}
          as={Fragment}
          enter="transition ease-out duration-50"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="dropdown-shadow absolute mt-[10px] min-h-[96px] w-full rounded-xl border-2 border-purpleColor bg-white text-center hover:border-purpleColor">
            <Button
              variant="button-secondary-puprle"
              size="full"
              className="flex items-center justify-center border-none bg-transparent md:justify-start"
            >
              Add new quest
            </Button>
            <Button
              variant="button-secondary-puprle"
              size="full"
              href="#"
              className="flex items-center justify-center border-none bg-transparent md:justify-start"
            >
              Add new journey
            </Button>
          </div>
        </Transition>
      </div>
    );
  };

  const InfoPlates = () => (
    <div className="flex h-full flex-col items-center gap-[10px] lg:flex-row lg:gap-4">
      <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-yellowColor px-3 py-4 text-start text-white lg:mt-0 lg:flex-col lg:items-start">
        <p className="justify-between text-[18px] font-semibold leading-[22px] md:mt-0">
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
          <p className="text-[26px] font-extrabold leading-8 md:text-3xl">
            {totalHolaPointsOnchain ? formatNumber(2345) : 0}
          </p>
        </div>
      </div>
      <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-pinkColor px-3 py-4 text-start text-white lg:mt-0 lg:h-full lg:flex-col lg:items-start">
        <p className={classNames("text-[18px] font-semibold leading-[22px]")}>Completed quests</p>
        {/* FIXME: Completed quests logic */}
        <p className={classNames("text-[26px] font-extrabold leading-8 md:text-3xl")}>
          4<span className="text-[22px] font-medium">/20</span>
        </p>
      </div>
    </div>
  );
  return (
    <div className="flex max-h-[547px] flex-col rounded-xl border-[1px] border-black2Color bg-[#FFFFFF] px-3 pb-6 pt-4 md:flex md:h-[483px] md:p-[25px] md:pt-[30px] lg:h-[365px]">
      <div className="flex flex-col items-center gap-8 rounded-2xl md:flex-row md:items-start md:gap-12">
        <div className="flex w-full flex-1 lg:justify-between">
          <div className="flex flex-1 flex-col items-center gap-8 md:flex-row md:items-start">
            <CompanyImage />
            <CompanyInfo className="w-full md:w-auto" />
          </div>
          <NewQuestDropdown className="hidden lg:block" />
        </div>
      </div>
      <div className="mt-4 w-full flex-1 md:mt-[30px]">
        <InfoPlates />
      </div>
      <NewQuestDropdown className="mx-auto mt-[30px] w-full text-center md:mt-5 md:w-max lg:hidden" />
    </div>
  );
};
