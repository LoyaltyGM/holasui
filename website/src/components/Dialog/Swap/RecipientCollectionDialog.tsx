import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { handleSetBatchIdForSwap, ICapy, ISwapRecipientCollectionDialog } from "types";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  classNames,
  convertIPFSUrl,
  formatSuiAddress,
  SUIFREN_CAPY_TYPE,
  SWAP_TYPES_LIST,
} from "utils";
import Image from "next/image";
import { fetchNFTObjects, suiProvider } from "services/sui";
import { LabeledInput } from "components/Forms/Inputs";
import { Inter } from "next/font/google";
import { Button } from "components/Reusable";

const font_inter = Inter({ subsets: ["latin"] });

function initializeSuifren(nftObject: any): ICapy {
  return {
    id: nftObject?.data?.objectId,
    description: nftObject?.data?.display?.data?.name!,
    url: convertIPFSUrl(nftObject?.data?.display?.data?.image_url!),
    link: "none",
    type: nftObject?.data?.type!,
  };
}

export const RecipientCollectionDialog = ({
  creatorBatchIdTrade,
  wallet,
  opened,
  setOpened,
  batchIdTrade,
  setBatchIdTrade,
  walletAddressToSearch,
  setWalletAddressToSearch,
  setTypeSwap,
  typeSwap,
}: ISwapRecipientCollectionDialog) => {
  if (!wallet) return <></>;
  const [frens, setFrens] = useState<ICapy[] | null>();
  const [tempSearchState, setTempSearchState] = useState<string>("");

  useEffect(() => {
    if (!walletAddressToSearch) return;
    fetchRecipientWallet(walletAddressToSearch).then();
  }, [walletAddressToSearch]);

  const nfts = wallet?.contents?.nfts!;
  const suifrens = fetchNFTObjects(nfts);

  async function fetchRecipientWallet(searchWalletAddress: string) {
    if (!searchWalletAddress) {
      return;
    }
    // if we don't have anything in temp search state skip this condition
    if (tempSearchState) {
      setWalletAddressToSearch(tempSearchState);
    }
    try {
      const response = await suiProvider.getOwnedObjects({
        owner: searchWalletAddress,
        options: { showContent: true, showType: true, showDisplay: true },
      });

      const suifrens = response.data
        .filter((object) => SWAP_TYPES_LIST.includes(object?.data?.type!))
        .map((suifrenNftObject) => {
          return initializeSuifren(suifrenNftObject);
        });

      setFrens(suifrens);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Transition.Root show={opened} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          setOpened(false);
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

        <div className={classNames("fixed inset-0 z-10 overflow-auto", font_inter.className)}>
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative mx-4 h-[614px] w-full max-w-2xl transform overflow-auto rounded-xl border-2 border-blackColor bg-basicColor px-4 pb-4 pt-5 text-left shadow-black transition-all sm:mx-16 sm:my-8 sm:w-full sm:p-6 md:h-[632px] md:w-[682px]">
              <Dialog.Title
                as="h3"
                className="mb-7 text-center font-extrabold leading-6 text-blackColor"
              >
                <p className="text-2xl lg:text-3xl">Select NFTs you want</p>
              </Dialog.Title>
              <div className="mb-3 flex items-center justify-between text-lg font-semibold text-blackColor">
                <p>Collection</p>
                <p className="md:flex">
                  <span className="text-black2Color">Selected</span> ({batchIdTrade.length})
                </p>
              </div>
              <div className="flex w-full flex-col items-center justify-center">
                <div className="flex w-full flex-col items-center gap-2">
                  <input
                    type={"text"}
                    name="wallet_address"
                    className="input-field w-full rounded-lg border-[1px] border-grayColor px-3 py-2 text-sm font-medium"
                    placeholder="Sui Wallet"
                    onChange={(e) => setTempSearchState(e.target.value)}
                  />
                  <div className={"flex w-full content-center items-center gap-1 py-2"}>
                    {walletAddressToSearch && (
                      <>
                        <p className="text-sm text-black2Color">{`Wallet Collection: ${formatSuiAddress(
                          walletAddressToSearch,
                        )}`}</p>
                        <XMarkIcon
                          className="h-5 w-5 cursor-pointer text-black2Color"
                          onClick={() => {
                            setWalletAddressToSearch("");
                            setBatchIdTrade([]);
                            setFrens([]);
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="mb-6 flex max-h-[230px] min-h-[230px] flex-col overflow-y-auto md:max-h-[232px] md:min-h-[232px] xl:max-h-[236px] xl:min-h-[236px]">
                    {suifrens ? (
                      <div
                        className={"grid grid-cols-4 gap-[10px] md:grid-cols-5 md:gap-3 xl:gap-4"}
                      >
                        {frens?.map((fren) => {
                          return (
                            <button
                              onClick={() => {
                                handleSetBatchIdForSwap(
                                  fren.id,
                                  fren.url,
                                  fren.type,
                                  setTypeSwap,
                                  batchIdTrade,
                                  setBatchIdTrade,
                                  creatorBatchIdTrade,
                                  typeSwap,
                                );
                              }}
                              key={fren.id}
                            >
                              <div
                                className={classNames(
                                  "relative flex max-h-[70px] min-h-[70px] min-w-[70px] max-w-[70px] cursor-pointer flex-col content-center items-center justify-center rounded-md border-2 border-black2Color bg-white  md:max-h-[110px] md:min-h-[110px] md:min-w-[110px] md:max-w-[110px]",
                                  batchIdTrade.some((item) => item.id === fren.id)
                                    ? "border-yellowColor"
                                    : "border-black2Color",
                                )}
                              >
                                <Image
                                  src={fren.url}
                                  alt="collection_img"
                                  fill={true}
                                  className="rounded-xl object-contain"
                                />
                                <p className="mt-1 max-h-[40px] min-h-[40px] text-xs">
                                  {classNames(fren.description ? `${fren.description}` : "")}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p>Loading...</p>
                    )}
                  </div>
                  <div className="flex w-full flex-col gap-[10px] md:flex-row">
                    <Button
                      variant="popup-primary-pink"
                      className="md:order-last"
                      size="sm-full"
                      onClick={() => {
                        batchIdTrade?.length === 0
                          ? fetchRecipientWallet(tempSearchState)
                          : setOpened(false);
                      }}
                    >
                      {batchIdTrade?.length === 0 ? "Search" : "Confirm Items"}
                    </Button>
                    <Button
                      variant="popup-secondary-pink"
                      size="sm-full"
                      onClick={() => {
                        setOpened(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
