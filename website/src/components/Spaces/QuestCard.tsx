import Image from "next/image";
import Crystal from "/public/img/Crystal.png";
import CrystalDisabled from "/public/img/CrystalDisabled.png";
import CloseCircleIcon from "/public/img/CloseCircleIcon.svg";
import { IQuest } from "types";
import { useJourneyStore } from "store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getIsCompletedQuest } from "services/sui";
import { UserIcon, RewardTicketIcon } from "components/Icons";

interface IQuestCard {
  quest: IQuest;
  editingJourneyMode: boolean;
  userAddress: string;
  journeyAddress: string;
  spaceAddress: string;
  setRemovingQuest: Dispatch<SetStateAction<boolean>>;
  setQuestOpened: Dispatch<SetStateAction<boolean>>;
  setSelectedQuest: Dispatch<SetStateAction<IQuest | undefined>>;
}

export const QuestCard = ({
  quest,
  editingJourneyMode,
  userAddress,
  journeyAddress,
  spaceAddress,
  setRemovingQuest,
  setQuestOpened,
  setSelectedQuest,
}: IQuestCard) => {
  const [isLoading, setLoading] = useState(true);
  const [isCompletedQuest, setIsCompleted] = useState(false);
  useEffect(() => {
    if (!isLoading) return;
    getIsCompletedQuest({
      space: spaceAddress,
      journey_id: journeyAddress,
      quest_id: quest.id,
      user: userAddress,
    })
      .then((data) => setIsCompleted(data))
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [isLoading]);
  const { bgColor } = useJourneyStore();

  const Title = () => <h3 className="text-lg font-bold">{quest.name}</h3>;
  const Reward = () => {
    return (
      <div className="flex items-center gap-2">
        <RewardTicketIcon color={bgColor} />
        <p className="font-montserrat text-lg font-extrabold">{quest.points_amount}</p>
      </div>
    );
  };
  const CrystalIndicator = () => {
    const SkeletonCrystal = () => <div className="bg-gray h-7 w-7 animate-pulse" />;
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        {isLoading ? (
          <SkeletonCrystal />
        ) : isCompletedQuest ? (
          <Image src={CrystalDisabled} alt={"crystal disabled"} width={28} height={28} />
        ) : (
          <Image src={Crystal} alt={"crystal"} width={28} height={28} />
        )}
      </div>
    );
  };
  const RemoveQuestBtn = () => (
    <button
      onClick={() => {
        setSelectedQuest(quest);
        setRemovingQuest(true);
      }}
    >
      <Image src={CloseCircleIcon} alt="Remove icon" width={30} height={30} />
    </button>
  );
  const PeopleCompleted = () => {
    return (
      <div className="flex items-center gap-1">
        <UserIcon color={bgColor} />
        <p className="font-medium">{quest.total_completed}</p>
      </div>
    );
  };

  return (
    <div
      className="card-shadow flex min-h-[130px] w-full flex-col justify-between rounded-xl border-[1px] border-black2Color bg-basicColor p-3 text-blackColor"
      onClick={() => {
        if (!editingJourneyMode) {
          setSelectedQuest(quest);
          setQuestOpened(true);
        }
      }}
    >
      <div className="flex justify-between">
        <Title />
        {editingJourneyMode ? <RemoveQuestBtn /> : <CrystalIndicator />}
      </div>
      <div>
        <div className="flex content-center items-center justify-between lg:w-full">
          <Reward />
          {!editingJourneyMode && <PeopleCompleted />}
        </div>
      </div>
    </div>
  );
};
