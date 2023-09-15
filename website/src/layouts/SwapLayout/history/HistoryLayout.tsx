import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet, Container, Breadcrumbs } from "components";
import { classNames, ESCROW_HUB_ID, formatSuiAddress, formatSuiNumber } from "utils";
import { useEffect, useState } from "react";
import { IOffer, TabType } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import Link from "next/link";
import ImageSuiToken from "/public/img/SuiToken.png";
import Image from "next/image";
import { useRouter } from "next/router";

export const HistoryLayout = () => {
  const { status, wallet } = ethos.useWallet();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("received");
  const [sentOffers, setSentOffers] = useState<IOffer[] | null>();
  const [receivedOffers, setReceivedOffers] = useState<IOffer[] | null>();

  const generateLink = (offer: IOffer) => {
    //@ts-ignore
    return "/swap/history/" + offer.id?.id!; // replace this with your actual link generation function
  };

  useEffect(() => {
    async function fetchHistory() {
      if (!wallet) return;
      try {
        const response = await suiProvider.getDynamicFields({
          parentId: ESCROW_HUB_ID,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<IOffer> => {
            const suiObject = await suiProvider.getObject({
              id: df?.objectId!,
              options: { showContent: true },
            });
            return getObjectFields(suiObject) as IOffer;
          }),
        ).then((offers) => {
          const sent = offers
            .filter((offer) => offer.creator === wallet.address)
            .sort((a) => (a.status === 1 ? 1 : -1));
          const received = offers
            .filter((offer) => offer.recipient === wallet.address)
            .sort((a) => (a.status === 1 ? 1 : -1));

          setSentOffers(sent);
          setReceivedOffers(received);
        });
      } catch (e) {
        console.error(e);
      }
    }

    fetchHistory().then();
  }, [wallet]);

  const SwitchTab = () => {
    return (
      <div className="mb-5 flex flex-col gap-4 md:flex-row">
        <button
          onClick={() => setActiveTab("received")}
          className={classNames(
            "w-full rounded-full px-4 py-2 font-medium md:w-64",
            activeTab === "received" ? "bg-purpleColor text-white" : "bg-white text-black2Color",
          )}
        >
          Awaiting offers
        </button>
        <button
          onClick={() => setActiveTab("sent")}
          className={classNames(
            "w-full rounded-full px-4 py-2 font-medium md:w-64",
            activeTab === "sent" ? "bg-pinkColor text-white" : "bg-white text-black2Color",
          )}
        >
          Sent offers
        </button>
      </div>
    );
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"P2P Swap!"} />
  ) : (
    <Container>
      <Breadcrumbs linkNames="P2P Swap/Swap history" routerPath={router.asPath} />
      <div className={"mb-8 text-3xl font-extrabold text-blackColor"}>
        <p>Swap History</p>
      </div>
      <SwitchTab />

      {activeTab === "received" && receivedOffers ? (
        <table className={"border-separate border-spacing-y-2 text-black2Color"}>
          <thead>
            <tr className={"ml-2 font-light text-black2Color"}>
              <th scope="col" className="py-3.5 text-left text-sm font-semibold">
                <div className={"ml-2"}>N</div>
              </th>
              <th scope="col" className="flex px-3 py-3.5 text-left text-sm font-semibold">
                Wallet
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
                Offered NFTs
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
                Offered SUI
              </th>
              <th scope="col" className="flex-col px-3 py-3.5 text-left text-sm font-semibold">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Link</span>
              </th>
            </tr>
          </thead>
          <tbody className={"mt-4 rounded-2xl text-black"}>
            {receivedOffers
              .map((offer, index) => (
                <tr key={offer.id} className={"rounded-full border border-amber-950 bg-white"}>
                  <td className={"px-3 py-5 text-xs text-gray-500 md:text-sm"}>{index + 1}</td>
                  <td className={"whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:text-sm"}>
                    {formatSuiAddress(offer.creator, 4, 4)}
                  </td>
                  <td className={"hidden px-3 py-5 text-sm text-gray-500 md:table-cell"}>
                    <div className={"flex content-center items-center gap-1"}>
                      <div
                        className={
                          "flex h-8 w-8 content-center items-center justify-center rounded-lg border border-grayColor p-2"
                        }
                      >
                        <p>🖼</p>️
                      </div>
                      {offer.recipient_items_ids.length === 0 ? (
                        <p className={"font-black"}>{"-"}</p>
                      ) : (
                        <p className={"font-semibold"}>+{offer.recipient_items_ids.length}</p>
                      )}
                    </div>
                  </td>
                  <td className={"hidden px-3 py-5 text-sm text-gray-500 md:table-cell"}>
                    <div className={"flex gap-1"}>
                      <Image src={ImageSuiToken} alt={"sui token"} className={"h-5 w-5"} />
                      {offer.recipient_coin_amount === 0 ? (
                        <p>{"-"}</p>
                      ) : (
                        <p>{formatSuiNumber(offer.recipient_coin_amount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2 py-5 text-xs text-gray-500 md:px-3 md:text-sm">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium md:text-sm",
                        offer.status === 0
                          ? "text-pinkColor"
                          : offer.status === 1
                          ? "text-yellowColor"
                          : "text-green-700",
                      )}
                    >
                      {offer.status === 0
                        ? "Canceled"
                        : offer.status === 1
                        ? "Active"
                        : "Exchanged"}
                    </span>
                  </td>
                  <td className={"whitespace-nowrap px-2 py-5 text-xs text-purpleColor md:text-sm"}>
                    <Link href={generateLink(offer)}>
                      <div
                        className={
                          "flex content-center items-center justify-center rounded-lg border border-purpleColor py-2 hover:bg-purpleColor hover:text-white"
                        }
                      >
                        Learn more
                      </div>
                    </Link>
                  </td>
                </tr>
              ))
              .reverse()}
          </tbody>
        </table>
      ) : (
        activeTab === "received" && (
          <p className="mt-[90px] text-center text-lg leading-[22px] text-black2Color">
            You haven't gotten any offers yet
          </p>
        )
      )}
      {activeTab === "sent" && sentOffers ? (
        <table className={"border-separate border-spacing-y-2 text-black2Color"}>
          <thead>
            <tr className={"ml-2 font-light text-black2Color"}>
              <th scope="col" className="py-3.5 text-left text-sm font-semibold">
                <div className={"ml-2"}>N</div>
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                Wallet
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
                Wanted NFTs
              </th>
              <th
                scope="col"
                className="hidden px-3 py-3.5 text-left text-sm font-semibold md:table-cell"
              >
                Wanted SUI
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                <span className="sr-only">Link</span>
              </th>
            </tr>
          </thead>
          <tbody className={"mt-4 rounded-2xl text-black"}>
            {sentOffers
              .map((offer, index) => (
                <tr key={offer.id} className={"rounded-full border border-grayColor bg-white "}>
                  <td className={"px-3 py-5 text-xs text-gray-500 md:text-sm"}>{index + 1}</td>
                  <td className={"whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:text-sm"}>
                    {formatSuiAddress(offer.recipient, 4, 4)}
                  </td>
                  <td
                    className={
                      "hidden whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:table-cell md:text-sm"
                    }
                  >
                    <div className={"flex content-center items-center gap-1"}>
                      <div
                        className={
                          "flex h-8  w-8 content-center items-center justify-center rounded-lg border border-grayColor p-2"
                        }
                      >
                        <p>🖼</p>️
                      </div>
                      {offer.recipient_items_ids.length === 0 ? (
                        <p className={"font-black"}>{"-"}</p>
                      ) : (
                        <p className={"font-semibold"}>+{offer.recipient_items_ids.length}</p>
                      )}
                    </div>
                  </td>
                  <td
                    className={
                      "hidden whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:table-cell md:text-sm"
                    }
                  >
                    <div className={"flex gap-1"}>
                      <Image src={ImageSuiToken} alt={"sui token"} className={"h-5 w-5"} />
                      {offer.recipient_coin_amount === 0 ? (
                        <p>{"-"}</p>
                      ) : (
                        <p>{formatSuiNumber(offer.recipient_coin_amount)}</p>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-xs text-gray-500 md:text-sm">
                    <span
                      className={classNames(
                        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium md:text-sm",
                        offer.status === 0
                          ? "text-pinkColor"
                          : offer.status === 1
                          ? "text-yellowColor"
                          : "text-green-700",
                      )}
                    >
                      {offer.status === 0
                        ? "Canceled"
                        : offer.status === 1
                        ? "Active"
                        : "Exchanged"}
                    </span>
                  </td>
                  <td className={"whitespace-nowrap px-2 py-5 text-xs text-pinkColor md:text-sm"}>
                    <Link href={generateLink(offer)}>
                      <div
                        className={
                          "flex content-center items-center justify-center rounded-lg border border-pinkColor py-2 hover:bg-pinkColor hover:text-white"
                        }
                      >
                        Learn more
                      </div>
                    </Link>
                  </td>
                </tr>
              ))
              .reverse()}
          </tbody>
        </table>
      ) : (
        activeTab === "sent" && (
          <p className="mt-[90px] text-center text-lg leading-[22px] text-black2Color">
            You haven't sent any offers yet
          </p>
        )
      )}
    </Container>
  );
};
