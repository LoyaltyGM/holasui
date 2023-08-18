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
      <div className="relative mx-auto mb-4 flex min-h-[130px] min-w-[130px] justify-center rounded-full lg:min-h-[140px] lg:min-w-[140px] xl:mx-0 xl:min-h-[170px] xl:min-w-[170px]">
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
        {/* TODO: fix overflow title width. description overflow height. maybe add dynamic height of promoted card */}
        <div className="mb-5 xl:w-[330px]">
          <h2 className="max-w mb-3 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold leading-[22px] lg:text-[22px]">
            Journeys from {props.title}
          </h2>
          <p className="overflow-hidden text-ellipsis font-medium leading-[1.4] text-black2Color xl:max-h-[88px]">
            {props.description}
          </p>
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
    <div className="w-full rounded-xl border border-blackColor bg-white px-4 py-5 lg:p-5 xl:flex xl:max-h-[241px] xl:min-h-[241px] xl:flex-row-reverse xl:justify-between xl:gap-4">
      <CompanyImage />
      <CompanyInfo />
    </div>
  );
};
