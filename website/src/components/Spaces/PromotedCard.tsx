import Image from "next/image";
import Link from "next/link";
import { Button } from "components";

interface IPromotedCard {
  title: string;
  description: string;
  image_url: string;
  spaceAddress: string;
}

export const PromotedCard = (props: IPromotedCard) => {
  const CompanyImage = () => {
    return (
      <div className="relative mx-auto mb-4 flex min-h-[130px] min-w-[130px] justify-center rounded-full lg:min-h-[140px] lg:min-w-[140px] xl:mx-0 xl:max-h-[170px] xl:min-h-[170px] xl:min-w-[170px]">
        <Image
          src={props.image_url}
          alt={"Company image"}
          fill
          className="rounded-full object-cover"
        />
      </div>
    );
  };
  const CompanyInfo = () => {
    return (
      <div className="flex flex-1 flex-col justify-between">
        {/* TODO: fix overflow title width. description overflow height. maybe add dynamic height of promoted card */}
        <div className="mb-5 md:mb-4">
          <h2 className="max-w mb-3 line-clamp-2 text-lg font-semibold leading-[22px] lg:text-[22px] lg:leading-[27px]">
            Journeys from {props.title}
          </h2>
          <p className="line-clamp-4 font-medium leading-[22px] text-black2Color sm:line-clamp-3 md:line-clamp-4 xl:max-h-[88px]">
            {props.description}
          </p>
        </div>
        <Button
          btnType="button"
          href={`spaces/${props.spaceAddress}`}
          variant="button-primary-puprle"
          size="sm-full"
        >
          Complete quests
        </Button>
      </div>
    );
  };
  return (
    <div className="flex max-h-[402px] min-h-[380px] w-full flex-col rounded-xl border border-blackColor bg-white px-4 py-5 sm:max-h-[376px] sm:min-h-[354px] md:max-h-[394px] md:min-h-[368px] lg:max-h-[418px] lg:min-h-[391px] lg:p-5 xl:max-h-[268px] xl:min-h-[241px] xl:flex-row-reverse xl:justify-between xl:gap-4">
      <CompanyImage />
      <CompanyInfo />
    </div>
  );
};
