import Image from "next/image";
import frensLogo from "/public/img/frens-logo.svg";

export const SpaceCard = () => {
  return (
    <div className="card-shadow flex max-h-[180px] w-full gap-5 rounded-[20px] border border-blackColor bg-white p-[15px] text-blackColor">
      <div className="flex h-[150px] w-[150px] items-center">
        <Image
          src={frensLogo}
          alt={"Frens logo"}
          height={150}
          width={150}
          className="rounded-[20px]"
        />
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="mb-[14px] text-lg font-semibold leading-[22px]">Space name</h2>
          <p className="font-medium">10 quests</p>
        </div>
        {/* TODO: Separate to the other component LINK or make it with tailwind classes?? */}
        <button className="group h-[30px] w-[88px]">
          <p className="font-medium leading-5 text-purpleColor duration-200 group-hover:text-blackColor group-active:text-purpleColorHover group-disabled:text-grayColor">
            Learn more
          </p>
          <div className="h-[2px] w-full rounded-[10px] bg-purpleColor duration-200 group-hover:bg-blackColor group-active:bg-purpleColorHover group-disabled:bg-grayColor" />
        </button>
      </div>
    </div>
  );
};
