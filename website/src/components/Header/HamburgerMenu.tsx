import React, { Dispatch, SetStateAction, useState } from "react";
import { ethos } from "ethos-connect";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { classNames } from "../../utils";
import Link from "next/link";
import Image from "next/image";
import Logo from "/public/img/logo.png";

export const HamburgerMenu = ({
  openMobileMenu,
  setOpenMobileMenu,
}: {
  openMobileMenu: boolean;
  setOpenMobileMenu: Dispatch<SetStateAction<boolean>>;
}) => {
  const toggleMenu = () => setOpenMobileMenu(!openMobileMenu);

  return (
    <div className="flex md:hidden">
      <Bars3Icon
        className="z-10 h-10 w-10 cursor-pointer text-3xl text-black"
        onClick={toggleMenu}
      />
      {openMobileMenu && (
        <div
          className={classNames(
            "fixed left-0 top-0 z-10 h-screen w-screen overflow-x-hidden bg-black/70 bg-opacity-90 px-4 font-medium transition-all duration-500 ease-in-out",
          )}
        >
          <div
            className={classNames(
              "mt-4 flex min-h-[60px] items-center rounded-xl border-2 border-blackColor bg-basicColor pl-3 pr-2.5 shadow-black transition-all duration-500 ease-in-out",
            )}
          >
            <div className="flex flex-1 items-center justify-between">
              <Link href="/">
                {/* TODO:Fix sizing images */}
                <Image
                  src={Logo}
                  height={54}
                  width={118}
                  alt={"logo"}
                  priority
                  unoptimized={true}
                />
              </Link>
              <XMarkIcon className="h-10 w-10 cursor-pointer text-black" onClick={toggleMenu} />
            </div>
          </div>
          <div className="mt-[10px] w-full rounded-xl border-2 border-blackColor bg-basicColor px-4 py-10 text-center shadow-black">
            <div className="mb-10 block text-2xl text-white">
              <ethos.components.AddressWidget />
            </div>
            <div className="mb-28 flex  flex-col gap-[14px]">
              <Link href="/">
                <button
                  className="h-12 w-full rounded-lg bg-yellowColor text-lg font-semibold text-white hover:border-2 hover:border-yellowColor hover:bg-white hover:text-yellowColor active:border-blackColor active:text-blackColor"
                  onClick={toggleMenu}
                >
                  Staking
                </button>
              </Link>
              <Link href="/spaces">
                <button
                  className="h-12 w-full rounded-lg bg-pinkColor text-lg font-semibold text-white hover:border-2 hover:border-pinkColor hover:bg-white hover:text-pinkColor active:border-blackColor active:text-blackColor"
                  onClick={toggleMenu}
                >
                  Spaces
                </button>
              </Link>
              <Link href="/swap">
                <button
                  className="h-12 w-full rounded-lg bg-orangeColor text-lg font-semibold text-white hover:border-2 hover:border-orangeColor hover:bg-white hover:text-orangeColor active:border-blackColor active:text-blackColor"
                  onClick={toggleMenu}
                >
                  P2P Swap
                </button>
              </Link>
              <Link href="/dao">
                <button
                  className="h-12 w-full rounded-lg bg-purpleColor text-lg font-semibold text-white hover:border-2 hover:border-purpleColor hover:bg-white hover:text-purpleColor active:border-blackColor active:text-blackColor"
                  onClick={toggleMenu}
                >
                  DAO
                </button>
              </Link>
            </div>
            <h3 className="mb-4 text-start text-lg font-semibold text-blackColor">Socials</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="https://discord.com/invite/X8SXejkVHs" target="_black">
                <button className="h-12 w-full rounded-xl border-2 border-[#8664CE] bg-white font-medium text-[#8664CE] hover:bg-[#8664CE] hover:text-white active:text-black">
                  Discord
                </button>
              </Link>
              <Link href="https://twitter.com/Hola_Sui" target="_black">
                <button className="h-12 w-full rounded-xl border-2 border-[#5592DE] bg-white font-medium text-[#5592DE] hover:bg-[#5592DE] hover:text-white active:text-black">
                  Twitter
                </button>
              </Link>
              {/* TODO: Add link and taget black */}
              <Link href="#">
                <button className="h-12 w-full rounded-xl border-2 border-pinkColor bg-white font-medium text-pinkColor hover:bg-pinkColor hover:text-white active:text-black">
                  Documentation
                </button>
              </Link>
              {/* TODO: Add link and taget black */}
              <Link href="#">
                <button className="h-12 w-full rounded-xl border-2 border-yellowColor bg-white font-medium text-yellowColor hover:bg-yellowColor hover:text-white active:text-black">
                  GitHub
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
