import { useEffect, useState } from "react";
import { handleSetBatchIdStake, ICapy, IStakingTicket } from "types";
import { ethos, EthosConnectStatus } from "ethos-connect";
import Image from "next/image";
import { AnalyticsCategory, AnalyticsEvent, classNames, handleAnalyticsClick } from "utils";
import {
  BlueMoveButton,
  Container,
  NoConnectWallet,
  ObjectDetailDialog,
  PointsBanner,
  ProjectCard,
  RulesDialog,
  SkeletonStakingProjectCard,
  StakingRules,
  UnstakeDetailDialog,
  Button,
} from "components";
import classnames from "classnames";
import { Montserrat } from "next/font/google";
import {
  claimBatchPoints,
  claimPoints,
  fetchCapyAndStaking,
  fetchHolaPoints,
  fetchTotalStaked,
  stakeBatchCapy,
  stakeOneCapy,
  unstakeBatchCapy,
  unstakeCapy,
} from "./StakingProviderFunction";
import { ButtonBatchText } from "../../types/buttonTextType";

const font_montserrat = Montserrat({ subsets: ["latin"] });
export const StakingLayout = () => {
  const { wallet, status } = ethos.useWallet();

  // NFT states
  const [frens, setFrens] = useState<ICapy[] | null>();
  const [stakedFrens, setStakedFrens] = useState<IStakingTicket[] | null>();
  // General data
  const [totalStaked, setTotalStaked] = useState(0);
  const [totalMyPointsOnchain, setTotalMyPointsOnchain] = useState(0);
  const [availablePointsToClaim, setAvailablePointsToClaim] = useState(0);
  // Dialog states
  const [selectedFrend, setSelectedFrend] = useState<ICapy>();
  const [selectedStaked, setSelectedStaked] = useState<IStakingTicket>();
  const [openedFrend, setOpenedFrend] = useState(false);
  const [openedUnstaked, setOpenedUnstaked] = useState(false);
  const [openRules, setOpenRules] = useState(false);
  const [waitSui, setWaitSui] = useState(false);

  // Batch Staking states
  const [batchStakeMode, setBatchStakeMode] = useState(false);
  const [batchIdStake, setBatchIdStake] = useState<string[]>([]);
  const [batchUnstakeMode, setBatchUnstakeMode] = useState(false);
  const [batchIdUnstake, setBatchIdUnstake] = useState<string[]>([]);

  // State for local storage
  const [isSomethingChange, setIsSomethingChange] = useState(false);

  useEffect(() => {
    if (wallet) fetchCapyAndStaking(wallet, setFrens, setStakedFrens).then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  useEffect(() => {
    if (wallet && stakedFrens) {
      fetchTotalStaked(wallet, setTotalStaked).then();
      fetchHolaPoints(
        wallet,
        stakedFrens,
        setAvailablePointsToClaim,
        setTotalMyPointsOnchain,
      ).then();
    }
  }, [waitSui, wallet?.contents?.nfts, stakedFrens]);

  function handleBatchStakeAll() {
    if (frens !== null && frens !== undefined) {
      const frensIds = frens.map((capy) => capy.id);
      setBatchIdStake(frensIds);
      setBatchStakeMode(true);
    }
  }

  function handleCancelStaking() {
    setBatchIdStake([]);
    setBatchStakeMode(false);
  }

  function handleBatchUnstakeAll() {
    if (stakedFrens !== null && stakedFrens !== undefined) {
      const stakedFrensIds = stakedFrens.map((capy) => capy.id);
      setBatchIdUnstake(stakedFrensIds);
      setBatchUnstakeMode(true);
    }
  }
  function handleCancelUnstaking() {
    setBatchIdUnstake([]);
    setBatchUnstakeMode(false);
  }

  const SuifrensCard = ({ capy, batchMode }: { capy: ICapy; batchMode: boolean }) => {
    return (
      <button
        onClick={() => {
          batchMode
            ? handleSetBatchIdStake(capy.id, batchIdStake, setBatchIdStake)
            : setOpenedFrend(true);
          setSelectedFrend(capy);
        }}
        className={classNames(
          "proposal-card-shadow relative min-h-[186px] rounded-xl bg-white p-4 hover:border-2 hover:border-blackColor hover:bg-white sm:min-h-[248px] lg:min-h-[300px]",
          batchMode
            ? batchIdStake.includes(capy.id)
              ? "border-2 border-yellowColor"
              : "border-[1px] border-black2Color"
            : "border-[1px] border-black2Color",
        )}
      >
        <Image src={capy.url} alt={capy.id} fill={true} className="rounded-xl object-contain" />
      </button>
    );
  };

  const StakedTicketCard = ({
    staking,
    batchMode,
  }: {
    staking: IStakingTicket;
    batchMode: boolean;
  }) => {
    return (
      <button
        onClick={() => {
          batchMode
            ? handleSetBatchIdStake(staking.id, batchIdUnstake, setBatchIdUnstake)
            : setOpenedUnstaked(true);
          setSelectedStaked(staking);
        }}
        className={classNames(
          "proposal-card-shadow relative min-h-[186px] rounded-xl bg-white p-4 hover:border-2 hover:border-blackColor hover:bg-white sm:min-h-[248px] lg:min-h-[300px]",
          batchMode
            ? batchIdUnstake.includes(staking.id)
              ? "border-2 border-pinkColor"
              : "rounded-xl border-[1px] border-black2Color"
            : "rounded-xl border-[1px] border-black2Color",
        )}
      >
        <Image
          src={staking.url}
          alt={staking.id}
          fill={true}
          className="rounded-xl object-contain"
        />
      </button>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Staking!"} />
  ) : (
    <Container className="font-inter">
      {stakedFrens ? (
        <ProjectCard
          availablePointsToClaim={availablePointsToClaim}
          setOpenRules={setOpenRules}
          stakedList={stakedFrens}
          totalHolaPointsOnchain={totalMyPointsOnchain}
          totalStaked={totalStaked}
        />
      ) : (
        <SkeletonStakingProjectCard />
      )}
      {availablePointsToClaim > 100 && stakedFrens && (
        <PointsBanner
          availablePointsToClaim={availablePointsToClaim}
          functionToClaimPoints={async () => {
            await handleAnalyticsClick({
              event_main: AnalyticsEvent.claimAllPoints,
              page: AnalyticsCategory.staking,
            });
            await claimBatchPoints(
              stakedFrens.map((capy) => capy.id),
              wallet,
              setWaitSui,
              setBatchIdUnstake,
              setBatchUnstakeMode,
              setOpenedFrend,
            );
          }}
        />
      )}
      <div className="text my-10 md:mt-[50px] lg:mb-[50px] xl:mb-[70px] xl:mt-[70px]">
        <div className="flex flex-col flex-wrap justify-between md:flex-row md:items-center">
          <h1 className={classNames("text-[26px] font-extrabold text-blackColor lg:text-3xl")}>
            My NFTs
          </h1>
          {frens?.length !== 0 && (
            <>
              {batchStakeMode && (
                <div className="order-last mt-4 w-full text-sm font-medium text-black2Color  md:mb-0 xl:order-none xl:mt-0 xl:w-auto">
                  {batchIdStake.length === 0 ? (
                    "Select capy for staking"
                  ) : (
                    <StakingRules isStakingDialog={false} />
                  )}
                </div>
              )}
              <div className="mt-4 flex gap-4 md:mt-0 md:items-center md:gap-5">
                <Button
                  btnType="button"
                  variant="button-secondary-yellow"
                  size="sm-full"
                  onClick={() => {
                    batchStakeMode ? handleCancelStaking() : setBatchStakeMode(true);
                  }}
                >
                  {batchStakeMode ? ButtonBatchText.cancel : ButtonBatchText.stake}
                </Button>
                {(!batchStakeMode || batchIdStake.length > 0) && (
                  <Button
                    btnType="button"
                    variant="button-primary-yellow"
                    size="sm-full"
                    onClick={() => {
                      batchStakeMode
                        ? stakeBatchCapy(
                            batchIdStake,
                            wallet,
                            setWaitSui,
                            setOpenedFrend,
                            setBatchIdStake,
                            setBatchStakeMode,
                          )
                        : handleBatchStakeAll();
                    }}
                  >
                    {batchIdStake.length === 0 ? ButtonBatchText.stakeAll : ButtonBatchText.confirm}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        {frens?.length !== 0 ? (
          <div
            className={
              "mt-5 grid grid-cols-2 gap-4 md:mt-6 md:grid-cols-3 md:gap-10 xl:grid-cols-4"
            }
          >
            {frens?.map((capy) => (
              <SuifrensCard capy={capy} key={capy.id} batchMode={batchStakeMode} />
            ))}
          </div>
        ) : (
          <>
            {stakedFrens?.length !== 0 ? (
              <div className="mt-8 text-center">
                <div
                  className={classNames(
                    font_montserrat.className,
                    "text-lg font-medium text-black2Color",
                  )}
                >
                  All your capies are staked
                </div>
                <BlueMoveButton text={"Get one more capy on"} />
              </div>
            ) : (
              <div className={classNames("mt-8 text-center", font_montserrat.className)}>
                <div className={classNames("text-lg font-medium text-black2Color")}>
                  Sorry, SuiFrens hasn’t yet added NFTs for staking
                </div>
                <BlueMoveButton text={"Get one Capy on"} />
              </div>
            )}
          </>
        )}
      </div>
      {stakedFrens?.length !== 0 && (
        <>
          <div className="flex flex-col flex-wrap justify-between md:flex-row md:items-center">
            <h1 className={classnames("text-[26px] font-extrabold text-blackColor lg:text-3xl")}>
              My Staked NFTs
            </h1>
            {batchUnstakeMode && (
              <div className="order-last mt-4 w-full text-sm font-medium text-black2Color  md:mb-0 xl:order-none xl:mt-0 xl:w-auto">
                {batchIdUnstake.length === 0 ? (
                  "Select capy for unstaking"
                ) : (
                  <StakingRules isStakingDialog={false} />
                )}
              </div>
            )}
            <div className="mt-4 flex gap-4 md:mt-0 md:items-center md:gap-5">
              <Button
                btnType="button"
                variant="button-secondary-pink"
                size="sm-full"
                onClick={() => {
                  batchUnstakeMode ? handleCancelUnstaking() : setBatchUnstakeMode(true);
                }}
              >
                {batchUnstakeMode ? ButtonBatchText.cancel : ButtonBatchText.batchUnstake}
              </Button>
              {(!batchUnstakeMode || batchIdUnstake.length > 0) && (
                <Button
                  btnType="button"
                  variant="button-primary-pink"
                  size="sm-full"
                  onClick={() => {
                    batchUnstakeMode
                      ? unstakeBatchCapy(
                          batchIdUnstake,
                          wallet,
                          setWaitSui,
                          setBatchIdUnstake,
                          setBatchUnstakeMode,
                          setOpenedFrend,
                        )
                      : handleBatchUnstakeAll();
                  }}
                >
                  {batchIdUnstake.length === 0
                    ? ButtonBatchText.unstakeAll
                    : ButtonBatchText.confirm}
                </Button>
              )}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-10 xl:grid-cols-4">
            {stakedFrens?.map((stack) => (
              <StakedTicketCard staking={stack} key={stack.id} batchMode={batchUnstakeMode} />
            ))}
          </div>
        </>
      )}
      <p className={classNames("mt-12  text-sm font-light", font_montserrat.className)}>
        SuiFrens by Mysten Labs CC BY 4.0 license
      </p>
      <ObjectDetailDialog
        openedFrend={openedFrend}
        waitSui={waitSui}
        selectedFrend={selectedFrend}
        setOpenedFrend={setOpenedFrend}
        stakeFunction={() =>
          stakeOneCapy(selectedFrend!, wallet, setWaitSui, setOpenedFrend).then()
        }
      />
      <UnstakeDetailDialog
        selectedStaked={selectedStaked}
        openDialog={openedUnstaked}
        setOpenDialog={setOpenedUnstaked}
        claimPointsFunction={() =>
          claimPoints(selectedStaked!, wallet, setWaitSui, setOpenedUnstaked).then()
        }
        unstakeCapyFunction={() =>
          unstakeCapy(selectedStaked!, wallet, setWaitSui, setOpenedUnstaked).then()
        }
        waitSui={waitSui}
      />
      <RulesDialog setOpenRules={setOpenRules} openRules={openRules} />
    </Container>
  );
};
