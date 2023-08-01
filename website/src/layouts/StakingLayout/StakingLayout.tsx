import { useEffect, useState } from "react";
import { handleSetBatchIdStake, ICapy, IStakingTicket } from "types";
import {
  fetchCapyStaking,
  fetchStakingTickets,
  signTransactionClaimPoints,
  signTransactionEndStaking,
  signTransactionStartStaking,
  singTransactionsToBatchClaimPoints,
  singTransactionsToBatchStartStaking,
  singTransactionsToBatchUnstaking,
  suiProvider,
} from "services/sui";
import { ethos, EthosConnectStatus } from "ethos-connect";
import Image from "next/image";
import { classNames, FRENS_STAKING_POOL_ID, FRENS_STAKING_POOL_POINTS_TABLE_ID } from "utils";
import {
  AlertErrorMessage,
  AlertSucceed,
  BlueMoveButton,
  NoConnectWallet,
  ObjectDetailDialog,
  ProjectCard,
  RulesDialog,
  StakingRules,
  UnstakeDetailDialog,
  Container,
  PointsBanner,
} from "components";
import classnames from "classnames";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { Montserrat } from "next/font/google";

const font_montserrat = Montserrat({ subsets: ["latin"] });
export const StakingLayout = () => {
  const { wallet, status } = ethos.useWallet();

  // Data states
  const [frens, setFrens] = useState<ICapy[] | null>(null);
  const [stakedFrens, setStakedFrens] = useState<IStakingTicket[] | null>();
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

  useEffect(() => {
    async function fetchWalletFrens() {
      if (!wallet?.address) {
        setFrens(null);
        setStakedFrens(null);
        return;
      }
      try {
        const nfts = wallet?.contents?.nfts!;
        const suifrens = fetchCapyStaking(nfts);
        if (suifrens) setFrens(suifrens);
        const stakingTickets = fetchStakingTickets(nfts);
        setStakedFrens(stakingTickets);

        if (stakingTickets) {
          Promise.all(
            stakingTickets.map(async (staked) => {
              const response = await suiProvider.getObject({
                id: staked?.nft_id!,
                options: { showDisplay: true },
              });
              staked.url = (response.data?.display?.data! as Record<string, string>)?.image_url!;
            }),
          ).then(() => setStakedFrens(stakingTickets));
        }
      } catch (e) {
        console.error(e);
      }
    }

    fetchWalletFrens().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

  useEffect(() => {
    async function fetchTotalStaked() {
      if (!wallet?.address) {
        return;
      }
      try {
        const response = await suiProvider.getObject({
          id: FRENS_STAKING_POOL_ID!,
          options: { showContent: true },
        });
        const fields = getObjectFields(response);
        setTotalStaked(fields?.staked || 0);
      } catch (e) {
        setTotalStaked(0);
      }
    }

    async function fetchMyPoints() {
      if (!wallet?.address) {
        return;
      }
      try {
        const response = await suiProvider.getDynamicFieldObject({
          parentId: FRENS_STAKING_POOL_POINTS_TABLE_ID!,
          name: {
            type: "address",
            value: wallet.address,
          },
        });
        const fields = getObjectFields(response);

        const now = Date.now();

        const onchainPoints: number = +fields?.value || 0;
        const stakedPoints =
          stakedFrens
            ?.map((staked) => {
              return Math.floor((now - staked.start_time) / 60_000);
            })
            .reduce((a, b) => a + b, 0) || 0;
        setAvailablePointsToClaim(stakedPoints);
        setTotalMyPointsOnchain(onchainPoints);
      } catch (e) {
        console.error(e);
      }
    }

    fetchTotalStaked().then();
    fetchMyPoints().then();
  }, [waitSui, wallet?.contents?.nfts, stakedFrens]);

  async function stakeCapy(capy: ICapy) {
    if (!wallet || !capy) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionStartStaking(capy.id),
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
        AlertSucceed("Staking");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);
    }
  }
  // TODO::for layout create business logic
  async function stakeBatchCapy(capy_batch: string[]) {
    if (!wallet || !capy_batch) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: singTransactionsToBatchStartStaking(capy_batch),
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
        AlertSucceed("Staking");
        // remove batched capys from the list if success
        setBatchIdStake([]);
        setBatchStakeMode(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);
      //setBatchIdStake([]);
    }
  }

  async function unstakeCapy(ticket: IStakingTicket) {
    if (!wallet || !ticket) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionEndStaking(ticket.id),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Unstaking");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedUnstaked(false);
    }
  }

  async function unstakeBatchCapy(capy_batch: string[]) {
    if (!wallet || !capy_batch) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: singTransactionsToBatchUnstaking(capy_batch),
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
        AlertSucceed("Unstaking");
        // remove batched capys from the list if success
        setBatchIdUnstake([]);
        setBatchUnstakeMode(false);
        // setOpenedUnstaked
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);

      //setBatchIdStake([]);
    }
  }

  async function claimPoints(ticket: IStakingTicket) {
    if (!wallet || !ticket) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionClaimPoints(ticket.id),
        options: {
          showEffects: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("Claim");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedUnstaked(false);
    }
  }

  async function claimBatchPoints(capy_batch: string[]) {
    if (!wallet || !capy_batch) return;

    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: singTransactionsToBatchClaimPoints(capy_batch),
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
        AlertSucceed("Claim");
        // remove batched capys from the list if success
        setBatchIdUnstake([]);
        setBatchUnstakeMode(false);
        // setOpenedUnstaked
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
      setOpenedFrend(false);

      //setBatchIdStake([]);
    }
  }

  function handleBatchStakeAll() {
    if (frens !== null) {
      const frensIds = frens.map((capy) => capy.id);
      setBatchIdStake(frensIds);
      setBatchStakeMode(true);
    }
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
          "proposal-card-shadow min-h-[186px] max-w-[166px] rounded-xl border-2 border-blackColor bg-white hover:bg-white sm:min-h-[248px] sm:max-w-[216px] lg:min-h-[300px] lg:max-w-[268px]",
          batchMode
            ? batchIdStake.includes(capy.id)
              ? "border-yellowColor"
              : "border-black2Color"
            : "border-[#FFFFFF]",
        )}
      >
        <div className="my-auto flex flex-col items-center gap-2 rounded-xl bg-[#FFFFFF]">
          <div className="relative">
            <div className="h-40 w-40">
              <Image src={capy.url} alt={capy.description} fill={true} />
            </div>
          </div>
        </div>
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
      >
        <div
          className={classNames(
            "flex flex-col items-center gap-2 rounded-xl border-2 bg-white py-8",
            batchMode
              ? batchIdUnstake.includes(staking.id)
                ? "border-pinkColor"
                : "border-black2Color"
              : "border-white",
          )}
        >
          <div className="relative">
            <div className={"h-40 w-40"}>
              <Image src={staking.url} alt={"staking"} fill={true} className="rounded-md" />
            </div>
          </div>
        </div>
      </button>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Staking!"} />
  ) : (
    <Container className="font-inter">
      {stakedFrens && (
        <ProjectCard
          availablePointsToClaim={availablePointsToClaim}
          setOpenRules={setOpenRules}
          claimPointsFunction={claimBatchPoints}
          stakedList={stakedFrens}
          totalHolaPointsOnchain={totalMyPointsOnchain}
          totalStaked={totalStaked}
        />
      )}
      <PointsBanner availablePointsToClaim={availablePointsToClaim} />
      <div className="my-10 md:mt-[50px] lg:mb-[50px] xl:mb-[70px] xl:mt-[70px]">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <h1 className={classNames("text-[26px] font-extrabold text-blackColor lg:text-3xl")}>
            My NFTs
          </h1>
          {frens?.length !== 0 && (
            <div className="mt-4 md:mt-0 md:flex">
              {/* TODO: REMOVE OR REWORK */}
              <p
                className={classnames(
                  "mb-2 w-full text-sm font-normal md:mb-0 md:px-4 md:text-sm",
                  {
                    hidden: !batchStakeMode,
                  },
                )}
              >
                {batchStakeMode ? (
                  batchIdStake.length === 0 ? (
                    "Select capy for staking"
                  ) : (
                    <StakingRules />
                  )
                ) : null}
              </p>
              <div className="flex gap-4 md:gap-5">
                <button
                  className={classNames(
                    "button-shadow button-shadow:active max-h-[48px]  min-h-[48px] w-full rounded-xl border-2 border-yellowColor bg-white text-lg font-semibold text-yellowColor hover:border-transparent hover:bg-yellowColor hover:text-gray-50 md:min-w-[176px]",
                  )}
                  onClick={() => {
                    batchStakeMode
                      ? batchIdStake.length === 0
                        ? setBatchStakeMode(false)
                        : stakeBatchCapy(batchIdStake)
                      : setBatchStakeMode(true);
                  }}
                >
                  {batchStakeMode
                    ? batchIdStake.length === 0
                      ? "Cancel"
                      : "Confirm"
                    : "Batch Staking"}
                </button>
                {/* TODO: Change to "stake all" button. Now it's example */}
                {!batchStakeMode && (
                  <button
                    className={classNames(
                      "button-shadow button-shadow:active max-h-[48px]  min-h-[48px] w-full rounded-xl border-2 border-blackColor bg-yellowColor text-lg font-semibold text-white hover:bg-white hover:text-yellowColor md:min-w-[176px]",
                    )}
                    onClick={() => {
                      batchStakeMode
                        ? batchIdStake.length === 0
                          ? setBatchStakeMode(false)
                          : stakeBatchCapy(batchIdStake)
                        : handleBatchStakeAll();
                    }}
                  >
                    {batchStakeMode
                      ? batchIdStake.length === 0
                        ? "Cancel"
                        : "Confirm"
                      : "Stake all"}
                  </button>
                )}
              </div>
            </div>
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
          <div className="flex items-center justify-between">
            <h1 className={classnames("text-[26px] font-extrabold text-blackColor lg:text-3xl")}>
              My Staked NFTs
            </h1>
            <div className="md:flex">
              <p
                className={classnames("mt-9 w-full text-xs font-normal md:mt-10 md:px-4", {
                  hidden: !batchStakeMode,
                })}
              >
                {batchUnstakeMode ? (
                  batchIdUnstake.length === 0 ? (
                    "Select capy for unstaking"
                  ) : (
                    <StakingRules />
                  )
                ) : null}
              </p>
              <button
                className={classNames(
                  "button-shadow button-shadow:active max-h-[48px] min-h-[48px] min-w-[176px] rounded-xl border-2 border-pinkColor bg-white text-center align-middle text-lg font-semibold text-pinkColor hover:border-transparent hover:bg-pinkColor hover:text-white",
                )}
                onClick={() => {
                  batchUnstakeMode
                    ? batchIdUnstake.length === 0
                      ? setBatchUnstakeMode(false)
                      : unstakeBatchCapy(batchIdUnstake)
                    : setBatchUnstakeMode(true);
                }}
              >
                {batchUnstakeMode ? (
                  batchIdUnstake.length === 0 ? (
                    "Cancel"
                  ) : (
                    "Confirm"
                  )
                ) : (
                  <p>Batch Unstaking</p>
                )}
              </button>
            </div>
          </div>
          <div className={"mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-10 xl:grid-cols-4"}>
            {stakedFrens?.map((stack) => (
              <StakedTicketCard staking={stack} key={stack.id} batchMode={batchUnstakeMode} />
            ))}
          </div>
        </>
      )}
      <p className={classNames("mt-12 text-sm font-light", font_montserrat.className)}>
        SuiFrens by Mysten Labs CC BY 4.0 license
      </p>
      <ObjectDetailDialog
        openedFrend={openedFrend}
        waitSui={waitSui}
        selectedFrend={selectedFrend}
        setOpenedFrend={setOpenedFrend}
        stakeFunction={() => stakeCapy(selectedFrend!).then()}
      />
      <UnstakeDetailDialog
        selectedStaked={selectedStaked}
        openDialog={openedUnstaked}
        setOpenDialog={setOpenedUnstaked}
        claimPointsFunction={claimPoints}
        unstakeCapyFunction={unstakeCapy}
        waitSui={waitSui}
      />
      <RulesDialog setOpenRules={setOpenRules} openRules={openRules} />
    </Container>
  );
};
