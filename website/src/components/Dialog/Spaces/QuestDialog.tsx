import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "components";
import { IQuest } from "types";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useJourneyStore } from "store";
import { Inter, Montserrat } from "next/font/google";
import { classNames } from "utils";
import { getIsCompletedQuest, getIsStartedQuest } from "services/sui";
import { RewardTicketIcon } from "components/Icons";
import ConfettiExplosion from "react-confetti-explosion";

const font_inter = Inter({ subsets: ["latin"] });
const font_montserrat = Montserrat({ subsets: ["latin"] });

interface IQuestDialog {
  selectedQuest: IQuest;
  isQuestOpened: boolean;
  waitSui: boolean;
  spaceAddress: string;
  journeyAddress: string;
  userAddress: string;
  setWaitSui: (value: boolean) => void;
  startQuest: () => void;
  completeQuest: () => void;
  setQuestOpened: Dispatch<SetStateAction<boolean>>;
}

export const QuestDialog = ({
  selectedQuest,
  isQuestOpened,
  waitSui,
  spaceAddress,
  journeyAddress,
  userAddress,
  setWaitSui,
  startQuest,
  completeQuest,
  setQuestOpened,
}: IQuestDialog) => {
  const [isStarted, setStarted] = useState<boolean>(false);
  const [isCompleted, setCompleted] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);
  const { bgColor } = useJourneyStore();

  useEffect(() => {
    if (isQuestOpened && !waitSui) {
      setLoading(true);
      getIsStartedQuest({
        space: spaceAddress,
        journey_id: journeyAddress,
        quest_id: selectedQuest.id,
        user: userAddress,
      })
        .then((data) => setStarted(data))
        .then(() => {
          return getIsCompletedQuest({
            space: spaceAddress,
            journey_id: journeyAddress,
            quest_id: selectedQuest.id,
            user: userAddress,
          });
        })
        .then((data) => {
          setError(false);
          setCompleted(data);
        })
        .catch((e) => {
          setError(true);
          console.log(e);
        })
        .finally(() => {
          setWaitSui(false);
          setLoading(false);
        });
    }
  }, [isQuestOpened, waitSui]);

  if (!selectedQuest) return <></>;
  const ButtonContainer = () => (
    <div className="flex flex-col gap-1">
      {isError && <p className="text-xs text-redColor">Please, try again in 5 minutes.</p>}
      {isCompleted && <p className="text-xs text-green-600">You completed the quest already.</p>}
      {isCompleted ? (
        <Button disabled variant="popup-secondary-purple">
          {waitSui || isLoading ? <Spinner /> : "Completed"}
        </Button>
      ) : isStarted ? (
        <Button
          variant="popup-primary-purple"
          size="default"
          onClick={() => {
            if (!waitSui || !isLoading) {
              completeQuest();
            }
          }}
        >
          {waitSui || isLoading ? <Spinner /> : "Verify"}
        </Button>
      ) : (
        <Button
          variant="popup-primary-purple"
          size="default"
          onClick={() => {
            if (!waitSui || !isLoading) {
              startQuest();
            }
          }}
        >
          {waitSui || isLoading ? <Spinner /> : "Start"}
        </Button>
      )}
    </div>
  );
  return (
    <Transition.Root show={isQuestOpened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setQuestOpened(false);
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
            <Dialog.Panel className="relative mx-4 w-full max-w-[418px] transform overflow-hidden rounded-xl border-2 border-blackColor bg-basicColor px-4 py-5 text-left shadow-black transition-all md:mx-0 md:min-w-[410px] md:p-[30px] md:pt-5 lg:min-w-[550px] lg:px-[40px]">
              <Dialog.Title
                as="h3"
                className="mb-4 text-2xl font-bold leading-6 text-blackColor md:text-3xl lg:mb-5"
              >
                {selectedQuest.name}
              </Dialog.Title>
              {isCompleted && <ConfettiExplosion />}
              <button onClick={() => setQuestOpened(false)} className="absolute right-5 top-5">
                <XMarkIcon className="h-7 w-7 md:hidden" />
              </button>
              <div className="mb-6 text-black2Color">
                <p className="mb-5 font-medium">{selectedQuest.description}</p>
                <h3 className="text-lg font-bold">Link</h3>
                <Link
                  href={selectedQuest.call_to_action_url}
                  className="font-medium hover:text-purpleColorHover"
                >
                  {selectedQuest.call_to_action_url}
                </Link>
              </div>

              <div className="flex w-full items-center justify-between">
                <div>
                  <h3 className="mb-[10px] text-lg font-bold text-black2Color">Your reward</h3>
                  <div className="flex items-center gap-2">
                    <RewardTicketIcon color={bgColor} />
                    <p className={classNames("text-2xl font-extrabold", font_montserrat.className)}>
                      {selectedQuest.points_amount}
                    </p>
                  </div>
                </div>
                <ButtonContainer />
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
