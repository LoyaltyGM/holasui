import Link from "next/link";
import { classNames } from "../../utils";
import Logo from "/public/img/logo.png";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { HamburgerMenu } from "components";
import { useRouter } from "next/router";
import CustomWalletMenu from "../CustomWalletMenu/CustomWalletMenu";

const font_montserrat = Montserrat({ subsets: ["latin"] });

export const Header = () => {
  const router = useRouter();
  return (
    <div className={"fixed-header w-full"}>
      <div className="mx-4 mt-4 flex min-h-[60px] items-center rounded-xl border-2 border-blackColor bg-basicColor pl-3 pr-2.5 align-middle text-white md:mx-8 md:min-h-[94px] md:rounded-[20px] md:px-8">
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
              "mx-3 mt-1 hidden gap-10 font-semibold text-blackColor md:mt-0 md:flex md:items-center md:justify-evenly",
              font_montserrat.className,
            )}
          >
            <Link href="/">
              <div
                className={classNames(
                  "my-3 block rounded-md py-2",
                  router.pathname === "/"
                    ? "font-bold text-yellowColor"
                    : "hover:text-yellowColorHover",
                )}
              >
                Staking
              </div>
            </Link>
            <Link href="/swap">
              <div
                className={classNames(
                  "my-3 block rounded-md py-2",
                  router.pathname === "/swap"
                    ? "font-bold text-purpleColor"
                    : "hover:text-purpleColor",
                )}
              >
                P2P Swap
              </div>
            </Link>
            <Link href="/dao">
              <div
                className={classNames(
                  "my-3 block rounded-md py-2",
                  router.pathname === "/dao" ? "font-bold text-redColor" : "hover:text-redColor",
                )}
              >
                DAO
              </div>
            </Link>
          </div>

          <div className="mt-2 hidden h-12 items-center gap-8 md:mt-0 md:flex">
            <div
              className={classNames(
                "flex flex-col items-center justify-center",
                "text-black2Color",
                "group cursor-pointer rounded-2xl py-2 font-medium hover:text-[#8d6eec]",
                font_montserrat.className,
              )}
            >
              <a href="https://discord.gg/X8SXejkVHs" target="_black">
                Discord
              </a>
            </div>
            <div
              className={classNames(
                "flex flex-col items-center justify-center",
                "text-black2Color",
                "group cursor-pointer rounded-2xl py-2 font-medium hover:fill-[#6ea0ec] hover:text-[#6ea0ec] group-hover:text-[#6ea0ec]",
                font_montserrat.className,
              )}
            >
              <a href="https://twitter.com/Hola_Sui" target="_black">
                Twitter
              </a>
            </div>
            <div>
              <CustomWalletMenu />
            </div>
          </div>
          <HamburgerMenu />
        </div>
      </div>
    </div>
  );
};
