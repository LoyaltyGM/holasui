import Image from "next/image";
import { classNames, formatNumber } from "utils";
import Link from "next/link";
import cn from "classnames";
import { Button } from "components";
import { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { ISpace } from "types";

// TODO: total hola points and completed quests logic
export const SpaceInfoBanner = ({
  spaceAddress,
  space,
  isAdmin,
}: {
  spaceAddress: string;
  space: ISpace;
  isAdmin: boolean;
}) => {
  const CompanyImage = () => (
    <div className="relative flex min-h-[150px] min-w-[150px] items-center md:ml-4 xl:min-h-[160px] xl:min-w-[160px]">
      <Image src={space.image_url} alt={"logo"} fill className="rounded-xl object-cover" />
    </div>
  );

  const CompanyInfo = ({ className }: { className?: string }) => {
    const EditSpaceBtn = () => {
      return (
        <Link href={`/spaces/${spaceAddress}/edit-company`} className="group">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="28"
            viewBox="0 0 26 28"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.7185 11.0248C13.0753 10.0761 10.9742 10.6391 10.0255 12.2822C9.07682 13.9254 9.63982 16.0266 11.283 16.9753C12.9262 17.924 15.0273 17.361 15.976 15.7178C16.9247 14.0746 16.3617 11.9735 14.7185 11.0248ZM11.2156 12.9694C11.7848 11.9834 13.0455 11.6456 14.0314 12.2149C15.0173 12.7841 15.3551 14.0448 14.7859 15.0307C14.2167 16.0166 12.956 16.3544 11.9701 15.7852C10.9842 15.2159 10.6464 13.9553 11.2156 12.9694Z"
              className="fill-blackColor group-hover:fill-purpleColorHover group-active:fill-blackColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M17.905 5.45937C17.5524 5.25577 17.258 5.0858 17.0068 4.96276C16.7453 4.83467 16.4863 4.73447 16.2008 4.69689C15.5383 4.60967 14.8683 4.78919 14.3382 5.19596C14.0622 5.40772 13.8617 5.68301 13.6657 5.99496C13.5081 6.24571 13.2553 6.38487 13.0008 6.38487C12.7463 6.38487 12.4935 6.24571 12.336 5.99496C12.14 5.68301 11.9394 5.40771 11.6634 5.19595C11.1333 4.78918 10.4633 4.60966 9.80086 4.69688C9.51537 4.73446 9.25636 4.83466 8.99486 4.96275C8.74366 5.08579 8.44928 5.25576 8.09664 5.45936L8.05657 5.4825C7.70393 5.68609 7.40955 5.85604 7.17739 6.01207C6.93571 6.17449 6.71943 6.3487 6.54414 6.57715C6.13737 7.10725 5.95785 7.77723 6.04507 8.4397C6.09047 8.78454 6.22856 9.09585 6.40068 9.42151C6.5391 9.68341 6.53321 9.97199 6.40591 10.1924C6.27863 10.4129 6.03167 10.5622 5.73569 10.5733C5.36756 10.5871 5.02887 10.6231 4.7075 10.7563C4.09018 11.012 3.59972 11.5024 3.34402 12.1197C3.23382 12.3858 3.19109 12.6602 3.17127 12.9507C3.15223 13.2298 3.15223 13.5697 3.15224 13.9768L3.15224 14.0231C3.15223 14.4303 3.15223 14.7703 3.17127 15.0493C3.19109 15.3398 3.23382 15.6142 3.34402 15.8803C3.59972 16.4976 4.09018 16.9881 4.7075 17.2438C5.02886 17.3769 5.36754 17.4129 5.73567 17.4267C6.03165 17.4378 6.27859 17.5871 6.40587 17.8076C6.53313 18.028 6.53902 18.3166 6.40062 18.5784C6.22848 18.9041 6.09036 19.2154 6.04496 19.5603C5.95774 20.2228 6.13726 20.8928 6.54403 21.4229C6.71932 21.6513 6.9356 21.8255 7.17728 21.9879C7.40944 22.144 7.70382 22.3139 8.05646 22.5175L8.09654 22.5406C8.44917 22.7442 8.74355 22.9142 8.99475 23.0373C9.25625 23.1653 9.51526 23.2655 9.80075 23.3031C10.4632 23.3903 11.1332 23.2108 11.6633 22.8041C11.9393 22.5923 12.1399 22.317 12.3359 22.005C12.4934 21.7543 12.7462 21.6151 13.0007 21.6151C13.2553 21.6151 13.5081 21.7542 13.6657 22.005C13.8617 22.3169 14.0622 22.5922 14.3382 22.804C14.8683 23.2107 15.5383 23.3902 16.2007 23.303C16.4862 23.2654 16.7452 23.1652 17.0067 23.0372C17.2579 22.9141 17.5523 22.7442 17.9049 22.5406L17.945 22.5174C18.2976 22.3139 18.5921 22.1439 18.8242 21.9878C19.0659 21.8254 19.2822 21.6512 19.4575 21.4228C19.8642 20.8927 20.0437 20.2227 19.9565 19.5602C19.9111 19.2154 19.773 18.904 19.6009 18.5783C19.4625 18.3165 19.4684 18.0279 19.5956 17.8075C19.7229 17.5871 19.9698 17.4378 20.2658 17.4267C20.6339 17.4129 20.9726 17.3769 21.294 17.2438C21.9113 16.9881 22.4018 16.4976 22.6575 15.8803C22.7677 15.6142 22.8104 15.3398 22.8303 15.0493C22.8493 14.7703 22.8493 14.4304 22.8493 14.0232L22.8493 13.9769C22.8493 13.5697 22.8493 13.2298 22.8303 12.9507C22.8104 12.6602 22.7677 12.3858 22.6575 12.1197C22.4018 11.5024 21.9113 11.012 21.294 10.7563C20.9727 10.6231 20.634 10.5871 20.2659 10.5733C19.9699 10.5622 19.7229 10.4129 19.5957 10.1924C19.4684 9.97201 19.4625 9.68346 19.6009 9.4216C19.773 9.09591 19.9112 8.78458 19.9566 8.43971C20.0438 7.77724 19.8643 7.10726 19.4575 6.57716C19.2822 6.3487 19.0659 6.17449 18.8242 6.01207C18.5921 5.85605 18.2977 5.68609 17.9451 5.4825L17.905 5.45937ZM16.0214 6.05934C16.0973 6.06933 16.2038 6.09963 16.4023 6.19687C16.6063 6.29683 16.8601 6.44291 17.2379 6.66104C17.6157 6.87917 17.8691 7.02589 18.0577 7.15264C18.2412 7.27595 18.3207 7.35303 18.3673 7.41372C18.5522 7.65468 18.6338 7.95922 18.5941 8.26034C18.5816 8.35532 18.5389 8.49002 18.386 8.77946C18.0465 9.42171 18.0215 10.2144 18.4056 10.8795C18.7896 11.5447 19.4886 11.9194 20.2145 11.9466C20.5416 11.9588 20.6796 11.9892 20.7681 12.0259C21.0487 12.1421 21.2717 12.365 21.3879 12.6456C21.4172 12.7163 21.4442 12.8237 21.4592 13.0442C21.4747 13.2709 21.4751 13.5637 21.4751 14C21.4751 14.4363 21.4747 14.7291 21.4592 14.9558C21.4442 15.1763 21.4172 15.2837 21.3879 15.3544C21.2717 15.635 21.0487 15.8579 20.7681 15.9742C20.6796 16.0108 20.5416 16.0412 20.2144 16.0534C19.4885 16.0806 18.7896 16.4552 18.4056 17.1203C18.0215 17.7855 18.0465 18.5782 18.3859 19.2205C18.5389 19.5099 18.5816 19.6446 18.5941 19.7396C18.6337 20.0407 18.5521 20.3452 18.3672 20.5862C18.3206 20.6469 18.2411 20.724 18.0577 20.8473C17.8691 20.974 17.6157 21.1207 17.2379 21.3389C16.8601 21.557 16.6063 21.7031 16.4022 21.803C16.2037 21.9003 16.0972 21.9306 16.0214 21.9406C15.7202 21.9802 15.4157 21.8986 15.1747 21.7137C15.0987 21.6554 15.0034 21.5511 14.8293 21.2739C14.4428 20.6588 13.7688 20.2408 13.0006 20.2409C12.2326 20.2409 11.5587 20.6589 11.1723 21.2739C10.9981 21.5512 10.9028 21.6555 10.8267 21.7138C10.5858 21.8987 10.2812 21.9803 9.98012 21.9407C9.90427 21.9307 9.79777 21.9004 9.59925 21.8031C9.39518 21.7032 9.14143 21.5571 8.76361 21.339C8.38579 21.1208 8.13241 20.9741 7.94381 20.8474C7.76033 20.7241 7.68084 20.647 7.63426 20.5863C7.44937 20.3453 7.36777 20.0408 7.40741 19.7397C7.41992 19.6447 7.46259 19.51 7.61557 19.2206C7.95502 18.5783 7.98001 17.7856 7.59597 17.1205C7.21192 16.4553 6.51297 16.0806 5.78704 16.0534C5.45989 16.0412 5.3219 16.0108 5.23339 15.9742C4.95279 15.8579 4.72985 15.635 4.61362 15.3544C4.58435 15.2837 4.55734 15.1763 4.54229 14.9558C4.52682 14.7291 4.52645 14.4363 4.52645 14C4.52645 13.5637 4.52682 13.2709 4.54229 13.0442C4.55734 12.8237 4.58435 12.7163 4.61362 12.6456C4.72985 12.365 4.95279 12.1421 5.23339 12.0259C5.3219 11.9892 5.45989 11.9588 5.78705 11.9466C6.51297 11.9194 7.21191 11.5448 7.59598 10.8796C7.98009 10.2144 7.95511 9.42168 7.61564 8.77938C7.46269 8.48999 7.42003 8.35531 7.40752 8.26033C7.36788 7.95921 7.44948 7.65467 7.63437 7.41371C7.68095 7.35302 7.76044 7.27594 7.94391 7.15264C8.13252 7.02588 8.3859 6.87917 8.76372 6.66103C9.14154 6.4429 9.39529 6.29682 9.59936 6.19686C9.79788 6.09962 9.90438 6.06932 9.98023 6.05933C10.2814 6.01969 10.5859 6.10129 10.8268 6.28618C10.9029 6.34451 10.9982 6.44882 11.1724 6.72606C11.5588 7.34113 12.2328 7.75908 13.0008 7.75908C13.7689 7.75909 14.4428 7.34114 14.8293 6.72606C15.0035 6.44882 15.0988 6.34452 15.1748 6.28619C15.4157 6.1013 15.7203 6.0197 16.0214 6.05934Z"
              className="fill-blackColor group-hover:fill-purpleColorHover group-active:fill-blackColor"
            />
          </svg>
        </Link>
      );
    };
    return (
      <div className={className}>
        <p className="flex items-center gap-2 text-2xl font-extrabold text-blackColor md:text-3xl">
          {space.name}
          {isAdmin && <EditSpaceBtn />}
        </p>
        <p className="mt-2 line-clamp-6 font-medium text-black2Color sm:line-clamp-5 md:line-clamp-4">
          {space.description}
        </p>
      </div>
    );
  };

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
          variant="button-secondary-purple"
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
              variant="button-secondary-purple"
              href={`/spaces/${spaceAddress}/create-quest`}
              size="full"
              className="flex items-center justify-center border-none bg-transparent md:justify-start"
            >
              Add new quest
            </Button>
            <Button
              variant="button-secondary-purple"
              size="full"
              href={`/spaces/${spaceAddress}/create-journey`}
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
      <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-yellowColor px-3 py-4 text-start text-white md:min-h-[76px] lg:mt-0 lg:min-h-[130px] lg:flex-col lg:items-start">
        <p className="justify-between text-[18px] font-semibold leading-[22px] md:mt-0">
          Your Current XP Points
        </p>
        <div className="flex content-center items-center gap-2 lg:w-full">
          {/* TODO:add logic for xp */}
          <p className="text-[26px] font-extrabold leading-8 md:text-3xl">{formatNumber(2345)}</p>
        </div>
      </div>
      <div className="flex h-full w-full content-center items-center justify-between rounded-xl bg-pinkColor px-3 py-4 text-start text-white md:min-h-[76px] lg:mt-0 lg:min-h-[130px] lg:flex-col lg:items-start">
        <p className={classNames("text-[18px] font-semibold leading-[22px]")}>Completed quests</p>
        <p className={classNames("text-[26px] font-extrabold leading-8 md:text-3xl")}>
          {/* TODO: add logic for completed quests */}4
          <span className="text-[22px] font-medium">/20</span>
        </p>
      </div>
    </div>
  );
  return (
    <div className="flex flex-col rounded-xl border-[1px] border-black2Color bg-[#FFFFFF] px-3 pb-6 pt-4 md:flex md:p-[25px] md:pt-[30px] lg:min-h-[365px]">
      <div className="flex flex-col items-center gap-8 rounded-2xl md:flex-row md:items-start md:gap-12">
        <div className="flex w-full flex-1 gap-4 lg:justify-between">
          <div className="flex flex-1 flex-col items-center gap-8 md:flex-row md:items-start">
            <CompanyImage />
            <CompanyInfo className="w-full md:w-auto" />
          </div>
          {isAdmin && <NewQuestDropdown className="hidden lg:block" />}
        </div>
      </div>
      <div className="mt-4 w-full flex-1 md:mt-[30px]">
        <InfoPlates />
      </div>
      {isAdmin && (
        <NewQuestDropdown className="mx-auto mt-[30px] w-full text-center md:mt-5 md:w-max lg:hidden" />
      )}
    </div>
  );
};
