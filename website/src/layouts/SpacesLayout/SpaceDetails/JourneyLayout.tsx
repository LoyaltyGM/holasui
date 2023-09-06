import { Button, Container, RemoveQuestDialog } from "components";
import Image from "next/image";
import GroupIcon from "/public/img/GroupIcon.svg";
import PlusIcon from "/public/img/PlusIcon.svg";
import { QuestCard, Breadcrumbs, QuestDialog, AlertErrorMessage, AlertSucceed } from "components";
import { useEffect, useState } from "react";
import { IJourney, IQuest, ISpaceAdminCap } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { convertIPFSUrl } from "utils";
import { useRouter } from "next/router";
import { useJourneyStore } from "store";
import { ethos, EthosConnectStatus } from "ethos-connect";
import Link from "next/link";
import { signTransactionRemoveQuest } from "services/sui";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";

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
  const [editingJourneyMode, setEditingJourneyMode] = useState<boolean>(false);
  // Is fetching states
  const [isJourneyFetching, setJourneyFetching] = useState<boolean>(true);
  const [isQuestsFetching, setQuestsFetching] = useState<boolean>(true);
  const [isAdminFetching, setAdminFetching] = useState<boolean>(false);
  // Admin cap states
  const [isAdmin, setAdmin] = useState<boolean>(false);
  // TODO: now default value is 'mockup'. solve what to put instead of
  const [adminCap, setAdminCap] = useState<string>("mockup");
  // Dialog states
  const [selectedQuest, setSelectedQuest] = useState<IQuest>();
  const [isQuestOpened, setQuestOpened] = useState<boolean>(false);
  const [isQuestRemoving, setRemovingQuest] = useState<boolean>(false);

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
          const adminCap: ISpaceAdminCap | undefined = ownedObjects
            .map((object) => getObjectFields(object) as ISpaceAdminCap)
            .filter(
              (object) =>
                object?.hasOwnProperty("space_id") &&
                object?.hasOwnProperty("id") &&
                object?.hasOwnProperty("name"),
            )
            .find(({ space_id }) => space_id === spaceAddress);
          if (adminCap) {
            setAdmin(true);
            setAdminCap(adminCap.id.id);
          }
          setAdminFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchIsAdmin().then();
  }, [isAdminFetching, wallet]);
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
            className={`fill-white group-hover:fill-${bgColor}Hover group-active:fill-white`}
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M17.905 5.45937C17.5524 5.25577 17.258 5.0858 17.0068 4.96276C16.7453 4.83467 16.4863 4.73447 16.2008 4.69689C15.5383 4.60967 14.8683 4.78919 14.3382 5.19596C14.0622 5.40772 13.8617 5.68301 13.6657 5.99496C13.5081 6.24571 13.2553 6.38487 13.0008 6.38487C12.7463 6.38487 12.4935 6.24571 12.336 5.99496C12.14 5.68301 11.9394 5.40771 11.6634 5.19595C11.1333 4.78918 10.4633 4.60966 9.80086 4.69688C9.51537 4.73446 9.25636 4.83466 8.99486 4.96275C8.74366 5.08579 8.44928 5.25576 8.09664 5.45936L8.05657 5.4825C7.70393 5.68609 7.40955 5.85604 7.17739 6.01207C6.93571 6.17449 6.71943 6.3487 6.54414 6.57715C6.13737 7.10725 5.95785 7.77723 6.04507 8.4397C6.09047 8.78454 6.22856 9.09585 6.40068 9.42151C6.5391 9.68341 6.53321 9.97199 6.40591 10.1924C6.27863 10.4129 6.03167 10.5622 5.73569 10.5733C5.36756 10.5871 5.02887 10.6231 4.7075 10.7563C4.09018 11.012 3.59972 11.5024 3.34402 12.1197C3.23382 12.3858 3.19109 12.6602 3.17127 12.9507C3.15223 13.2298 3.15223 13.5697 3.15224 13.9768L3.15224 14.0231C3.15223 14.4303 3.15223 14.7703 3.17127 15.0493C3.19109 15.3398 3.23382 15.6142 3.34402 15.8803C3.59972 16.4976 4.09018 16.9881 4.7075 17.2438C5.02886 17.3769 5.36754 17.4129 5.73567 17.4267C6.03165 17.4378 6.27859 17.5871 6.40587 17.8076C6.53313 18.028 6.53902 18.3166 6.40062 18.5784C6.22848 18.9041 6.09036 19.2154 6.04496 19.5603C5.95774 20.2228 6.13726 20.8928 6.54403 21.4229C6.71932 21.6513 6.9356 21.8255 7.17728 21.9879C7.40944 22.144 7.70382 22.3139 8.05646 22.5175L8.09654 22.5406C8.44917 22.7442 8.74355 22.9142 8.99475 23.0373C9.25625 23.1653 9.51526 23.2655 9.80075 23.3031C10.4632 23.3903 11.1332 23.2108 11.6633 22.8041C11.9393 22.5923 12.1399 22.317 12.3359 22.005C12.4934 21.7543 12.7462 21.6151 13.0007 21.6151C13.2553 21.6151 13.5081 21.7542 13.6657 22.005C13.8617 22.3169 14.0622 22.5922 14.3382 22.804C14.8683 23.2107 15.5383 23.3902 16.2007 23.303C16.4862 23.2654 16.7452 23.1652 17.0067 23.0372C17.2579 22.9141 17.5523 22.7442 17.9049 22.5406L17.945 22.5174C18.2976 22.3139 18.5921 22.1439 18.8242 21.9878C19.0659 21.8254 19.2822 21.6512 19.4575 21.4228C19.8642 20.8927 20.0437 20.2227 19.9565 19.5602C19.9111 19.2154 19.773 18.904 19.6009 18.5783C19.4625 18.3165 19.4684 18.0279 19.5956 17.8075C19.7229 17.5871 19.9698 17.4378 20.2658 17.4267C20.6339 17.4129 20.9726 17.3769 21.294 17.2438C21.9113 16.9881 22.4018 16.4976 22.6575 15.8803C22.7677 15.6142 22.8104 15.3398 22.8303 15.0493C22.8493 14.7703 22.8493 14.4304 22.8493 14.0232L22.8493 13.9769C22.8493 13.5697 22.8493 13.2298 22.8303 12.9507C22.8104 12.6602 22.7677 12.3858 22.6575 12.1197C22.4018 11.5024 21.9113 11.012 21.294 10.7563C20.9727 10.6231 20.634 10.5871 20.2659 10.5733C19.9699 10.5622 19.7229 10.4129 19.5957 10.1924C19.4684 9.97201 19.4625 9.68346 19.6009 9.4216C19.773 9.09591 19.9112 8.78458 19.9566 8.43971C20.0438 7.77724 19.8643 7.10726 19.4575 6.57716C19.2822 6.3487 19.0659 6.17449 18.8242 6.01207C18.5921 5.85605 18.2977 5.68609 17.9451 5.4825L17.905 5.45937ZM16.0214 6.05934C16.0973 6.06933 16.2038 6.09963 16.4023 6.19687C16.6063 6.29683 16.8601 6.44291 17.2379 6.66104C17.6157 6.87917 17.8691 7.02589 18.0577 7.15264C18.2412 7.27595 18.3207 7.35303 18.3673 7.41372C18.5522 7.65468 18.6338 7.95922 18.5941 8.26034C18.5816 8.35532 18.5389 8.49002 18.386 8.77946C18.0465 9.42171 18.0215 10.2144 18.4056 10.8795C18.7896 11.5447 19.4886 11.9194 20.2145 11.9466C20.5416 11.9588 20.6796 11.9892 20.7681 12.0259C21.0487 12.1421 21.2717 12.365 21.3879 12.6456C21.4172 12.7163 21.4442 12.8237 21.4592 13.0442C21.4747 13.2709 21.4751 13.5637 21.4751 14C21.4751 14.4363 21.4747 14.7291 21.4592 14.9558C21.4442 15.1763 21.4172 15.2837 21.3879 15.3544C21.2717 15.635 21.0487 15.8579 20.7681 15.9742C20.6796 16.0108 20.5416 16.0412 20.2144 16.0534C19.4885 16.0806 18.7896 16.4552 18.4056 17.1203C18.0215 17.7855 18.0465 18.5782 18.3859 19.2205C18.5389 19.5099 18.5816 19.6446 18.5941 19.7396C18.6337 20.0407 18.5521 20.3452 18.3672 20.5862C18.3206 20.6469 18.2411 20.724 18.0577 20.8473C17.8691 20.974 17.6157 21.1207 17.2379 21.3389C16.8601 21.557 16.6063 21.7031 16.4022 21.803C16.2037 21.9003 16.0972 21.9306 16.0214 21.9406C15.7202 21.9802 15.4157 21.8986 15.1747 21.7137C15.0987 21.6554 15.0034 21.5511 14.8293 21.2739C14.4428 20.6588 13.7688 20.2408 13.0006 20.2409C12.2326 20.2409 11.5587 20.6589 11.1723 21.2739C10.9981 21.5512 10.9028 21.6555 10.8267 21.7138C10.5858 21.8987 10.2812 21.9803 9.98012 21.9407C9.90427 21.9307 9.79777 21.9004 9.59925 21.8031C9.39518 21.7032 9.14143 21.5571 8.76361 21.339C8.38579 21.1208 8.13241 20.9741 7.94381 20.8474C7.76033 20.7241 7.68084 20.647 7.63426 20.5863C7.44937 20.3453 7.36777 20.0408 7.40741 19.7397C7.41992 19.6447 7.46259 19.51 7.61557 19.2206C7.95502 18.5783 7.98001 17.7856 7.59597 17.1205C7.21192 16.4553 6.51297 16.0806 5.78704 16.0534C5.45989 16.0412 5.3219 16.0108 5.23339 15.9742C4.95279 15.8579 4.72985 15.635 4.61362 15.3544C4.58435 15.2837 4.55734 15.1763 4.54229 14.9558C4.52682 14.7291 4.52645 14.4363 4.52645 14C4.52645 13.5637 4.52682 13.2709 4.54229 13.0442C4.55734 12.8237 4.58435 12.7163 4.61362 12.6456C4.72985 12.365 4.95279 12.1421 5.23339 12.0259C5.3219 11.9892 5.45989 11.9588 5.78705 11.9466C6.51297 11.9194 7.21191 11.5448 7.59598 10.8796C7.98009 10.2144 7.95511 9.42168 7.61564 8.77938C7.46269 8.48999 7.42003 8.35531 7.40752 8.26033C7.36788 7.95921 7.44948 7.65467 7.63437 7.41371C7.68095 7.35302 7.76044 7.27594 7.94391 7.15264C8.13252 7.02588 8.3859 6.87917 8.76372 6.66103C9.14154 6.4429 9.39529 6.29682 9.59936 6.19686C9.79788 6.09962 9.90438 6.06932 9.98023 6.05933C10.2814 6.01969 10.5859 6.10129 10.8268 6.28618C10.9029 6.34451 10.9982 6.44882 11.1724 6.72606C11.5588 7.34113 12.2328 7.75908 13.0008 7.75908C13.7689 7.75909 14.4428 7.34114 14.8293 6.72606C15.0035 6.44882 15.0988 6.34452 15.1748 6.28619C15.4157 6.1013 15.7203 6.0197 16.0214 6.05934Z"
            className={`fill-white group-hover:fill-${bgColor}Hover group-active:fill-white`}
          />
        </svg>
      </button>
    );
    return (
      <div>
        <h1 className="mb-4 flex items-center gap-4 text-[26px] font-extrabold leading-8 md:max-w-[350px] md:text-4xl lg:max-w-none lg:text-5xl xl:text-6xl">
          {journey?.name}
          {isAdmin && !editingJourneyMode && <EditSpaceBtn />}
        </h1>
        <p className="mb-8 font-medium md:min-h-[57px] lg:min-h-[100px]">
          {`Complete quests to get NFT reward. ${journey?.description}`}
        </p>
      </div>
    );
  };
  const JourneyImage = () => (
    <div className="relative mb-6 h-[200px] w-[200px] md:h-[160px] md:w-[160px] lg:h-[177px] lg:w-[177px] xl:h-[200px] xl:w-[200px]">
      {journey && (
        <Image
          src={journey.reward_image_url}
          alt={"company logo"}
          fill
          className="rounded-full object-cover"
        />
      )}
    </div>
  );
  const QuestCount = () => (
    <div className="flex flex-col items-center justify-center">
      <p className="text-3xl font-extrabold">
        {quests && quests.length > 0 ? `${journey?.total_completed}/${quests?.length}` : "0"}
      </p>
      <p className="text-xl font-medium">quest</p>
    </div>
  );
  const ClaimButtonAndInfo = () => (
    <div className="text-right md:flex md:items-center md:gap-4 md:text-center lg:flex-col">
      <Button btnType="button" variant="default-purple" className="mb-2 md:mb-0">
        Claim NFT
      </Button>
      <p className="font-medium leading-5 md:max-w-[110px] lg:max-w-none">
        2 quests left for claiming
      </p>
    </div>
  );
  const AddQuestButton = () => (
    <Link href={`/spaces/${spaceAddress}/create-quest`}>
      <div className="flex min-h-[130px] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-grayColor text-white hover:border-white">
        <Image src={PlusIcon} alt="plus logo" width={20} height={20} />
        <p className="text-xl font-medium">Add quest</p>
      </div>
    </Link>
  );
  const NoQuests = () => (
    <div className="flex items-center justify-center text-lg font-medium">
      <p>{`There are no quests in the ${journey?.name ?? "Journey"} yet`}</p>
    </div>
  );
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
      {quests && quests.length > 0 ? (
        <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
          {editingJourneyMode && <AddQuestButton />}
          {quests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              editingJourneyMode={editingJourneyMode}
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
      )}
      {editingJourneyMode && (
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
      )}
      <QuestDialog
        selectedQuest={selectedQuest!}
        isQuestOpened={isQuestOpened}
        setQuestOpened={setQuestOpened}
      />
      <RemoveQuestDialog
        selectedQuest={selectedQuest!}
        isQuestRemoving={isQuestRemoving}
        removeQuest={removeQuest}
        setRemovingQuest={setRemovingQuest}
      />
    </Container>
  );
};
