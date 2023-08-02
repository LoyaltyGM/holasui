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
import { Wallet } from "ethos-connect";
import { CookiesStaking, ICapy, IStakingTicket, LocalStorageStaking } from "types";
import { Dispatch, SetStateAction } from "react";
import { FRENS_STAKING_POOL_ID, FRENS_STAKING_POOL_POINTS_TABLE_ID } from "utils";
import { getExecutionStatus, getExecutionStatusError, getObjectFields } from "@mysten/sui.js";
import { AlertErrorMessage, AlertSucceed } from "../../components";
import Cookies from "js-cookie";

// fetch capy and staking nft from wallet
export async function fetchCapyAndStaking(
  wallet: Wallet,
  setFrens: Dispatch<SetStateAction<ICapy[] | null | undefined>>,
  setStakedFrens: Dispatch<SetStateAction<IStakingTicket[] | null | undefined>>,
) {
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

    // images for staked frens
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

// total staked capy
export async function fetchTotalStaked(
  wallet: Wallet,
  setTotalStaked: Dispatch<SetStateAction<number>>,
) {
  if (!wallet?.address) {
    return;
  }
  // Try to load from cookies first
  const cookieValue = Cookies.get(CookiesStaking.totalStaked);
  if (cookieValue) {
    setTotalStaked(Number(cookieValue));
    return;
  }
  try {
    const response = await suiProvider.getObject({
      id: FRENS_STAKING_POOL_ID!,
      options: { showContent: true },
    });

    const fields = getObjectFields(response);
    const totalStaked = fields?.staked || 0;
    setTotalStaked(totalStaked);

    // Store in cookies for 24 hours
    Cookies.set(CookiesStaking.totalStaked, totalStaked.toString(), { expires: 1 });
  } catch (e) {
    setTotalStaked(0);
  }
}

// total points for user
export async function fetchHolaPoints(
  wallet: Wallet,
  stakedFrens: IStakingTicket[],
  setAvailablePointsToClaim: Dispatch<SetStateAction<number>>,
  setTotalMyPointsOnchain: Dispatch<SetStateAction<number>>,
) {
  if (!wallet?.address) {
    return;
  }

  // Get the stored data
  const storedData = JSON.parse(localStorage.getItem(LocalStorageStaking.holaPoints) || "{}");
  const { storedAddress, storedPoints, storedTimestamp, storedOnchainPoints } = storedData;

  // If the stored data is for the current wallet address and is less than 30 minutes old, use it
  if (
    storedAddress === wallet.address &&
    storedTimestamp &&
    Date.now() - storedTimestamp < 30 * 60 * 1000
  ) {
    setAvailablePointsToClaim(storedPoints);
    setTotalMyPointsOnchain(storedOnchainPoints);
    return;
  }

  // Otherwise, fetch the data from the server
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

    // Store the data in localStorage for future use
    localStorage.setItem(
      LocalStorageStaking.holaPoints,
      JSON.stringify({
        storedAddress: wallet.address,
        storedPoints: stakedPoints,
        storedOnchainPoints: onchainPoints,
        storedTimestamp: Date.now(),
      }),
    );
  } catch (e) {
    console.error(e);
  }
}

// staking only one capy
export async function stakeOneCapy(
  capy: ICapy,
  wallet: Wallet | undefined,
  setWaitSui: Dispatch<SetStateAction<boolean>>,
  setOpenedFrend: Dispatch<SetStateAction<boolean>>,
) {
  if (!wallet || !capy) return;

  setWaitSui(true);
  try {
    const response = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: signTransactionStartStaking(capy.id),
      options: {
        showEffects: true,
      },
    });

    const status = getExecutionStatus(response)?.status;

    if (status === "failure") {
      const error_status = getExecutionStatusError(response);
      if (error_status) AlertErrorMessage(error_status);
    } else if (status === "success") {
      AlertSucceed("Staking");
      // Remove total staked from cookies to call fetchTotalStaked again
      Cookies.remove(CookiesStaking.totalStaked);
      localStorage.removeItem(LocalStorageStaking.stakingTicketObject);
      localStorage.removeItem(LocalStorageStaking.capyObject);
    } else {
      console.log("Status is not success or failure");
    }
  } catch (e) {
    console.error(e);
  } finally {
    setWaitSui(false);
    setOpenedFrend(false);
  }
}

// staking batch of capys
export async function stakeBatchCapy(
  capy_batch: string[],
  wallet: Wallet | undefined,
  setWaitSui: Dispatch<SetStateAction<boolean>>,
  setOpenedFrend: Dispatch<SetStateAction<boolean>>,
  setBatchIdStake: Dispatch<SetStateAction<string[]>>,
  setBatchStakeMode: Dispatch<SetStateAction<boolean>>,
) {
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
      // Remove total staked from cookies to call fetchTotalStaked again
      Cookies.remove(CookiesStaking.totalStaked);
      localStorage.removeItem(LocalStorageStaking.stakingTicketObject);
      localStorage.removeItem(LocalStorageStaking.capyObject);
    }
  } catch (e) {
    console.error(e);
  } finally {
    setWaitSui(false);
    setOpenedFrend(false);
    //setBatchIdStake([]);
  }
}

// unstaking one capy
export async function unstakeCapy(
  ticket: IStakingTicket,
  wallet: Wallet | undefined,
  setWaitSui: Dispatch<SetStateAction<boolean>>,
  setOpenedUnstaked: Dispatch<SetStateAction<boolean>>,
) {
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
      // Remove total staked from cookies to call fetchTotalStaked again
      Cookies.remove(CookiesStaking.totalStaked);
      localStorage.removeItem(LocalStorageStaking.stakingTicketObject);
      localStorage.removeItem(LocalStorageStaking.capyObject);
    }
  } catch (e) {
    console.error(e);
  } finally {
    setWaitSui(false);
    setOpenedUnstaked(false);
  }
}

export async function unstakeBatchCapy(
  capy_batch: string[],
  wallet: Wallet | undefined,
  setWaitSui: Dispatch<SetStateAction<boolean>>,
  setBatchIdUnstake: Dispatch<SetStateAction<string[]>>,
  setBatchUnstakeMode: Dispatch<SetStateAction<boolean>>,
  setOpenedFrend: Dispatch<SetStateAction<boolean>>,
) {
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
      // Remove total staked from cookies to call fetchTotalStaked again
      Cookies.remove(CookiesStaking.totalStaked);
      localStorage.removeItem(LocalStorageStaking.stakingTicketObject);
      localStorage.removeItem(LocalStorageStaking.capyObject);
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

export async function claimPoints(
  ticket: IStakingTicket,
  wallet: Wallet | undefined,
  setWaitSui: Dispatch<SetStateAction<boolean>>,
  setOpenedUnstaked: Dispatch<SetStateAction<boolean>>,
) {
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

export async function claimBatchPoints(
  capy_batch: string[],
  wallet: Wallet | undefined,
  setWaitSui: Dispatch<SetStateAction<boolean>>,
  setBatchIdUnstake: Dispatch<SetStateAction<string[]>>,
  setBatchUnstakeMode: Dispatch<SetStateAction<boolean>>,
  setOpenedFrend: Dispatch<SetStateAction<boolean>>,
) {
  if (!wallet || !capy_batch) return;
  setWaitSui(true);
  try {
    const response = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: singTransactionsToBatchClaimPoints(capy_batch),
      options: {
        showEffects: true,
      },
    });
    console.log("Response", response);
    const status = getExecutionStatus(response);

    if (status?.status === "failure") {
      console.log(status.error);
      const error_status = getExecutionStatusError(response);
      if (error_status) AlertErrorMessage(error_status);
    } else {
      AlertSucceed("Claim");
      localStorage.removeItem(LocalStorageStaking.holaPoints);
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
