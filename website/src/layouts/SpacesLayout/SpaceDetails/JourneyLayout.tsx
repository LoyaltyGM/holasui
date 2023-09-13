import Image from "next/image";
import GroupIcon from "/public/img/GroupIcon.svg";
import PlusIcon from "/public/img/PlusIcon.svg";
import {
  QuestCard,
  Breadcrumbs,
  QuestDialog,
  AlertErrorMessage,
  AlertSucceed,
  Button,
  Container,
  RemoveQuestDialog,
  SkeletonJourneyQuest,
  WhiteGearIcon,
} from "components";
import { useEffect, useState } from "react";
import { IJourney, IQuest, ISpaceAdminCap } from "types";
import {
  getJourneyUserPoints,
  getJourneyUserCompletedQuests,
  signTransactionCompleteJourney,
  signTransactionStartQuest,
  suiProvider,
  signTransactionRemoveQuest,
} from "services/sui";
import { getObjectFields, getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { BACKEND_URL, SPACE_ADMIN_CAP_TYPE, convertIPFSUrl } from "utils";
import { useRouter } from "next/router";
import { useJourneyStore } from "store";
import { ethos, EthosConnectStatus } from "ethos-connect";
import Link from "next/link";

export const JourneyLayout = ({
  spaceAddress,
  journeyAddress,
}: {
  spaceAddress: string;
  journeyAddress: string;
}) => {
  const { status, wallet } = ethos.useWallet();
  const router = useRouter();
  const { setDefaultBgColor, setBgColor, bgColor } = useJourneyStore();

  // Space states
  const [journey, setJourney] = useState<IJourney>();
  const [quests, setQuests] = useState<IQuest[]>();
  const [spaceName, setSpaceName] = useState<string>();
  const [userPoints, setUserPoints] = useState(0);
  const [userCompletedQuests, setUserCompletedQuests] = useState(0);

  // Is fetching states
  const [waitSui, setWaitSui] = useState(false);
  const [isJourneyFetching, setJourneyFetching] = useState(true);
  const [isQuestsFetching, setQuestsFetching] = useState(false);
  const [isAdminFetching, setAdminFetching] = useState(false);

  // Admin cap states
  const [isAdmin, setAdmin] = useState(false);
  // TODO: now default value is 'mockup'. solve what to put instead of
  const [adminCap, setAdminCap] = useState<string>("mockup");
  const [editingJourneyMode, setEditingJourneyMode] = useState(false);

  // Dialog states
  const [selectedQuest, setSelectedQuest] = useState<IQuest>();
  const [isQuestOpened, setQuestOpened] = useState<boolean>(false);
  const [isQuestRemoving, setRemovingQuest] = useState<boolean>(false);
  // Page color changing
  useEffect(() => {
    if (bgColor === "basicColor") {
      setBgColor("purpleColor");
    }
    router.events.on("routeChangeStart", setDefaultBgColor);
    return () => {
      router.events.off("routeChangeStart", setDefaultBgColor);
    };
  }, []);
  // Journey fetch
  useEffect(() => {
    const fetchJourneyAndSpaceName = async () => {
      try {
        const spaceObject = await suiProvider.getObject({
          id: spaceAddress,
          options: {
            showContent: true,
          },
        });
        const space = getObjectFields(spaceObject) as any;
        setSpaceName(space.name);
        const journeysObject = await suiProvider.getObject({
          id: journeyAddress,
          options: {
            showContent: true,
          },
        });
        const journey = getObjectFields(journeysObject) as IJourney;
        journey.reward_image_url = convertIPFSUrl(journey.reward_image_url);
        setJourney(journey);
      } catch (e) {
        console.log(e);
      }
    };
    if (isJourneyFetching) {
      fetchJourneyAndSpaceName()
        .then()
        .finally(() => {
          setJourneyFetching(false);
          setQuestsFetching(true);
        });
    }
  }, [isJourneyFetching]);
  // Journey info fetch (user points and completed quests)
  useEffect(() => {
    if (!wallet) return;
    getJourneyUserPoints({
      space: spaceAddress,
      journey_id: journeyAddress,
      user: wallet.address,
    })
      .then((points) => {
        setUserPoints(points);
        return getJourneyUserCompletedQuests({
          space: spaceAddress,
          journey_id: journeyAddress,
          user: wallet.address,
        });
      })
      .then((data) => setUserCompletedQuests(data));
  }, [wallet]);
  // Quests fetch
  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const questsFields = await suiProvider.getDynamicFields({
          parentId: journey!.quests.fields.id.id,
        });
        const questsObjects = await Promise.all(
          questsFields.data.map(({ objectId }) =>
            suiProvider.getObject({
              id: objectId,
              options: {
                showContent: true,
              },
            }),
          ),
        );
        const quests = questsObjects.map((object) => {
          const quest = getObjectFields(object);
          if (quest) {
            quest.reward_image_url = convertIPFSUrl(quest.reward_image_url);
            quest.id = quest.id.id;
          }
          return quest as IQuest;
        });
        setQuests(quests);
      } catch (e) {
        console.log(e);
      }
    };
    if (isQuestsFetching) {
      fetchQuests()
        .then()
        .finally(() => {
          setQuestsFetching(false);
          setAdminFetching(true);
        });
    }
  }, [isQuestsFetching]);
  // Admin cap fetch
  useEffect(() => {
    async function fetchIsAdmin() {
      if (isAdminFetching && wallet) {
        try {
          const ownedObjects = wallet?.contents?.objects!;
          const adminCap: any | undefined = ownedObjects.find(
            (object) =>
              object.type === SPACE_ADMIN_CAP_TYPE && object?.fields?.space_id === spaceAddress,
          );
          if (adminCap) {
            setAdmin(true);
            setAdminCap(adminCap.fields.id.id);
          }
          setAdminFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchIsAdmin().then();
  }, [isAdminFetching, wallet]);

  // utils functions
  const startQuest = async () => {
    if (wallet) {
      setWaitSui(true);
      try {
        const response = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: signTransactionStartQuest({
            space: spaceAddress,
            journey_id: journeyAddress,
            quest_id: selectedQuest!.id,
          }),
          options: {
            showEffects: true,
          },
        });
        const status = getExecutionStatus(response);

        if (status?.status === "failure") {
          console.log(status.error);
          const error_status = getExecutionStatusError(response);
          if (error_status) AlertErrorMessage(error_status);
        } else {
          AlertSucceed("StartQuest");
          setWaitSui(false);
        }
      } catch (e) {
        console.log(e);
        setWaitSui(false);
      }
    }
  };
  const removeQuest = async () => {
    if (wallet) {
      try {
        const response = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: signTransactionRemoveQuest({
            admin_cap: adminCap,
            space: spaceAddress,
            journey_id: journeyAddress,
            quest_id: selectedQuest!.id,
          }),
          options: {
            showEffects: true,
          },
        });
        const status = getExecutionStatus(response);

        if (status?.status === "failure") {
          console.log(status.error);
          const error_status = getExecutionStatusError(response);
          if (error_status) AlertErrorMessage(error_status);
        } else {
          AlertSucceed("CreateQuest");
          router.replace(`/spaces/${spaceAddress}/${journeyAddress}`).then();
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  const completeQuest = async () => {
    if (wallet && selectedQuest) {
      setWaitSui(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/sui/completeQuest/${spaceAddress}/${journeyAddress}/${selectedQuest.id}/${wallet.address}`,
        );
        setWaitSui(false);
      } catch (e) {
        setWaitSui(false);
        console.log(e);
      }
    }
  };
  const handleClaimNft = async () => {
    if (!wallet) return;
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCompleteJourney({
          space: spaceAddress,
          journey_id: journeyAddress,
        }),
        options: {
          showEffects: true,
        },
      });
      const status = getExecutionStatus(response);
      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("ClaimNft");
        router.replace(`/spaces/${spaceAddress}`).then();
      }
    } catch (e) {
      console.log(e);
    }
  };

  // components
  const PeopleStatusBadge = ({ className }: { className?: string }) => {
    return (
      <div
        className={`flex w-max items-center gap-1 rounded-[50px] border-2 border-white px-3 py-[6px] ${className}`}
      >
        <Image src={GroupIcon} alt={"Group icon"} height={22} width={18} />
        <p className="font-medium">
          {journey?.total_completed}
          <span className="hidden md:inline"> claimed</span>
        </p>
      </div>
    );
  };
  const Info = () => {
    const EditSpaceBtn = () => (
      <button onClick={() => setEditingJourneyMode(true)} className="group">
        <WhiteGearIcon bgColor={bgColor} />
      </button>
    );
    return (
      <div>
        <div className="mb-4 flex items-center gap-4 md:max-w-[350px] md:text-4xl lg:max-w-fit">
          <h1 className="text-[26px] font-extrabold leading-8 lg:text-5xl xl:text-6xl">
            {journey?.name}
          </h1>
          {isAdmin && !editingJourneyMode && <EditSpaceBtn />}
        </div>
        <div className="mb-8 flex items-center font-medium md:min-h-[57px] lg:min-h-[100px]">
          <p>Complete quests to get NFT reward.</p>
          {isJourneyFetching ? (
            <p className="h-3 w-12 animate-pulse rounded-2xl bg-grayColor" />
          ) : (
            journey?.description
          )}
        </div>
      </div>
    );
  };
  const JourneyImage = () => (
    <div className="relative mb-6 h-[200px] w-[200px] md:h-[160px] md:w-[160px] lg:h-[177px] lg:w-[177px] xl:h-[200px] xl:w-[200px]">
      {journey && (
        <Image
          src={journey.reward_image_url}
          alt={"Journey image"}
          fill
          className="rounded-full object-cover"
        />
      )}
    </div>
  );
  const QuestCount = () => (
    <div className="flex flex-col items-center justify-center">
      <p className="text-3xl font-extrabold">
        {quests && quests.length > 0 ? `${userCompletedQuests}/${quests.length}` : "0"}
      </p>
      <p className="text-xl font-medium">quest</p>
    </div>
  );
  const ClaimButtonAndInfo = () =>
    journey && (
      <div className="text-right md:flex md:items-center md:gap-4 md:text-center lg:flex-col">
        <Button
          btnType="button"
          variant="default-purple"
          className="mb-2 md:mb-0"
          onClick={handleClaimNft}
          disabled={userPoints < journey.reward_required_points}
        >
          {userPoints < journey.reward_required_points ? "Claim NFT" : "Claimed NFT"}
        </Button>
        <p className="font-medium leading-5 md:max-w-[110px] lg:max-w-none">
          {userPoints < journey.reward_required_points &&
            `${journey.reward_required_points - userPoints} XP left for claiming`}
        </p>
      </div>
    );
  const AddQuestButton = () => (
    <Link href={`/spaces/${spaceAddress}/create-quest`}>
      <div className="flex min-h-[130px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-grayColor text-white hover:border-white">
        <Image src={PlusIcon} alt="Plus icon" width={20} height={20} />
        <p className="text-xl font-medium">Add quest</p>
      </div>
    </Link>
  );
  const NoQuests = () => (
    <div className="flex items-center justify-center text-lg font-medium">
      <p>{`There are no quests in the ${journey?.name ?? "Journey"} yet`}</p>
    </div>
  );
  const QuestsContainer = () => {
    if (isQuestsFetching || isJourneyFetching || isAdminFetching) {
      return (
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          <SkeletonJourneyQuest />
        </div>
      );
    }

    return quests && quests.length && wallet ? (
      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {editingJourneyMode && <AddQuestButton />}
        {quests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            editingJourneyMode={editingJourneyMode}
            userAddress={wallet.address}
            journeyAddress={journeyAddress}
            spaceAddress={spaceAddress}
            setRemovingQuest={setRemovingQuest}
            setQuestOpened={setQuestOpened}
            setSelectedQuest={setSelectedQuest}
          />
        ))}
      </div>
    ) : editingJourneyMode ? (
      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <AddQuestButton />
      </div>
    ) : (
      <NoQuests />
    );
  };
  {
    editingJourneyMode && (
      <div className="mt-7 flex justify-center md:mt-10">
        <Button
          onClick={() => setEditingJourneyMode(false)}
          btnType="button"
          variant="default-purple"
          size="sm-full"
        >
          Done
        </Button>
      </div>
    );
  }

  return (
    <Container className={`bg-${bgColor} text-white`}>
      <div className="relative w-full">
        <Breadcrumbs
          linkNames={`Spaces/${spaceName}/${journey?.name}`}
          routerPath={router.asPath}
        />
        {!editingJourneyMode && <PeopleStatusBadge className="absolute right-0 top-0" />}
      </div>
      <div className="mb-10 flex flex-col items-center md:flex-row md:justify-between md:gap-10 lg:mb-[60px]">
        <JourneyImage />
        <div className="lg:mt w-full flex-1 justify-between lg:mt-3 lg:flex lg:gap-20">
          <Info />
          {!editingJourneyMode && (
            <div className="flex items-start justify-between md:flex-row-reverse md:items-center lg:flex-col lg:justify-normal lg:gap-[30px]">
              <QuestCount />
              <ClaimButtonAndInfo />
            </div>
          )}
        </div>
      </div>
      <QuestsContainer />
      {wallet && (
        <QuestDialog
          selectedQuest={selectedQuest!}
          isQuestOpened={isQuestOpened}
          startQuest={startQuest}
          spaceAddress={spaceAddress}
          journeyAddress={journeyAddress}
          userAddress={wallet.address}
          waitSui={waitSui}
          completeQuest={completeQuest}
          setWaitSui={setWaitSui}
          setQuestOpened={setQuestOpened}
        />
      )}
      <RemoveQuestDialog
        selectedQuest={selectedQuest!}
        isQuestRemoving={isQuestRemoving}
        removeQuest={removeQuest}
        setRemovingQuest={setRemovingQuest}
      />
    </Container>
  );
};
