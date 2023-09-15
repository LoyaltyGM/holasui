import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "components";
import { IQuest } from "types";
import { Dispatch, SetStateAction } from "react";
import { useJourneyStore } from "store";
import { Inter } from "next/font/google";
import { classNames } from "utils";

const font_inter = Inter({ subsets: ["latin"] });

interface IQuestDialog {
  selectedQuest: IQuest;
  isQuestRemoving: boolean;
  removeQuest: () => void;
  setRemovingQuest: Dispatch<SetStateAction<boolean>>;
}

export const RemoveQuestDialog = ({
  selectedQuest,
  isQuestRemoving,
  removeQuest,
  setRemovingQuest,
}: IQuestDialog) => {
  const { bgColor } = useJourneyStore();
  if (!selectedQuest) return <></>;
  return (
    <Transition.Root show={isQuestRemoving} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setRemovingQuest(false);
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
          <div
            className={classNames(
              "flex min-h-full items-center justify-center",
              font_inter.className,
            )}
          >
            <Dialog.Panel className="relative mx-4 w-full max-w-[418px] transform overflow-hidden rounded-xl border-2 border-blackColor bg-basicColor px-4 py-5 text-left font-inter font-inter shadow-black transition-all md:mx-0 md:min-w-[452px] md:p-[30px] md:pt-5 lg:min-w-[452px] lg:px-[40px]">
              <Dialog.Title
                as="h3"
                className="mb-4 text-2xl font-bold leading-6 text-blackColor md:text-3xl lg:mb-5"
              >
                Do you really want to delete this quest?
              </Dialog.Title>
              <div className="mb-6 text-black2Color">
                <p className="mb-5 font-medium">Quest {selectedQuest.name}</p>
                <h3 className="text-lg font-bold">Link</h3>
                <p>{selectedQuest.call_to_action_url}</p>
              </div>
              <div className="flex w-full flex-col items-center gap-3 md:flex-row md:justify-between">
                <Button variant="dangerous-secondary" size="sm-full" onClick={removeQuest}>
                  Delete
                </Button>
                <Button
                  variant="popup-primary-purple"
                  size="sm-full"
                  onClick={() => setRemovingQuest(false)}
                >
                  Cancel
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
