import React from "react";

export const MainText = () => {
    return (
        <section className="w-full relative px-2 md:px-4 pt-4 pb-4 lg:pt-24 lg:pb-24 block">
            <div className="m-0 text-5xl lg:text-5xl">
                <div className="mask-content">
                    <span className={''}>Unlock the potential of</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span>the <span className={'text-blue-300'}>Sui Blockchain</span></span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span>with our robust tools.</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span>Explore a broad spectrum</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span>of features including</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span className={'text-purpleColor'}>NFT Staking,</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span className={'text-redColor'}>On-chain Quest Systems,</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span className={'text-yellowColor'}>P2P Item Swapping,</span>
                    <span className="mask"></span>
                </div>
                <div className="mask-content">
                    <span>and <span className={'text-orangeColor'}>DAO voting.</span></span>
                    <span className="mask"></span>
                </div>

            </div>
        </section>
    );
};
