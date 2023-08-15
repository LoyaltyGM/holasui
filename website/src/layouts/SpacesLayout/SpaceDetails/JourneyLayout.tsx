import { Container } from "components";
import Image from "next/image";
import GroupIcon from "/public/img/GroupIcon.svg";
import mockup_image from "/public/img/mockup1.png";
import { QuestCard } from "components";

export const JourneyLayout = () => {
  const PeopleStatusBadge = ({ className }: { className?: string }) => {
    return (
      <div
        className={`flex w-max items-center gap-1 rounded-[50px] border-2 border-white px-3 py-[6px] ${className}`}
      >
        <Image src={GroupIcon} alt={"Group icon"} height={22} width={18} />
        <p className="font-medium">
          200 <span className="hidden md:inline">claimed</span>
        </p>
      </div>
    );
  };
  const Info = () => (
    <div>
      <h1 className="mb-4 text-[26px] font-extrabold leading-8 md:text-[40px] lg:text-6xl">
        Bridges
      </h1>
      <p className="mb-8 font-medium md:min-h-[57px] lg:min-h-[100px]">
        Complete quests to get NFT reward
      </p>
    </div>
  );
  return (
    <Container className="bg-purpleColor font-inter text-white">
      <div className="relative w-full">
        <PeopleStatusBadge className="absolute right-0 top-0" />
      </div>
      <div className="mb-10 flex flex-col items-center md:flex-row md:justify-between md:gap-10 lg:mb-[60px]">
        <div className="relative mb-6 h-[200px] w-[200px] md:h-[160px] md:w-[160px] lg:h-[177px] lg:w-[177px] xl:h-[200px] xl:w-[200px]">
          <Image
            src={mockup_image}
            alt={"company logo"}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="lg:mt w-full flex-1 justify-between lg:mt-3 lg:flex">
          <Info />
          <div className="flex items-start justify-between md:flex-row-reverse md:items-center lg:flex-col lg:justify-normal lg:gap-[30px]">
            <div className="flex flex-col items-center justify-center">
              <p className="text-3xl font-extrabold">1/5</p>
              <p className="text-xl font-medium">quest</p>
            </div>
            <div className="text-right md:flex md:items-center md:gap-4 md:text-center lg:flex-col">
              <button className="button-primary-yellow button-shadow mb-2 w-[176px] md:mb-0">
                Claim NFT
              </button>
              <p className="font-medium leading-5 md:max-w-[110px] lg:max-w-none">
                2 quests left for claiming
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-[10px] md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        <QuestCard />
        <QuestCard />
        <QuestCard />
        <QuestCard />
      </div>
    </Container>
  );
};
