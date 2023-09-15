import { Transition, Dialog } from "@headlessui/react";
import Link from "next/link";
import { Fragment, Dispatch, SetStateAction } from "react";

export const SocialsDialog = ({
  openSocials,
  setOpenSocials,
}: {
  openSocials: boolean;
  setOpenSocials: Dispatch<SetStateAction<boolean>>;
}) => (
  <Transition.Root show={openSocials} as={Fragment}>
    <Dialog
      as="div"
      className="relative z-10 hidden md:block"
      onClose={() => {
        setOpenSocials(false);
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
              Socials
            </Dialog.Title>
            <div className="flex flex-col gap-5">
              <Link href="https://discord.com/invite/X8SXejkVHs" target="_black">
                <button className="h-12 w-[330px] rounded-xl border-2 border-[#8664CE] bg-white text-lg font-semibold text-[#8664CE] hover:bg-[#8664CE] hover:text-white active:text-black">
                  Discord
                </button>
              </Link>
              <Link href="https://twitter.com/Hola_Sui" target="_black">
                <button className="h-12 w-[330px] rounded-xl border-2 border-[#5592DE] bg-white text-lg font-semibold text-[#5592DE] hover:bg-[#5592DE] hover:text-white active:text-black">
                  Twitter
                </button>
              </Link>
              <Link
                href="https://holasui-dev.notion.site/HolaSui-Documentation-bf4a999bc7ba41b3b887bab1c02b37b0?pvs=4"
                target="_black"
              >
                <button className="h-12 w-[330px] rounded-xl border-2 border-pinkColor bg-white text-lg font-semibold text-pinkColor hover:bg-pinkColor hover:text-white active:text-black">
                  Documentation
                </button>
              </Link>
              <Link href="https://github.com/orgs/LoyaltyGM/repositories" target="_black">
                <button className="h-12 w-[330px] rounded-xl border-2 border-yellowColor bg-white text-lg font-semibold text-yellowColor hover:bg-yellowColor hover:text-white active:text-black">
                  GitHub
                </button>
              </Link>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
);
