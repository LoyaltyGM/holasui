import Image from "next/image";
import Link from "next/link";
import { ISpaceCard } from "types";

export const SpaceCard = (props: ISpaceCard) => {
  const CompanyImage = () => (
    <div className="relative flex min-h-[120px] min-w-[120px] items-center lg:min-h-[150px] lg:min-w-[150px]">
      <Image src={props.image_url} alt={"Company image"} fill className="rounded-xl object-cover" />
    </div>
  );
  const CompanyInfoAndButton = () => (
    <div className="flex flex-col justify-between">
      <div>
        <h2 className="line-clamp-2 text-lg font-semibold leading-[22px] lg:mb-[14px]">
          {props.title}
        </h2>
        <p className="line-clamp-2 font-medium leading-[22px] text-black2Color">
          {props.description}
        </p>
      </div>
      {/* TODO: Separate to the other component LINK or make it with tailwind classes?? */}
      <Link href={`spaces/${props.spaceAddress}`}>
        <button className="group h-[30px] w-[88px]">
          <p className="font-medium leading-5 text-purpleColor duration-200 group-hover:text-blackColor group-active:text-purpleColorHover group-disabled:text-grayColor">
            Learn more
          </p>
          <div className="h-[2px] w-full rounded-[10px] bg-purpleColor duration-200 group-hover:bg-blackColor group-active:bg-purpleColorHover group-disabled:bg-grayColor" />
        </button>
      </Link>
    </div>
  );
  return (
    <div className="card-shadow flex max-h-[150px] w-full gap-5 rounded-[20px] border border-blackColor bg-white p-[15px] text-blackColor lg:max-h-[180px]">
      <CompanyImage />
      <CompanyInfoAndButton />
    </div>
  );
};
