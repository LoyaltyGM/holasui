import { Container } from "components";
import Link from "next/link";
import Image from "next/image";
import DAOLogo from "/public/img/homeScreen/DAOLogo.png";
import StakingLogo from "/public/img/homeScreen/StakingLogo.png";
import SwapLogo from "/public/img/homeScreen/SwapLogo.png";
import QuestLogo from "/public/img/homeScreen/QuestLogo.png";

export const HomeLayout = () => {
  const colorType = {
    yellow: "yellowColor",
    red: "redColor",
    orange: "orangeColor",
    purple: "purpleColor",
  } as const;

  type ColorCard = (typeof colorType)[keyof typeof colorType];
  const CardLayout = ({
    title,
    img,
    color,
    link,
  }: {
    title: string;
    img: any;
    color: ColorCard;
    link: string;
  }) => {
    return (
      <div
        className={`proposal-card-shadow hover:button-shadow flex h-[140px] w-full flex-col content-center items-center justify-center rounded-2xl border-2 border-blackColor bg-white hover:border-${color} md:max-h-[140px] md:min-h-[140px] md:min-w-[336px] md:max-w-[336px] lg:max-h-[210px] lg:min-h-[210px] lg:min-w-[416px] lg:max-w-[416px] xl:max-h-[300px] xl:min-h-[300px] xl:min-w-[560px] xl:max-w-[560px]`}
      >
        <Link href={link} className={" flex flex-col content-center items-center justify-center "}>
          <p
            className={`text-${color} mb-1 font-inter text-[26px] font-semibold md:mb-3 lg:text-[30px] xl:mb-8`}
          >
            {title}
          </p>
          <Image
            src={img}
            alt={title}
            className={
              "max-h-[76px] min-h-[76px] min-w-[246px] max-w-[246px] object-contain lg:max-h-[112px] lg:min-h-[112px] lg:min-w-[356px] lg:max-w-[356px] xl:max-h-[130px] xl:min-h-[130px] xl:min-w-[488px] xl:max-w-[488px]"
            }
            unoptimized={true}
            priority={true}
          ></Image>
        </Link>
      </div>
    );
  };

  return (
    <Container className="font-inter">
      <div
        className={
          "grid grid-cols-1 grid-rows-1 content-center items-center justify-center gap-2 font-inter md:grid-cols-2 md:grid-rows-2"
        }
      >
        <CardLayout
          title={"Staking"}
          img={StakingLogo}
          color={colorType.orange}
          link={"/staking"}
        />
        <CardLayout title={"DAO"} img={DAOLogo} color={colorType.yellow} link={"/dao"} />

        <CardLayout title={"Quests"} img={QuestLogo} color={colorType.red} link={"/spaces"} />
        <CardLayout title={"P2P Swap"} img={SwapLogo} color={colorType.purple} link={"/swap"} />
      </div>
    </Container>
  );
};
