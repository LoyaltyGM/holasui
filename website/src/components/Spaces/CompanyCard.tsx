import Image from "next/image";
import frensLogo from "/public/img/frens-logo.svg";

export const CompanyCard = () => {
  return (
    <div className="w-full rounded-xl border border-blackColor bg-white px-4 py-5 lg:p-5 xl:flex xl:flex-row-reverse xl:gap-4">
      <div className="mb-4 flex h-[130px] justify-center lg:h-[140px] xl:min-w-[170px]">
        <Image
          src={frensLogo}
          alt={"Company logo"}
          height={130}
          width={130}
          className="rounded-full text-center lg:h-[140px] lg:w-[140px] xl:h-[170px] xl:w-[170px]"
        />
      </div>
      <div>
        <div className="mb-5">
          <h2 className="mb-3 text-lg font-semibold lg:text-[22px]">Journeys from SuiFrens</h2>
          <p className="font-medium text-black2Color">
            Embark on an epic adventure in the captivating world of SuiFrens with thrilling quests,
            captivating challenges and extraordinary rewards
          </p>
        </div>
        <button className="button-secondary-purple button-shadow w-full">Complete quests</button>
      </div>
    </div>
  );
};
