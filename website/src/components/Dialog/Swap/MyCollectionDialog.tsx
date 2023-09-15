import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { handleSetBatchIdForSwap, ICapy, ISwapCollectionDialog } from "types";
import { Inter } from "next/font/google";
import { classNames } from "utils";
import Image from "next/image";
import { fetchNFTObjects } from "services/sui";
import { Button } from "components";

const font_inter = Inter({ subsets: ["latin"] });

export const MyCollectionDialog = ({
  wallet,
  opened,
  setOpened,
  batchIdTrade,
  setBatchIdTrade,
  setTypeSwap,
  typeSwap,
}: ISwapCollectionDialog) => {
  if (!wallet) return <></>;

  const [frens, setFrens] = useState<ICapy[] | null>();

  const nfts = wallet?.contents?.nfts!;
  const suifrens = fetchNFTObjects(nfts);

  useEffect(() => {
    async function fetchWalletObjects() {
      if (!wallet?.address) {
        return;
      }
      try {
        const nfts = wallet?.contents.objects;
        const suifrens = fetchNFTObjects(nfts);
        if (suifrens) setFrens(suifrens);
      } catch (e) {
        console.error(e);
      }
    }

    fetchWalletObjects().then();
  }, [wallet?.address, wallet?.contents?.nfts]);

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
                <p className="text-2xl lg:text-3xl">Select NFTs from your collection</p>
              </Dialog.Title>
              <div className="mb-3 flex items-center justify-between text-lg font-semibold text-blackColor">
                <p>Collection</p>
                <p className="md:flex">
                  <span className="text-black2Color">Selected</span> ({batchIdTrade.length})
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className={"flex flex-col items-center gap-2"}>
                  <div className="mb-6 flex max-h-[310px] min-h-[310px] flex-col overflow-y-auto md:max-h-[354px] md:min-h-[354px] xl:max-h-[362px] xl:min-h-[362px]">
                    {suifrens ? (
                      <div
                        className={"grid grid-cols-4 gap-[10px] md:grid-cols-5 md:gap-3 xl:gap-4"}
                      >
                        {frens?.map((fren) => {
                          return (
                            <button
                              key={fren.id}
                              onClick={() => {
                                handleSetBatchIdForSwap(
                                  fren.id,
                                  fren.url,
                                  fren.type,
                                  setTypeSwap,
                                  batchIdTrade,
                                  setBatchIdTrade,
                                );
                              }}
                            >
                              <div
                                className={classNames(
                                  "relative flex max-h-[70px] min-h-[70px] min-w-[70px] max-w-[70px] cursor-pointer flex-col content-center items-center justify-center rounded-md border-2 border-black2Color bg-white  md:max-h-[110px] md:min-h-[110px] md:min-w-[110px] md:max-w-[110px]",
                                  batchIdTrade.some((item) => item.id === fren.id)
                                    ? "border-yellowColor"
                                    : "border-blackColor",
                                )}
                              >
                                <Image
                                  src={fren.url}
                                  alt="collection_img"
                                  fill={true}
                                  className="rounded-xl object-contain"
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p>Loading..</p>
                    )}
                  </div>
                </div>
                <div className="flex w-full flex-col gap-[10px] md:flex-row">
                  <Button
                    variant="popup-primary-purple"
                    className="md:order-last"
                    size="sm-full"
                    onClick={() => {
                      setOpened(false);
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="popup-secondary-purple"
                    size="sm-full"
                    onClick={() => {
                      setOpened(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
