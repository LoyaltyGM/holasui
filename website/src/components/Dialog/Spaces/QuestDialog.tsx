import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "components";
import { IQuest } from "types";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { useJourneyStore } from "store";
import { Inter } from "next/font/google";
import { classNames } from "utils";
import { getIsCompletedQuest, getIsStartedQuest } from "services/sui";

const font_inter = Inter({ subsets: ["latin"] });

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
  const RewardTicketIcon = ({ color }: { color: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      className={`fill-${color}`}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.5968 3.79169H16.4036C18.5518 3.79167 20.253 3.79165 21.5843 3.97032C22.9542 4.15415 24.0628 4.54143 24.9372 5.41423C26.2371 6.71173 26.4772 8.5488 26.5414 11.0545C26.5634 11.9134 25.8838 12.4407 25.3157 12.5892C24.6869 12.7537 24.2258 13.325 24.2258 14C24.2258 14.675 24.6869 15.2464 25.3157 15.4108C25.8838 15.5594 26.5634 16.0866 26.5414 16.9456C26.4772 19.4512 26.2371 21.2883 24.9372 22.5858C24.0628 23.4586 22.9542 23.8459 21.5843 24.0297C20.253 24.2084 18.5518 24.2084 16.4036 24.2084H11.5968C9.44863 24.2084 7.74744 24.2084 6.41611 24.0297C5.04623 23.8459 3.9376 23.4586 3.06318 22.5858C1.76328 21.2883 1.52319 19.4512 1.45902 16.9456C1.43702 16.0866 2.11661 15.5594 2.68471 15.4108C3.31349 15.2464 3.77461 14.675 3.77461 14C3.77461 13.325 3.31349 12.7537 2.68471 12.5892C2.11661 12.4407 1.43702 11.9134 1.45902 11.0545C1.52319 8.5488 1.76328 6.71173 3.06318 5.41423C3.9376 4.54143 5.04623 4.15415 6.41611 3.97032C7.74744 3.79165 9.44863 3.79167 11.5968 3.79169ZM6.64887 5.70477C5.47245 5.86264 4.79442 6.15878 4.29948 6.65281C3.56701 7.38392 3.28719 8.49064 3.21345 10.92C4.54751 11.309 5.52461 12.5387 5.52461 14C5.52461 15.4613 4.54751 16.6911 3.21345 17.0801C3.28719 19.5094 3.56701 20.6161 4.29948 21.3472C4.79442 21.8413 5.47245 22.1374 6.64887 22.2953C7.85029 22.4565 9.43391 22.4584 11.6626 22.4584H16.3379C18.5665 22.4584 20.1501 22.4565 21.3515 22.2953C22.528 22.1374 23.206 21.8413 23.7009 21.3472C24.4334 20.6161 24.7132 19.5094 24.787 17.0801C23.4529 16.6911 22.4758 15.4613 22.4758 14C22.4758 12.5387 23.4529 11.309 24.787 10.92C24.7132 8.49063 24.4334 7.38392 23.7009 6.65281C23.206 6.15878 22.528 5.86264 21.3515 5.70477C20.1501 5.54354 18.5665 5.54169 16.3379 5.54169H11.6626C9.43391 5.54169 7.85029 5.54354 6.64887 5.70477ZM14.0002 11.7069C13.9324 11.8243 13.857 11.9596 13.7681 12.119L13.6534 12.3247C13.6453 12.3393 13.6366 12.3551 13.6273 12.3721C13.5357 12.5397 13.384 12.8171 13.131 13.0092C12.8727 13.2052 12.5621 13.2727 12.3804 13.3122C12.3622 13.3161 12.3453 13.3198 12.3299 13.3233L12.1071 13.3737C11.9028 13.4199 11.7363 13.4576 11.594 13.4934C11.6865 13.6074 11.8068 13.7489 11.9632 13.9318L12.1151 14.1094C12.1259 14.122 12.1376 14.1355 12.15 14.1498C12.276 14.2949 12.4793 14.5291 12.5733 14.8314C12.6662 15.1302 12.6342 15.4379 12.6139 15.632C12.6119 15.6513 12.61 15.6696 12.6084 15.6866L12.5854 15.9235C12.5641 16.1431 12.5476 16.3184 12.5366 16.461C12.6581 16.4074 12.7964 16.3438 12.9607 16.2681L13.1693 16.1721C13.1836 16.1655 13.1994 16.1581 13.2164 16.1501C13.3838 16.0711 13.6751 15.9337 14.0002 15.9337C14.3253 15.9337 14.6166 16.0711 14.784 16.1501C14.8011 16.1581 14.8168 16.1655 14.8311 16.1721L15.0397 16.2681C15.204 16.3438 15.3423 16.4074 15.4638 16.461C15.4528 16.3184 15.4363 16.1431 15.415 15.9235L15.392 15.6866C15.3904 15.6696 15.3885 15.6513 15.3865 15.632C15.3663 15.4379 15.3342 15.1302 15.4271 14.8314C15.5211 14.5291 15.7245 14.2949 15.8504 14.1498C15.8628 14.1355 15.8746 14.122 15.8853 14.1094L16.0372 13.9318C16.1936 13.7489 16.3139 13.6074 16.4065 13.4934C16.2641 13.4576 16.0976 13.4199 15.8933 13.3737L15.6706 13.3233C15.6551 13.3198 15.6382 13.3161 15.62 13.3122C15.4384 13.2727 15.1277 13.2052 14.8694 13.0092C14.6164 12.8171 14.4647 12.5397 14.3731 12.3721C14.3638 12.3551 14.3551 12.3393 14.347 12.3247L14.2323 12.119C14.1435 11.9596 14.068 11.8243 14.0002 11.7069ZM12.8493 10.2663C13.0501 10.004 13.4149 9.62502 14.0002 9.62502C14.5855 9.62502 14.9503 10.004 15.1511 10.2663C15.3428 10.5166 15.5359 10.8631 15.7339 11.2184C15.7428 11.2346 15.7519 11.2507 15.7609 11.2669L15.8756 11.4727C15.9022 11.5204 15.9231 11.5579 15.9414 11.59C15.9733 11.5975 16.0104 11.6059 16.0567 11.6164L16.2795 11.6668C16.2977 11.6709 16.3159 11.6751 16.3342 11.6792C16.7166 11.7656 17.0967 11.8515 17.3885 11.9665C17.7106 12.0934 18.1473 12.3407 18.3156 12.8819C18.481 13.4136 18.2723 13.8639 18.0901 14.1534C17.9215 14.4213 17.6652 14.7209 17.4028 15.0276C17.3909 15.0414 17.379 15.0553 17.3672 15.0692L17.2153 15.2467C17.1751 15.2938 17.1448 15.3293 17.1192 15.36C17.1227 15.4024 17.1275 15.4517 17.1339 15.5178L17.1568 15.7547C17.1586 15.7727 17.1603 15.7908 17.1621 15.8088C17.202 16.2194 17.2405 16.6162 17.2264 16.9336C17.2115 17.2664 17.1317 17.7701 16.68 18.113C16.214 18.4668 15.6994 18.3897 15.373 18.2962C15.0723 18.21 14.717 18.0463 14.3592 17.8814C14.3421 17.8735 14.3249 17.8656 14.3078 17.8577L14.0992 17.7617C14.0602 17.7437 14.0282 17.729 14.0002 17.7163C13.9723 17.729 13.9402 17.7437 13.9012 17.7617L13.6926 17.8577C13.6755 17.8656 13.6584 17.8735 13.6412 17.8814C13.2834 18.0463 12.9281 18.21 12.6274 18.2962C12.301 18.3897 11.7864 18.4668 11.3204 18.113C10.8688 17.7701 10.7889 17.2664 10.7741 16.9336C10.7599 16.6162 10.7984 16.2194 10.8383 15.8088C10.8401 15.7908 10.8418 15.7727 10.8436 15.7547L10.8665 15.5178C10.8729 15.4517 10.8777 15.4024 10.8812 15.36C10.8556 15.3293 10.8253 15.2938 10.7851 15.2467L10.6332 15.0692C10.6214 15.0553 10.6095 15.0414 10.5976 15.0275C10.3352 14.7209 10.0789 14.4213 9.91029 14.1534C9.72808 13.8639 9.51943 13.4136 9.68477 12.8819C9.85308 12.3407 10.2898 12.0934 10.6119 11.9665C10.9037 11.8515 11.2838 11.7656 11.6662 11.6792C11.6845 11.6751 11.7027 11.6709 11.7209 11.6668L11.9437 11.6164C11.99 11.6059 12.0271 11.5975 12.059 11.59C12.0773 11.5579 12.0982 11.5204 12.1248 11.4727L12.2395 11.2669C12.2486 11.2507 12.2576 11.2346 12.2666 11.2184C12.4645 10.8631 12.6576 10.5166 12.8493 10.2663Z"
      />
    </svg>
  );
  const ButtonContainer = () => (
    <div className="flex flex-col gap-1">
      {isError && <p className="text-xs text-redColor">Please, try again in 5 minutes.</p>}
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
                    <p className="font-montserrat text-2xl font-extrabold">
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
