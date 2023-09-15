import { ethos, EthosConnectStatus } from "ethos-connect";
import React, { useEffect, useState } from "react";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { signTransactionCreateEscrow } from "services/sui";
import {
  AlertErrorMessage,
  AlertSucceed,
  Container,
  MyCollectionDialog,
  NoConnectWallet,
  RecipientCollectionDialog,
  SwapInformation,
  YourOfferLinkDialog,
} from "components";
import { TradeObjectType } from "types";
import {
  AnalyticsCategory,
  AnalyticsEvent,
  classNames,
  formatSuiAddress,
  handleAnalyticsClick,
} from "utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import ImageSuiToken from "/public/img/SuiToken.png";
import SecLogo from "/public/img/SecLogo.png";
import GithubLogo from "/public/img/GithubLogo.svg";

const SEC_3 =
  "https://github.com/LoyaltyGM/escrow-contract/blob/main/HolaSui_audit_final__swap_20230803.pdf";
const SWAP_DOCS =
  "https://holasui-dev.notion.site/P2P-Swap-Documentation-b39427def56a448d9fa6040848fac5fb?pvs=4";
const SWAP_GITHUB = "https://github.com/LoyaltyGM/escrow-contract";

export const SwapLayout = () => {
  const { wallet, status } = ethos.useWallet();
  const [waitSui, setWaitSui] = useState(false);

  const [swapType, setSwapType] = useState("");
  // offer dialog
  const [offerCreated, setOfferCreated] = useState(false);
  const [offerTransactionHash, setOfferTransactionHash] = useState<string>();

  // creator
  const [creatorObjectIds, setCreatorObjectIds] = useState<TradeObjectType[]>([]);
  const [creatorCoinAmount, setCreatorCoinAmount] = useState<number | null>(null);

  // recipient
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [recipientCoinAmount, setRecipientCoinAmount] = useState<number | null>(null);
  const [recipientObjectIds, setRecipientObjectIds] = useState<TradeObjectType[]>([]);

  // dialog wallets
  const [showReceivedNFT, setShowReceivedNFT] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  useEffect(() => {}, []);

  async function createOffer() {
    if (!wallet || !recipientAddress) return;
    console.log(swapType);
    setWaitSui(true);
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateEscrow({
          creator_coin_amount: creatorCoinAmount || 0,
          creator_objects: creatorObjectIds.map((obj) => obj.id),
          recipient: recipientAddress,
          recipient_coin_amount: recipientCoinAmount || 0,
          recipient_object_ids: recipientObjectIds.map((obj) => obj.id),
          type_swap: swapType,
        }),
        options: {
          showEffects: true,
          showEvents: true,
        },
      });

      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CreateOffer");
        setOfferCreated(true);
        setOfferTransactionHash(response?.events![0].parsedJson?.id);
        await handleAnalyticsClick({
          event_main: AnalyticsEvent.createOffer,
          page: AnalyticsCategory.p2p,
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setWaitSui(false);
    }
  }

  //components
  const Title = () => {
    return (
      <div className="mb-4 justify-between md:flex">
        <div>
          <h1 className="mb-3 text-2xl font-extrabold text-blackColor md:text-3xl">
            Welcome to Hola P2P Swap
          </h1>
          <p className="font-medium text-black2Color md:text-lg">
            Swap NFTs secure and without third-parties companies!
          </p>
        </div>
        <Link
          href={"./swap/history"}
          onClick={async () => {
            await handleAnalyticsClick({
              event_main: AnalyticsEvent.viewHistory,
              page: AnalyticsCategory.p2p,
            });
          }}
        >
          <button className="mt-5 h-12 w-full rounded-lg border-2 border-black2Color bg-white font-semibold text-blackColor hover:border-yellowColor hover:bg-yellowColor hover:text-white md:mt-0 md:w-40">
            View History
          </button>
        </Link>
      </div>
    );
  };

  const P2pInfo = () => (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <Link
        href={SEC_3}
        target={"_blank"}
        className="order-1 flex w-52 items-center gap-[6px] rounded-[50px] border-[1px] border-blackColor bg-white px-4 py-2 font-medium md:order-none md:w-auto"
      >
        <p>Audited by</p>
        <Image src={SecLogo} alt="Sec3 Logo" width={30} height={30} />
        <p>Sec3</p>
      </Link>
      <div className="flex gap-10">
        <Link className="text-sm font-medium underline" href={SWAP_DOCS} target={"_blank"}>
          How it works?
        </Link>
        <div className="flex content-center items-center gap-1 text-right text-sm font-medium md:text-center">
          <p>Fee Swap 0.1</p>
          <Image src={ImageSuiToken} alt={"sui token"} className={"h-4 w-4"} />
        </div>
      </div>
      <Link
        href={SWAP_GITHUB}
        target={"_blank"}
        className="order-2 flex w-52 items-center justify-center gap-[6px] rounded-[50px] border-[1px] border-blackColor bg-white px-5 py-2 font-medium md:w-auto"
      >
        <Image src={GithubLogo} alt="Sec3 Logo" width={30} height={30} />
        <p>GitHub</p>
      </Link>
    </div>
  );
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <Container>
      <Title />
      <div className="h-full items-center justify-evenly justify-items-center gap-10 rounded-2xl lg:flex">
        <div className="mb-4 w-full items-center justify-between gap-1 rounded-xl border-2 border-purpleColor bg-white px-4 py-7 pt-5 lg:px-6">
          <p className={"mb-4 text-lg font-semibold text-blackColor"}>Your offer</p>
          <SwapInformation
            userObjectIds={creatorObjectIds}
            setShowCollection={setShowCollection}
            setCoinAmount={setCreatorCoinAmount}
            coinAmount={creatorCoinAmount}
          />
        </div>
        <div className="mb-4 w-full items-center justify-between gap-1 rounded-xl border-2 border-pinkColor bg-white px-4 py-7 pt-5 lg:px-6">
          <div className={"mb-4 flex content-center justify-between"}>
            <p className={"text-lg font-semibold text-blackColor "}>You want to get</p>
            {recipientAddress && (
              <div className={"flex items-center gap-1 px-3"}>
                <p className="text-sm text-black2Color">{`${formatSuiAddress(
                  recipientAddress,
                )}`}</p>
                <XMarkIcon
                  className={"h-5 w-5 cursor-pointer text-black2Color"}
                  onClick={() => {
                    setRecipientAddress("");
                    setRecipientObjectIds([]);
                    setRecipientCoinAmount(null);
                  }}
                />
              </div>
            )}
          </div>
          {/* //Counterparty wallet address */}
          <SwapInformation
            userObjectIds={recipientObjectIds}
            setShowCollection={setShowReceivedNFT}
            setCoinAmount={setRecipientCoinAmount}
            coinAmount={recipientCoinAmount}
            recipientAddress={recipientAddress}
            isRecipient={true}
          />
        </div>
      </div>
      <button
        onClick={createOffer}
        disabled={
          waitSui ||
          (!creatorObjectIds.length && !creatorCoinAmount) ||
          (!recipientObjectIds.length && !recipientCoinAmount)
        }
        className="mb-4 w-full rounded-md bg-greenColor py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 md:w-[200px]"
      >
        Create Offer
      </button>
      <P2pInfo />
      {showCollection && (
        <MyCollectionDialog
          wallet={wallet}
          opened={showCollection}
          setOpened={setShowCollection}
          batchIdTrade={creatorObjectIds}
          setBatchIdTrade={setCreatorObjectIds}
          setTypeSwap={setSwapType}
          typeSwap={swapType}
        />
      )}
      {showReceivedNFT && (
        <RecipientCollectionDialog
          creatorBatchIdTrade={creatorObjectIds}
          wallet={wallet}
          opened={showReceivedNFT}
          setOpened={setShowReceivedNFT}
          batchIdTrade={recipientObjectIds}
          setBatchIdTrade={setRecipientObjectIds}
          walletAddressToSearch={recipientAddress}
          setWalletAddressToSearch={setRecipientAddress}
          setTypeSwap={setSwapType}
          typeSwap={swapType}
        />
      )}
      {offerCreated && offerTransactionHash && (
        <YourOfferLinkDialog
          transactionHash={offerTransactionHash}
          recipientAddress={recipientAddress!}
          opened={offerCreated}
          setOpened={setOfferCreated}
        />
      )}
    </Container>
  );
};
