import { useEffect, useState } from "react";
import { handleSetBatchIdStake, ICapy, IStakingTicket } from "types";
import { ethos, EthosConnectStatus } from "ethos-connect";
import Image from "next/image";
import { classNames } from "utils";
import {
  BlueMoveButton,
  NoConnectWallet,
  ObjectDetailDialog,
  ProjectCard,
  RulesDialog,
  StakingRules,
  UnstakeDetailDialog,
  Container,
  SkeletonStakingProjectCard,
} from "components";
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

  // Data states
  const [frens, setFrens] = useState<ICapy[] | null>();
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

  const SuifrensCard = ({ capy, batchMode }: { capy: ICapy; batchMode: boolean }) => {
    return (
      <button
        onClick={() => {
          batchMode
            ? handleSetBatchIdStake(capy.id, batchIdStake, setBatchIdStake)
            : setOpenedFrend(true);
          setSelectedFrend(capy);
        }}
      >
        <div
          className={classNames(
            "flex flex-col items-center gap-2 rounded-xl border-2 bg-[#FFFFFF] py-8",
            batchMode
              ? batchIdStake.includes(capy.id)
                ? "border-yellowColor"
                : "border-black2Color"
              : "border-[#FFFFFF]",
          )}
        >
          <div className="relative">
            <div className="h-40 w-40">
              <Image src={capy.url} alt={capy.id} fill={true} />
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
              <Image src={staking.url} alt={staking.id} fill={true} className="rounded-md" />
            </div>
          </div>
        </div>
      </button>
    );
  };
  // TODO: need to check claim batch points function
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Staking!"} />
  ) : (
    <Container>
      {stakedFrens ? (
        <ProjectCard
          availablePointsToClaim={availablePointsToClaim}
          setOpenRules={setOpenRules}
          claimPointsFunction={() =>
            claimBatchPoints(
              batchIdUnstake,
              wallet,
              setWaitSui,
              setBatchIdUnstake,
              setBatchUnstakeMode,
              setOpenedFrend,
            )
          }
          stakedList={stakedFrens}
          totalHolaPointsOnchain={totalMyPointsOnchain}
          totalStaked={totalStaked}
        />
      ) : (
        <SkeletonStakingProjectCard />
      )}

      {stakedFrens?.length !== 0 && (
        <>
          <div className="flex justify-between">
            <h1
              className={classNames(
                "mt-8 text-xl font-semibold text-black2Color md:text-4xl",
                font_montserrat.className,
              )}
            >
              My Staked Frens
            </h1>
            <div className="md:flex">
              <p
                className={classNames(
                  "mt-9 w-full text-xs font-normal md:mt-10 md:px-4 md:text-sm",
                )}
              >
                {batchUnstakeMode ? (
                  batchIdUnstake.length === 0 ? (
                    "Select capy for unstaking"
                  ) : (
                    <div className="-mt-1">
                      <StakingRules />
                    </div>
                  )
                ) : null}
              </p>
              <button
                className={classNames(
                  "w-full min-w-[220px] rounded-xl border-2 border-pinkColor bg-white px-3 py-4 text-sm text-pinkColor hover:border-transparent hover:bg-[#cc5480] hover:text-gray-50 md:mt-8 md:px-8 md:py-2 md:text-lg",
                )}
                onClick={() => {
                  batchUnstakeMode
                    ? batchIdUnstake.length === 0
                      ? setBatchUnstakeMode(false)
                      : unstakeBatchCapy(
                          batchIdUnstake,
                          wallet,
                          setWaitSui,
                          setBatchIdUnstake,
                          setBatchUnstakeMode,
                          setOpenedFrend,
                        )
                    : setBatchUnstakeMode(true);
                }}
              >
                {batchUnstakeMode ? (
                  batchIdUnstake.length === 0 ? (
                    ButtonBatchText.cancel
                  ) : (
                    ButtonBatchText.confirm
                  )
                ) : (
                  <p>Batch Unstaking</p>
                )}
              </button>
            </div>
          </div>
          <div className={"mt-8 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-10"}>
            {stakedFrens?.map((stack) => (
              <StakedTicketCard staking={stack} key={stack.id} batchMode={batchUnstakeMode} />
            ))}
          </div>
        </>
      )}

      <div className="flex justify-between">
        <h1
          className={classNames(
            "mt-8 text-xl font-semibold text-black2Color md:text-4xl",
            font_montserrat.className,
          )}
        >
          My Frens
        </h1>
        {frens?.length !== 0 ? (
          <>
            <div className="md:flex">
              <p
                className={classNames(
                  "mt-9 w-full text-xs font-normal md:mt-10 md:px-4 md:text-sm",
                )}
              >
                {batchStakeMode ? (
                  batchIdStake.length === 0 ? (
                    "Select capy for staking"
                  ) : (
                    <div className="-mt-1">
                      <StakingRules />
                    </div>
                  )
                ) : null}
              </p>
              <button
                className={classNames(
                  "w-full rounded-xl border-2 border-yellowColor bg-white px-3 py-4 text-sm text-yellowColor hover:border-transparent hover:bg-yellowColor hover:text-gray-50 md:mt-8 md:min-w-[220px] md:px-8 md:py-2 md:text-lg",
                )}
                onClick={() => {
                  batchStakeMode
                    ? batchIdStake.length === 0
                      ? setBatchStakeMode(false)
                      : stakeBatchCapy(
                          batchIdStake,
                          wallet,
                          setWaitSui,
                          setOpenedFrend,
                          setBatchIdStake,
                          setBatchStakeMode,
                        )
                    : setBatchStakeMode(true);
                }}
              >
                {batchStakeMode
                  ? batchIdStake.length === 0
                    ? ButtonBatchText.cancel
                    : ButtonBatchText.confirm
                  : ButtonBatchText.stake}
              </button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {frens?.length !== 0 ? (
        <div className={"mt-8 grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-10"}>
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
                  "text-2xl font-semibold text-black2Color md:text-4xl",
                )}
              >
                All your capies are staked
              </div>
              <BlueMoveButton text={"Get one more capy on"} />
            </div>
          ) : (
            <div className={classNames("mt-8 text-center", font_montserrat.className)}>
              <div className={classNames("text-4xl font-semibold text-black2Color")}>
                You don't have capy :(
              </div>
              <BlueMoveButton text={"Get one Capy on"} />
            </div>
          )}
        </>
      )}
      <p className={classNames("mb-12 mt-12 text-sm font-light", font_montserrat.className)}>
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
