import Image from "next/image";
import frensLogo from "/public/img/frens-logo.svg";
import ExternalWebsiteIcon from "/public/img/ExternalLinkIcon.svg";
import Link from "next/link";
import { IDao } from "types/daoInterface";
import { classNames } from "../../../utils";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

export const DAOInfo = ({
  dao,
  daoAddress,
  isSubDao = false,
}: {
  dao: IDao;
  daoAddress: string;
  isSubDao?: boolean;
}) => {
  const [openedDialog, setOpenedDialog] = useState(false);

  const InfoDaoDescription = () => {
    return (
      <div
        className={
          "mt-4 max-h-[100px] min-h-[70px] w-full overflow-hidden text-clip pr-6 text-base font-medium text-black2Color md:w-5/6"
        }
      >
        <p className={"w-full"}>{dao?.description}</p>
      </div>
    );
  };

  return (
    <div className={"mt-10"}>
      <div className={"flex w-full justify-between"}>
        <div className={"w-full md:flex md:justify-between"}>
          <div className={"flex gap-4"}>
            <Image
              src={dao?.image || frensLogo}
              alt={"logo-dao"}
              height={150}
              width={150}
              className={
                "h-[150px] max-h-[150px] min-h-[150px] w-[150px] min-w-[150px] max-w-[150px] rounded-full border border-blackColor"
              }
            />
            <div>
              <div className={"flex content-center items-center justify-start gap-3"}>
                <h1 className={"text-4xl font-semibold text-blackColor"}>{dao?.name}</h1>
                {daoAddress ? (
                  <a href={`https://suivision.xyz/object/${daoAddress}`} target={"_blank"}>
                    <Image
                      src={ExternalWebsiteIcon}
                      alt={"external website icon"}
                      className={"h-4 w-4 cursor-pointer"}
                    />
                  </a>
                ) : null}
              </div>
              <InfoDaoDescription />
            </div>
          </div>

          <div
            className={classNames(
              "ml-1 mt-6 flex w-full flex-col md:ml-0 md:mt-0 md:w-1/3",
              isSubDao
                ? "content-start items-start justify-start md:content-start md:items-center md:justify-center"
                : "content-start items-start justify-start md:content-center md:items-center md:justify-center",
            )}
          >
            {isSubDao ? (
              <div className={"rounded-lg bg-yellowColor/30 px-3 py-2 text-blackColor"}>SubDAO</div>
            ) : (
              <Link href={`/dao/${daoAddress}/create-subdao`}>
                <button
                  className={
                    "button-secondary button-shadow flex max-h-[48px] min-h-[48px] w-full min-w-[220px] max-w-[220px] content-center items-center justify-center"
                  }
                >
                  Create SubDAO
                </button>
              </Link>
            )}
            <div
              className={
                "mt-2 flex cursor-pointer justify-center text-sm font-medium text-black2Color underline underline-offset-4 hover:text-pinkColor md:px-4 "
              }
              onClick={() => setOpenedDialog(true)}
            >
              What is Sub DAO?
            </div>
          </div>
        </div>
      </div>

      <WhatIsSubdaoDialog openDialog={openedDialog} setOpenDialog={setOpenedDialog} />
    </div>
  );
};

interface IWhatIsSubdaoDialog {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const WhatIsSubdaoDialog = ({ openDialog, setOpenDialog }: IWhatIsSubdaoDialog) => {
  return (
    <Transition.Root show={openDialog} as={Fragment}>
      <Dialog
        as="div"
        className={classNames("relative z-10")}
        onClose={() => {
          setOpenDialog(false);
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

        <div className="fixed inset-0 z-10 overflow-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-basicColor px-10 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              <Dialog.Title
                className={classNames(
                  "mb-2 flex justify-between  text-center text-base font-bold leading-6 text-black2Color",
                )}
              >
                <p className="mt-1"></p>
                <p className={classNames("mt-1 font-bold text-blackColor")}>What is Subdao?</p>
                <button onClick={() => setOpenDialog(false)}>
                  <XMarkIcon className="flex h-7 w-7 md:hidden" />
                </button>
              </Dialog.Title>
              <div className={"flex flex-col gap-6"}>
                <p>
                  A SubDAO is essentially a miniature version of the main DAO, established around
                  distinct items or attributes inherent in the main DAO. For example, you can form a
                  SubDAO focused on specific traits such as hats, glasses, or even the country of
                  origin (as is the case with Capy). This SubDAO will maintain all the operational
                  features of the larger DAO but will be specifically catered to these unique
                  traits. At present, SubDAO capabilities are only accessible for CapyDAO. If you
                  wish to incorporate your NFT collection into a SubDAO, we welcome you to direct
                  message us on Twitter or Discord. Availing this service is absolutely free.
                </p>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
