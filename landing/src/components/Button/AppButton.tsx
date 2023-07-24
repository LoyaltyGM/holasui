import { ExternalLinkIcon } from "../Icons/ExternalLinkIcon";
import React from "react";
import classNames from "classnames";

const WEBSITE = "https://dashboard.holasui.app/";

export const AppButton = ({ className }: {className?: string}) => {
    return (
        <a
            href={WEBSITE}
            className={classNames(
                "btns-rounded flex flex-row justify-center md:w-full py-4 md:mx-2 px-8 border-2 items-center custom-cursor",
                className
            )}
        >
            <span>Join the space</span>
            <div>
                <ExternalLinkIcon />
            </div>
        </a>
    );
};
