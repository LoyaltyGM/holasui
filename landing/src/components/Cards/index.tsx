import React from "react";
import { Card } from "components/Cards/Card";
import ASSETS from "assets";

export const CardsSection = () => {
    const CardInfo = {
        0: {
            title: "Collect, Burn, Vote with Hola Points",
            description: `Participate actively on our platform and earn Hola Points. 
            Use them for voting in DAO, claim rewards, or burn them for 
            other utilities in our dynamic ecosystem.`,
            image: ASSETS.card_1,
            linkToPage: "https://dashboard.holasui.app"
        },
        1: {
            title: "Stake NFTs & Get More",
            description:
                `Enable free NFT staking for your project on our platform and earning either project tokens or Hola Points.`,
            image: ASSETS.card_2,
            linkToPage: "https://dashboard.holasui.app/staking"
        },
        2: {
            title: "Safe P2P NFT Swaps",
            description:
                "Swap NFTs with peace of mind using our secure P2P Swap tool. Just share a link with your friend and exchange NFTs seamlessly and securely.",
            image: ASSETS.card_3,
            linkToPage: "https://dashboard.holasui.app/swap"
        },
        3: {
            title: "Engage & Explore with Quest System",
            description:
                "Immerse yourself in our unique Quest system. Accomplish tasks, discover new aspects of our platform, and earn rewards each time you complete a quest.",
            image: ASSETS.card_4,
            linkToPage: "https://dashboard.holasui.app/quest"
        },
    };

    return (
        <div className="place-items-center mt-8 grid gap-5 md:max-w-none md:grid-cols-1 md:gap-6 lg:gap-6 lg:max-w-none lg:grid-cols-2">
            <Card className="w-full text-redColor bg-bgColor border-4 border-transparent hover:bg-white hover:border-redColor" cardObject={CardInfo[0]} />
            <Card className="w-full text-yellowColor bg-bgColor border-4 border-transparent hover:bg-white hover:border-yellowColor" cardObject={CardInfo[1]} />
            <Card className="w-full text-purpleColor bg-bgColor border-4 border-transparent hover:bg-white hover:border-purpleColor" cardObject={CardInfo[2]} />
            <Card className="w-full text-orangeColor bg-bgColor border-4 border-transparent hover:bg-white hover:border-orangeColor" cardObject={CardInfo[3]} />
        </div>
    );
};
