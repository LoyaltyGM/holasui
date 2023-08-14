import Image from "next/image";
import Company_logo from "/public/img/Company_test_image.png";
import Link from "next/link";

export const JourneyCard = () => {
  const ImageInfoPlate = () => (
    <div className="relative mb-1 h-[232px] w-full md:h-[196px] lg:h-[232px]">
      <Image
        src={Company_logo}
        alt={"logo"}
        fill
        className="rounded-t-lg object-cover md:rounded-tl-none"
      />
      <div className="absolute right-[10px] top-[10px] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-base">
        <span className="font-medium">1/7</span>
      </div>
    </div>
  );
  const TitleAndBtn = () => (
    <div className="mx-4">
      <h2 className="mb-6 text-[26px] font-bold md:text-[40px] md:font-extrabold md:leading-[48px] lg:mb-10 lg:text-6xl">
        Bridges mgdf
      </h2>
      <Link href={`SuiFrens/quests`}>
        <button className="button-secondary-purple button-shadow button-shadow:active w-[176px] border-black2Color">
          Complete quests
        </button>
      </Link>
    </div>
  );
  const TimePlate = () => (
    <div className="flex h-[108px] items-center gap-3 rounded-b-xl border-t-6 border-dashed border-basicColor bg-purpleColor p-4 md:order-first md:min-h-full md:w-[180px] md:items-end md:rounded-l-lg md:rounded-br-none md:border-r-6 md:border-t-0 lg:w-[220px]">
      <div className="font-medium text-white">
        <p className="mb-2">Start</p>
        <p>End</p>
      </div>
      <div className="font-semibold text-white">
        <p className="mb-2">June 1</p>
        <p>June 30</p>
      </div>
    </div>
  );
  return (
    // TODO: fix card shadow only from lg screen
    <div className="card-shadow flex min-w-[310px] flex-col justify-center rounded-xl bg-white md:h-[340px] md:min-w-[600px] md:max-w-[600px] md:flex-row md:border-2 md:border-blackColor lg:h-[400px] lg:min-w-[700px] lg:max-w-[700px]">
      <div className="mb-5 flex-1">
        <ImageInfoPlate />
        <TitleAndBtn />
      </div>
      <TimePlate />
    </div>
  );
};
