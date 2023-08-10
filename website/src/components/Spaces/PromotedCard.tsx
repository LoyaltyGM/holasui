import Image from "next/image";
import Link from "next/link";

interface IPromotedCard {
  title: string;
  description: string;
  imageUrl: string;
  spaceAddress: string;
}

export const PromotedCard = (props: IPromotedCard) => {
  const CompanyImage = () => {
    return (
      <div className="mb-4 flex h-[130px] justify-center lg:h-[140px] xl:min-w-[170px]">
        <Image
          src={props.imageUrl}
          alt={"Company image"}
          height={130}
          width={130}
          className="rounded-full text-center lg:h-[140px] lg:w-[140px] xl:h-[170px] xl:w-[170px]"
        />
      </div>
    );
  };
  const CompanyInfo = () => {
    return (
      <div>
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-semibold lg:text-[22px]">Journeys from {props.title}</h2>
          <p className="font-medium text-black2Color">{props.description}</p>
        </div>
        <Link href={`spaces/${props.spaceAddress}`}>
          <button className="button-primary-purple button-shadow w-full">Complete quests</button>
        </Link>
      </div>
    );
  };
  return (
    <div className="w-full rounded-xl border border-blackColor bg-white px-4 py-5 lg:p-5 xl:flex xl:flex-row-reverse xl:gap-4">
      <CompanyImage />
      <CompanyInfo />
    </div>
  );
};
