import { Transition, Dialog } from "@headlessui/react";
import Link from "next/link";
import { Fragment, Dispatch, SetStateAction } from "react";

const MenuDialog = ({
  openMenu,
  setOpenMenu,
}: {
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
}) => (
  <Transition.Root show={openMenu} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-10"
      onClose={() => {
        setOpenMenu(false);
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
          <Dialog.Panel className="relative transform overflow-hidden rounded-lg border-2 border-blackColor bg-basicColor p-10 pt-8 shadow-black transition-all">
            <Dialog.Title as="h3" className="mb-[30px] text-[26px] font-extrabold text-blackColor">
              Menu
            </Dialog.Title>
            <div className="flex flex-col gap-5">
              <Link href="/staking">
                <button className="h-12 w-[330px] rounded-xl bg-yellowColor text-lg font-semibold">
                  Staking
                </button>
              </Link>
              <Link href="/spaces">
                <button className="h-12 w-[330px] rounded-xl bg-pinkColor text-lg font-semibold">
                  Spaces
                </button>
              </Link>
              <Link href="/swap">
                <button className="h-12 w-[330px] rounded-xl bg-orangeColor text-lg font-semibold">
                  P2P Swap
                </button>
              </Link>
              <Link href="/dao">
                <button className="h-12 w-[330px] rounded-xl bg-purpleColor text-lg font-semibold">
                  DAO
                </button>
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);

export default MenuDialog;
