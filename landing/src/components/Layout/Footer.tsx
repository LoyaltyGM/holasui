import * as React from "react";
import ASSETS from "assets";

const Footer = () => {
    return (
        <footer className="absolute bottom-1 mt-10 w-full px-2">
            <div className="max-w-full md:flex justify-center content-center items-center px-4 mx-auto sm:px-6 lg:px-8 bg-purpleColor pb-2 rounded-md text-center">
                <div className="w-full md:py-8 py-8 flex items-center justify-center md:justify-start">
                    <img src={ASSETS.logo} height={160} width={220} alt={"logo"} />
                </div>
                <div className="gap-2 text-sm text-white">
                    <p>contact@holasui.app</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
