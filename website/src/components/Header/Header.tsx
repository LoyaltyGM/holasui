import Link from "next/link";
import { AnalyticsCategory, AnalyticsEvent, classNames, handleAnalyticsClick } from "utils";
import Logo from "/public/img/logo.png";
import Image from "next/image";
import { MobileMenuDialog, MenuDialog, SocialsDialog } from "components";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import CustomWalletMenu from "../CustomWalletMenu/CustomWalletMenu";
import { useState } from "react";

export const Header = () => {
  const [openSocials, setOpenSocials] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);

  const router = useRouter();
  return (
    <div className="fixed-header w-full font-inter">
      <div
        className={classNames(
          "mx-4 mt-4 flex min-h-[60px] items-center rounded-xl border-2 border-blackColor bg-basicColor pl-3 pr-2.5 text-white md:mx-8 md:min-h-[76px] md:rounded-[20px] md:px-8 xl:min-h-[90px]",
        )}
      >
        <div className="flex flex-1 content-center items-center justify-between">
          <Link
            href="/"
            onClick={async () =>
              await handleAnalyticsClick({
                event_main: AnalyticsEvent.clickToLogo,
                page: AnalyticsCategory.main,
              })
            }
          >
            {/* TODO:Fix sizing images */}
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
            className={classNames(
              "hidden gap-10 font-medium text-black2Color md:mt-0 md:items-center md:justify-evenly xl:flex",
            )}
          >
            <Link
              href="/"
              onClick={async () =>
                await handleAnalyticsClick({
                  event_main: AnalyticsEvent.clickToStaking,
                  page: AnalyticsCategory.main,
                })
              }
            >
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/"
                    ? "font-semibold text-blackColor"
                    : "hover:text-yellowColor",
                )}
              >
                Staking
              </div>
            </Link>
            {/* <Link href="/spaces">
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/spaces"
                    ? "font-semibold text-blackColor"
                    : "hover:text-pinkColor",
                )}
              >
                Spaces
              </div>
            </Link> */}
            <Link href="/swap" onClick={async () =>
                await handleAnalyticsClick({
                  event_main: AnalyticsEvent.clickToP2P,
                  page: AnalyticsCategory.main,
                })
              }>
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/swap"
                    ? "font-semibold text-blackColor"
                    : "hover:text-orangeColor",
                )}
              >
                P2P Swap
              </div>
            </Link>
            <Link
              href="/dao"
              onClick={async () =>
                await handleAnalyticsClick({
                  event_main: AnalyticsEvent.clickToDAO,
                  page: AnalyticsCategory.main,
                })
              }
            >
              <div
                className={classNames(
                  "block rounded-md p-[10px]",
                  router.pathname === "/dao"
                    ? "font-semibold text-blackColor"
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
              className="p-[10px] font-medium text-black2Color hover:cursor-pointer hover:font-semibold hover:text-blackColor "
            >
              Menu
            </button>
            {/* TODO: FIX SIMILAR BUTTONS(1) */}
            <button
              onClick={() => setOpenSocials(true)}
              className="p-[10px] font-medium text-black2Color hover:cursor-pointer hover:font-semibold hover:text-blackColor"
            >
              Socials
            </button>
          </div>
          {/* TODO: Rewrite two socials */}
          <div className="mt-2 hidden h-12 items-center gap-8 md:mt-0 md:flex">
            {/* TODO: FIX SIMILAR BUTTONS(2)*/}
            <button
              onClick={() => setOpenSocials(true)}
              className="hidden p-[10px] font-medium text-black2Color hover:cursor-pointer hover:font-semibold hover:text-blackColor xl:block"
            >
              Socials
            </button>
            <div>
              <CustomWalletMenu />
            </div>
          </div>
          <div className="flex md:hidden">
            <Bars3Icon
              className="z-10 h-10 w-10 cursor-pointer text-3xl text-black"
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
