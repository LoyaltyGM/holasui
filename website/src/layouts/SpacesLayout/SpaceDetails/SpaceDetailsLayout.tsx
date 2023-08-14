import { Container, SpaceInfoBanner, JourneyCard, Carousel } from "components";

export const SpaceDetailsLayout = () => {
  const Info = () => (
    <div className="mt-10 text-blackColor md:mt-[50px] lg:mt-[70px]">
      <div className="flex flex-wrap justify-between">
        <h2 className="mb-3 text-[26px] font-extrabold md:mb-5">Journeys from SuiFrens</h2>
        <p className="order-last mb-3 text-[22px] font-semibold text-purpleColor md:order-none">
          Week 1
        </p>
        <div className="mb-4 w-full font-medium">
          <p className="max-w-[660px] text-lg text-black2Color">
            Embark on an epic adventure in the captivating world of SuiFrens with thrilling
            journeys, captivating challenges and extraordinary rewards
          </p>
        </div>
      </div>
    </div>
  );
  return (
    <Container className="mb-[100px] overflow-x-hidden font-inter">
      <SpaceInfoBanner totalHolaPointsOnchain={250} />
      <Info />
      <div className="w-screen"></div>
      <Carousel>
        <JourneyCard />
        <JourneyCard />
        <JourneyCard />
        <JourneyCard />
      </Carousel>
    </Container>
  );
};
