import Link from "next/link";
import Logo from "/public/img/logo.png";
import Image from "next/image";
import { MobileMenuDialog, MenuDialog, SocialsDialog } from "components";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import CustomWalletMenu from "../CustomWalletMenu/CustomWalletMenu";
import { useState } from "react";
import { useJourneyStore } from "store";
import cn from "classnames";

export const Header = () => {
  const { bgColor, isJourneyColor } = useJourneyStore();
  const [openSocials, setOpenSocials] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
  const router = useRouter();

  const SocialsButton = ({ className }: { className?: string }) => (
    <button onClick={() => setOpenSocials(true)} className={className}>
      Socials
    </button>
  );
  return (
    <div className={`fixed-header flex w-full  justify-center font-inter bg-${bgColor}`}>
      <div
        className={cn(
          `mx-4 mt-4 flex min-h-[60px] w-full max-w-[120rem] items-center rounded-xl border-2 border-blackColor bg-${bgColor} pl-3 pr-2.5 text-white md:mx-8 md:min-h-[76px] md:rounded-[20px] md:px-8 xl:min-h-[90px]`,
          isJourneyColor ? "border-white" : "border-blackColor",
        )}
      >
        <div className="flex flex-1 content-center items-center justify-between">
          <Link href="/">
            <Image
              src={Logo}
              height={54}
              width={118}
              alt={"logo"}
              priority
              unoptimized={true}
              className="md:h-[68px] md:w-[152px] xl:h-[81px] xl:min-w-[180px]"
            />
          </Link>
          <div
            className={cn(
              "hidden gap-10 font-medium  md:mt-0 md:items-center md:justify-evenly xl:flex",
              isJourneyColor ? "text-white" : "text-black2Color",
            )}
          >
            <Link href="/">
              <div
                className={cn(
                  "block rounded-md p-[10px]",
                  router.pathname === "/"
                    ? "font-semibold text-blackColor"
                    : isJourneyColor
                    ? "hover:text-blackColor"
                    : "hover:text-yellowColor",
                )}
              >
                Staking
              </div>
            </Link>
            <Link href="/spaces">
              <div
                className={cn(
                  "block rounded-md p-[10px]",
                  router.pathname === "/spaces"
                    ? "font-semibold text-blackColor"
                    : isJourneyColor
                    ? "hover:text-blackColor"
                    : "hover:text-pinkColor",
                )}
              >
                Spaces
              </div>
            </Link>
            <Link href="/swap">
              <div
                className={cn(
                  "block rounded-md p-[10px]",
                  router.pathname === "/swap"
                    ? "font-semibold text-blackColor"
                    : isJourneyColor
                    ? "hover:text-blackColor"
                    : "hover:text-orangeColor",
                )}
              >
                P2P Swap
              </div>
            </Link>
            <Link href="/dao">
              <div
                className={cn(
                  "block rounded-md p-[10px]",
                  router.pathname === "/dao"
                    ? "font-semibold text-blackColor"
                    : isJourneyColor
                    ? "hover:text-blackColor"
                    : "hover:text-purpleColor",
                )}
              >
                DAO
              </div>
            </Link>
          </div>
          <div className="hidden gap-10 md:flex xl:hidden">
            <button
              onClick={() => setOpenMenu(true)}
              className={cn(
                "p-[10px] font-medium hover:cursor-pointer hover:font-semibold hover:text-blackColor xl:block",
                isJourneyColor ? "text-white" : "text-black2Color",
              )}
            >
              Menu
            </button>
            <SocialsButton
              className={cn(
                "p-[10px] font-medium hover:cursor-pointer hover:font-semibold hover:text-blackColor xl:block",
                isJourneyColor ? "text-white" : "text-black2Color",
              )}
            />
          </div>
          <div className="mt-2 hidden h-12 items-center gap-8 md:mt-0 md:flex">
            <SocialsButton
              className={cn(
                "hidden p-[10px] font-medium hover:cursor-pointer hover:font-semibold hover:text-blackColor xl:block",
                isJourneyColor ? "text-white" : "text-black2Color",
              )}
            />
            <div>
              <CustomWalletMenu />
            </div>
          </div>
          <div className="flex md:hidden">
            <Bars3Icon
              className={cn(
                "z-10 h-10 w-10 cursor-pointer text-3xl",
                isJourneyColor ? "text-white" : "text-blackColor",
              )}
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>
        </div>
      </div>
      <MobileMenuDialog openMobileMenu={openMobileMenu} setOpenMobileMenu={setOpenMobileMenu} />
      <SocialsDialog openSocials={openSocials} setOpenSocials={setOpenSocials} />
      <MenuDialog openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
};
