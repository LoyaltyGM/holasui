import { Container, SpaceInfoBanner, JourneyCard } from "components";
import { useState, useEffect } from "react";

export const SpaceDetailsLayout = () => {
  const Carousel = ({ children }: { children?: JSX.Element[] }) => {
    const [position, setPositon] = useState<number>(0);

    const handleSlide = (increment: number) => {
      setPositon(increment);
    };
    console.log(position);
    return (
      <div className="relative mt-10 min-h-[500px]">
        <button onClick={() => handleSlide(position - 724)}>left</button>
        <button onClick={() => handleSlide(position + 724)}>right</button>
        <div
          className={`absolute flex h-max translate-x-[${position}px] gap-6 transition-all duration-500`}
        >
          {children}
        </div>
      </div>
    );
  };
  return (
    <Container className="mb-[100px] overflow-hidden font-inter">
      <SpaceInfoBanner totalHolaPointsOnchain={250} />
      <div className="mt-[70px] text-blackColor">
        <h2 className="text-[26px] font-extrabold">Journeys from SuiFrens</h2>
        <p className="text-lg text-black2Color">
          Embark on an epic adventure in the captivating world of SuiFrens with thrilling journeys,
          captivating challenges and extraordinary rewards
        </p>
        <Carousel>
          <JourneyCard />
          <JourneyCard />
          <JourneyCard />
          <JourneyCard />
          <JourneyCard />
          <JourneyCard />
          <JourneyCard />
        </Carousel>
      </div>
    </Container>
  );
};
