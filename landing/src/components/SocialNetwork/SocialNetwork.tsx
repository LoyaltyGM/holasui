import React from "react";
import { ExternalLinkIcon } from "../Icons/ExternalLinkIcon";

export const SocialNetwork = ({ className = "" }) => {
    return (
        <div className="relative mx-auto max-w-7xl h-[480px] px-4 sm:px-6 lg:px-8">
            <div className="mx-auto absolute top-[12.5%] lg:top-[15%] left-0 right-0 max-w-lg text-center">
                <h2 className="font-display text-3xl tracking-tight text-redColor sm:text-4xl">
                    Join our community
                </h2>
                <p className="mt-4 text-lg tracking-tight text-black">
                    Follow us to be updated with
                </p>
                <span className="text-lg tracking-tight text-black">
                    our latest work and announcements
                </span>
                <div className="gap-4 space-x-2">
                    <a
                        href="https://twitter.com/Hola_Sui"
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-button bg-transparent w-1/3 border-2 border-[#AAAAAA] hover:border-yellowColor text-black hover:bg-yellowColor hover:text-white mt-10 group inline-flex items-center
                        justify-center rounded-lg py-2 px-4 pr-2 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 custom-cursor"
                    >
                        Twitter
                        <ExternalLinkIcon />
                    </a>
                    <a
                        href="https://www.discord.gg/X8SXejkVHs"
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-button bg-transparent w-1/3 border-2 border-[#AAAAAA] hover:border-orangeColor text-black hover:text-white mt-10 group inline-flex items-center
                    justify-center rounded-md py-2 px-4 pr-2 text-sm hover:bg-orangeColor font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 custom-cursor"
                    >
                        Discord
                        <ExternalLinkIcon />
                    </a>
                </div>
            </div>
        </div>
    );
};
