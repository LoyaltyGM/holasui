import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { Button, StakingRules } from "components";
import { IObjectDetailDialog } from "types";

export const ObjectDetailDialog = ({
  selectedFrend,
  openedFrend,
  setOpenedFrend,
  stakeFunction,
  waitSui,
}: IObjectDetailDialog) => {
  if (!selectedFrend) return <></>;
  return (
    <Transition.Root show={openedFrend} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpenedFrend(false);
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
            <Dialog.Panel className="relative mx-4 w-full max-w-[418px] transform overflow-hidden rounded-xl border-2 border-blackColor bg-basicColor px-4 py-5 text-left shadow-black transition-all md:mx-0 md:w-auto md:p-[30px] md:pt-5 xl:px-[50px]">
              <Dialog.Title
                as="h3"
                className="mb-4 text-center text-lg font-bold leading-6 text-blackColor xl:mb-5"
              >
                Start staking
              </Dialog.Title>
              <button onClick={() => setOpenedFrend(false)} className="absolute right-5 top-5">
                <XMarkIcon className="h-7 w-7 md:hidden" />
              </button>
              <div className="flex w-full flex-col items-center gap-4 xl:gap-5">
                <div className="min-w-[228px] max-w-[228px] rounded-xl bg-white  px-2 py-4 xl:max-w-[268px]">
                  <Image
                    className="h-full w-full rounded-lg"
                    src={selectedFrend.url}
                    alt="Workflow"
                    width={75}
                    height={75}
                    unoptimized={true}
                    priority
                  />
                </div>

                <Button
                  variant="popup-secondary-yellow"
                  size="full"
                  onClick={() => {
                    stakeFunction(selectedFrend!).then();
                  }}
                  disabled={waitSui}
                >
                  Stake
                </Button>
                <StakingRules isStakingDialog={true} />
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
