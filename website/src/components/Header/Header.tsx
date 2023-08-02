import Link from "next/link";
import { classNames } from "../../utils";
import Logo from "/public/img/logo.png";
import Image from "next/image";
import { HamburgerMenu } from "components";
import { useRouter } from "next/router";
import CustomWalletMenu from "../CustomWalletMenu/CustomWalletMenu";
import { useState } from "react";
import SocialsDialog from "components/Dialog/SocialsDialog";
import MenuDialog from "components/Dialog/MenuDialog";

export const Header = () => {
  const [openSocials, setOpenSocials] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const router = useRouter();
  return (
    <div className="fixed-header w-full font-inter">
      <div className="mx-4 mt-4 flex min-h-[60px] items-center rounded-xl border-2 border-blackColor bg-basicColor pl-3 pr-2.5 text-white md:mx-8 md:min-h-[76px] md:rounded-[20px] md:px-8 xl:min-h-[90px]">
        <div className="flex flex-1 content-center items-center justify-between">
          <Link href="/">
            {/* TODO:Fix sizing images */}
            <Image
              src={Logo}
              height={54}
              width={118}
              alt={"logo"}
              priority
              unoptimized={true}
              className="md:h-[81px] md:min-w-[180px]"
            />
          </Link>
          <div
            className={classNames(
              "hidden gap-10 font-medium text-black2Color md:mt-0 md:items-center md:justify-evenly xl:flex",
            )}
          >
            <Link href="/">
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/"
                    ? "font-semibold text-blackColor"
                    : "hover:text-yellowColorHover",
                )}
              >
                Staking
              </div>
            </Link>
            <Link href="/spaces">
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/spaces"
                    ? "font-semibold text-blackColor"
                    : "hover:text-yellowColorHover",
                )}
              >
                Spaces
              </div>
            </Link>
            <Link href="/swap">
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/swap"
                    ? "font-semibold text-blackColor"
                    : "hover:text-purpleColor",
                )}
              >
                P2P Swap
              </div>
            </Link>
            <Link href="/dao">
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/dao"
                    ? "font-semibold text-blackColor"
                    : "hover:text-redColor",
                )}
              >
                DAO
              </div>
            </Link>
          </div>
          <button
            onClick={() => setOpenMenu(true)}
            className="hidden h-10 w-20 font-medium text-black2Color hover:cursor-pointer hover:text-blackColor md:flex xl:hidden"
          >
            Menu
          </button>
          <div className="mt-2 hidden h-12 items-center gap-8 md:mt-0 md:flex">
            <button
              onClick={() => setOpenSocials(true)}
              className="h-10 w-20 font-medium text-black2Color hover:cursor-pointer hover:text-blackColor"
            >
              Socials
            </button>
            <div>
              <CustomWalletMenu />
            </div>
          </div>
          <HamburgerMenu />
        </div>
      </div>
      <SocialsDialog openSocials={openSocials} setOpenSocials={setOpenSocials} />
      <MenuDialog openMenu={openMenu} setOpenMenu={setOpenMenu} />
    </div>
  );
};
