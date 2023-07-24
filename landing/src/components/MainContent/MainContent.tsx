import React from "react";
import {AppButton} from "components/Button/AppButton";
import {motion, useScroll, useTransform} from "framer-motion";
import ASSETS from "assets/";
import {MainImageLoading} from "components/MainImageLoading/MainImageLoading";
import {useEffect} from "react";

export const MainContent = () => {
    const {scrollYProgress} = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 2]);

    return (
        <div
            className="relative text-center content-center bg-fixed w-full max-h-screen max-w-screen-xl mt-20 md:mt-0 md:mb-10">
            <motion.div className="flex-shrink-0" style={{
                scale
            }}>
                <MainImageLoading
                    src={ASSETS.hero}
                    placeholderSrc={ASSETS.hero_small}
                    className="hidden min-h-screen md:flex w-full object-cover"
                />
                <MainImageLoading
                    src={ASSETS.hero_mobile}
                    placeholderSrc={ASSETS.hero_mobile_small}
                    className="flex md:hidden h-120 mb-10 md:mb-0 w-full object-cover"
                />
            </motion.div>
            <motion.div
                className="mb-10 md:mb-0 md:absolute right-0 top-[38%] text-3xl left-0 text-center lg:text-5xl md:text-4xl text-black font-black">
                <motion.p
                    initial={{y: 0, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 1, delay: 0.05}}
                >
                    We Provide<br className={'md:hidden'}/> the <span className={'text-redColor'}>Tools</span>
                </motion.p>

                <motion.p
                    initial={{y: 0, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 1, delay: 0.45}}
                    className={'mt-2 md:mt-4 italic'}
                >
                    You Build<br className={'md:hidden'}/> the <span className={'text-purpleColor'}>Community</span>
                </motion.p>

                {/*<motion.p*/}
                {/*    initial={{ y: 0, opacity: 0 }}*/}
                {/*    animate={{ y: 0, opacity: 1 }}*/}
                {/*    transition={{ duration: 1, delay: 0.95 }}*/}
                {/*</motion.p>*/}
            </motion.div>
            <motion.div
                initial={{y: 0, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{ease: "easeInOut", duration: 1.25, delay: 1.5}}
                className={'mt-4 md:mt-0 md:flex md:gap-2'}
            >
                <AppButton className="md:absolute w-full md:w-1/3 lg:w-1/3 xl:w-1/5 h-12 text-sm md:bottom-[15%] lg:bottom-[5%] md:left-[50%] text-center md:-translate-x-1/2 text-white bg-purpleColor border-4 border-purpleColor
                hover:bg-white hover:text-black rounded-lg"/>
            </motion.div>
        </div>
    );
};
