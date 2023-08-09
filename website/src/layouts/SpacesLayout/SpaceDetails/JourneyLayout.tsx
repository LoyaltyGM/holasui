import { Container } from "components";
import Image from "next/image";
import GroupIcon from "/public/img/GroupIcon.svg";
import TestImage from "/public/img/Company_test_image.png";
import { QuestCard } from "components";

export const JourneyLayout = () => {
  const PeopleStatusBadge = ({ className }: { className?: string }) => {
    return (
      <div
        className={`flex w-max items-center rounded-[50px] border-2 border-white px-3 py-[6px] ${className}`}
      >
        <Image src={GroupIcon} alt={"Group icon"} height={20} width={20} />
        <p className="font-medium">200</p>
      </div>
    );
  };
  return (
    <Container className="relative bg-purpleColor font-inter text-white">
      <PeopleStatusBadge className="absolute right-0 top-0" />
      <div className="mb-10 flex flex-col items-center md:flex-row md:justify-between md:gap-10 lg:mb-[60px]">
        <div className="relative mb-6 h-[200px] w-[200px] md:h-[160px] md:w-[160px] lg:h-[177px] lg:w-[177px] xl:h-[200px] xl:w-[200px]">
          <Image src={TestImage} alt={"company logo"} fill className="rounded-full object-cover" />
        </div>
        <div className="lg:mt w-full flex-1 justify-between lg:mt-3 lg:flex">
          <div>
            <h1 className="mb-4 text-[26px] font-extrabold leading-8 md:text-[40px] lg:text-6xl">
              Bridges
            </h1>
            <p className="mb-8 font-medium md:min-h-[57px] lg:min-h-[100px]">
              Complete quests to get NFT reward
            </p>
          </div>
          <div className="flex items-start justify-between md:flex-row-reverse md:items-center lg:flex-col lg:justify-normal lg:gap-[30px]">
            <div className="flex flex-col items-center justify-center">
              <p className="text-3xl font-extrabold">1/5</p>
              <p className="text-xl font-medium">quest</p>
            </div>
            <div className="text-right md:flex md:items-center md:gap-4 md:text-center lg:flex-col">
              <button className="button-primary-yellow button-shadow w-[176px]">Claim NFT</button>
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