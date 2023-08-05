import { Dialog, Transition } from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";
import { classNames } from "utils";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import token from "/public/img/points.png";
import { StakingRules } from "components";
import { IStakingTicket } from "types";

interface IUnstakeDetailDialog {
  selectedStaked: IStakingTicket | undefined;
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  claimPointsFunction: (ticket: IStakingTicket) => Promise<void>;
  unstakeCapyFunction: (ticket: IStakingTicket) => Promise<void>;
  waitSui: boolean;
}

export const UnstakeDetailDialog = ({
  selectedStaked,
  openDialog,
  setOpenDialog,
  claimPointsFunction,
  unstakeCapyFunction,
  waitSui,
}: IUnstakeDetailDialog) => {
  if (!selectedStaked) return <></>;

  return (
    <Transition.Root show={openDialog} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpenDialog(false);
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-[#5e5e5e] bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative mx-4 my-20 w-full max-w-[418px] transform overflow-hidden rounded-xl border-2 border-blackColor bg-basicColor px-4 py-5 text-left shadow-black transition-all md:mx-0 md:w-auto md:p-[30px] md:pt-5 xl:px-[50px]">
              <Dialog.Title className="mb-4 text-center text-lg font-bold leading-6 text-blackColor xl:mb-5">
                Staking
              </Dialog.Title>
              <button onClick={() => setOpenDialog(false)} className="absolute right-5 top-5">
                <XMarkIcon className="h-7 w-7 md:hidden" />
              </button>
              <div className="flex w-full flex-col items-center gap-[14px] xl:gap-5">
                <div className="min-w-[228px] max-w-[228px] rounded-xl bg-white  px-2 py-4 xl:max-w-[268px]">
                  <Image
                    className="h-full w-full rounded-lg"
                    src={selectedStaked.url}
                    alt="Workflow"
                    width={75}
                    height={75}
                    unoptimized={true}
                    priority
                  />
                </div>
                <div
                  className={classNames(
                    "flex flex-col content-center items-center gap-[6px] text-center text-base font-bold text-black2Color",
                  )}
                >
                  Your current Hola points
                  <div className="flex items-center gap-2">
                    <Image
                      src={token}
                      alt={"points"}
                      height={32}
                      width={32}
                      priority
                      className="xl:h-[42px] xl:w-[42px]"
                    />
                    <p className="font-montserrat text-[26px] font-extrabold text-blackColor">
                      {Math.floor((Date.now() - selectedStaked.start_time) / 60_000)}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-[10px]">
                  <button
                    className="button-popup-primary-pink w-full"
                    onClick={() => {
                      unstakeCapyFunction(selectedStaked!).then();
                    }}
                    disabled={waitSui}
                  >
                    Unstake
                  </button>
                  <button
                    className="button-popup-secondary-pink w-full"
                    onClick={() => {
                      claimPointsFunction(selectedStaked!).then();
                    }}
                    disabled={waitSui}
                  >
                    Claim Points
                  </button>
                </div>
                <StakingRules isStakingDialog={true} />
                <p className="text-center text-sm text-black2Color">
                  Points will be calculated after unstaking
                </p>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
