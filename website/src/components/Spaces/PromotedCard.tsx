import Image from "next/image";
import Link from "next/link";
import { Button } from "components";

interface IPromotedCard {
  title: string;
  description: string;
  image_url: string;
  spaceAddress: number;
}

export const PromotedCard = (props: IPromotedCard) => {
  const CompanyImage = () => {
    return (
      <div className="relative mx-auto mb-4 flex h-[130px] w-[130px] justify-center rounded-full lg:h-[140px] lg:w-[140px] xl:mx-0 xl:h-[170px] xl:w-[170px]">
        <Image
          src={props.image_url}
          alt={"Company image"}
          fill
          className="rounded-full object-contain"
        />
      </div>
    );
  };
  const CompanyInfo = () => {
    return (
      <div className="flex flex-col justify-between">
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-semibold lg:text-[22px]">Journeys from {props.title}</h2>
          <p className="font-medium text-black2Color">{props.description}</p>
        </div>
        <Link href={`spaces/${props.spaceAddress}`}>
          <Button btnType="button" variant="button-primary-puprle" size="sm-full">
            Complete quests
          </Button>
        </Link>
      </div>
    );
  };
  return (
    <div className="w-full rounded-xl border border-blackColor bg-white px-4 py-5 lg:p-5 xl:flex xl:min-h-[241px] xl:flex-row-reverse xl:justify-between xl:gap-4">
      <CompanyImage />
      <CompanyInfo />
    </div>
  );
};
