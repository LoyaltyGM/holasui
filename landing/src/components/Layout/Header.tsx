// NPM Dependencies
import React, {useRef, useEffect, useState} from "react";
import classNames from "classnames";
import {motion} from "framer-motion";

import "styles/components/Layout/Layout.module.css";
import ASSETS from "assets";

const Header = () => {
    const [navbarOpen, setNavbarOpen] = React.useState(false);
    let [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        function onScroll() {
            setIsScrolled(window.scrollY > 0);
        }

        onScroll();
        window.addEventListener("scroll", onScroll, {passive: true});
        return () => {
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const MobileMenu = () => {
        return (
            <div
                className={
                    "justify-between items-center w-full lg:flex lg:w-auto lg:items-end" +
                    (navbarOpen ? "flex" : " hidden")
                }
                id="mobile-menu-2"
            >
                <ul className="flex flex-col items-center mt-4 font-medium w-full lg:hidden ">
                    <li>
                        <a
                            href="https://twitter.com/Hola_Sui"
                            className="btn-header block py-2 pr-4 pl-3 text-black lg:bg-transparent lg:p-0 active:bg-gray2 active:text-white"
                        >
                            Twitter
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://www.discord.gg/X8SXejkVHs"
                            className="w-full block py-2 pr-4 pl-3 text-black lg:bg-transparent lg:p-0 active:bg-gray2 active:text-white"
                        >
                            Discord
                        </a>
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <motion.header
            id={"header-id"}
            className={classNames(
                "sticky top-2 mx-3 z-50 flex flex-wrap  md:px-4 py-1 transition duration-500 sm:px-6 lg:px-8",
                "text-black ",
            )}
            initial={{opacity: 0, y: -180}}
            animate={{opacity: 1, y: 0}}
            transition={{
                ease: "easeInOut",
                duration: 1,
                delay: 0.5,
            }}
        >
            <div className={'flex border-2 w-full bg-white rounded-md items-center font-light justify-between'}>
                <span className="self-center leading-5 text-base font-semibold whitespace-nowrap">
                    <img src={ASSETS.logo} height={80} width={160} alt={"logo"}/>
                </span>
                <div className="flex items-center lg:order-2 lg:gap-5">
                    <div
                        className={
                            "justify-between items-center hidden w-full lg:flex lg:w-auto lg:items-end lg:visible"
                        }
                        id="mobile-menu-2"
                    >
                        <ul
                            className={
                                "flex flex-col text-sm font-normal lg:flex-row lg:space-x-8 lg:mt-0"
                            }
                        >
                            <li>
                                <a
                                    href="https://twitter.com/Hola_Sui"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-header bg-redColor block py-2 pr-4 pl-3 lg:bg-transparent hover:text-yellowColor cursor-none"
                                >
                                    Twitter
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://www.discord.gg/X8SXejkVHs"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-header block py-2 pr-4  lg:bg-transparent hover:text-orangeColor cursor-none"
                                >
                                    Discord
                                </a>
                            </li>
                        </ul>
                    </div>
                    <a
                        href="https://dashboard.holasui.app/"
                        target="_blank"
                        rel="noreferrer"
                        className={classNames(
                            "text-redColor bg-white hover:bg-redColor hover:text-white focus:ring-4 focus:ring-redColor hover:border-redColor font-medium rounded-md border-2 text-sm px-4 lg:px-5 py-2 lg:py-1.5 mr-2 focus:outline-none cursor-none"
                        )}
                    >
                        Enter App
                    </a>
                    <button
                        data-collapse-toggle="mobile-menu-2"
                        type="button"
                        className="hidden inline-flex items-center p-1 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none
                    focus:ring-2 focus:ring-btnHover"
                        aria-controls="mobile-menu-2"
                        aria-expanded="false"
                        onClick={() => setNavbarOpen(!navbarOpen)}
                    >
                        {navbarOpen ? (
                            <svg
                                className="w-6 h-5 transition-opacity delay-75"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        ) : (
                            <>
                                <span className="sr-only">Open main menu</span>
                                <svg
                                    className="w-6 h-6 transition-opacity delay-75"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </>
                        )}
                    </button>
                </div>
                <MobileMenu/>
            </div>
            <a href={"https://blog.sui.io/eleven-teams-grant-awards/"} target={'_blank'} rel="noreferrer" className={'w-full cursor-none'}>
                <div className={'h-5 flex w-full text-xs text-white bg-[#5DAAFF] gap-1 hover:underline mt-1 rounded-md justify-center content-center items-center'}>
                    <p>Project Granted By</p>
                    <img className="w-6 h-3" src={ASSETS.suiLogo} alt=""/>
                </div>
            </a>

        </motion.header>
    );
};

export default Header;
