import { Container, SpaceInfoBanner, JourneyCard } from "components";
import { useState, useEffect } from "react";

export const SpaceDetailsLayout = () => {
  const Carousel = ({ children }: { children?: JSX.Element[] }) => {
    const [position, setPositon] = useState<number>(0);

    console.log(position);
    return (
      <div className="mt-10 min-h-[500px]">
        <button onClick={() => setPositon(position - 724)}>left</button>
        <button onClick={() => setPositon(position + 724)}>right</button>
        <div
          className={`flex h-max gap-6 transition-all duration-500`}
          style={{ transform: `translateX(${position}px)` }}
        >
          {children}
        </div>
      </div>
    );
  };
  return (
    <Container className="mb-[100px] overflow-x-hidden font-inter">
      <SpaceInfoBanner totalHolaPointsOnchain={250} />
      <div className="mt-[70px] text-blackColor">
        <h2 className="text-[26px] font-extrabold">Journeys from SuiFrens</h2>
        <p className="text-lg text-black2Color">
          Embark on an epic adventure in the captivating world of SuiFrens with thrilling journeys,
          captivating challenges and extraordinary rewards
        </p>
      </div>

      <div className="w-screen"></div>
      <Carousel>
        <JourneyCard />
        <JourneyCard />
        <JourneyCard />
      </Carousel>
    </Container>
  );
};
