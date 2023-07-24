import React, { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MainContent } from "./components/MainContent";
import "./styles/globals.css";
import Layout from "./components/Layout";
import { MainText } from "components/TextContent/MainText";
import { CardsSection } from "components/Cards/";
import { SocialNetwork } from "components/SocialNetwork/SocialNetwork";
import CustomCursor from "custom-cursor-react";
import "custom-cursor-react/dist/index.css";
import "./scroll";

function Landing() {
    return (
        <>
            <div className="scrollbar-hide">
                <CustomCursor
                    targets={[".custom-cursor"]}
                    customClass="custom-cursor"
                    dimensions={45}
                    fill="#ABB8C3"
                    targetScale={2.5}
                    smoothness={{
                        movement: 0.25,
                        scale: 0.3,
                        opacity: 0.2,
                    }}
                    targetOpacity={0.5}
                />
                <Layout className="layout-base w-full px-2 mt-[-3.75rem]">
                    <MainContent />
                    <MainText />
                    <CardsSection />
                    <SocialNetwork />
                </Layout>
            </div>
        </>
    );
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Landing />);
