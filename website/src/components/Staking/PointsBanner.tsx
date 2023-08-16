import Image from "next/image";
import pointsLogo from "/public/img/points.png";
import { formatNumber } from "utils";
import { claimBatchPoints } from "../../layouts/StakingLayout/StakingProviderFunction";
import { Button } from "components/Reusable";

export const PointsBanner = ({
  availablePointsToClaim,
  functionToClaimPoints,
}: {
  availablePointsToClaim: number;
  functionToClaimPoints: () => void;
}) => {
  return (
    <div className="mt-5 flex w-auto flex-col content-center items-center justify-between gap-5 rounded-lg bg-pinkColor p-4 pb-6 text-white md:mx-[25px] md:mt-8 md:flex-row md:py-6">
      <div className="w-full">
        <p className="mb-4 text-lg font-semibold">Your Hola Points</p>
        <div className="flex items-center gap-[6px]">
          <Image src={pointsLogo} alt={"Points Logo"} width={40} height={40} />
          <p className="text-[26px] font-extrabold md:text-3xl">
            {formatNumber(availablePointsToClaim)}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center gap-4 md:items-center lg:flex-row lg:gap-8">
        <div className="md:text-center lg:text-left">
          <p className="font-medium md:whitespace-nowrap">You have some points for claiming</p>
          <p className="font-medium md:whitespace-nowrap">Grab them and increase your rewards!</p>
        </div>
        <Button
          btnType="button"
          size="sm-full"
          variant="default-pink"
          onClick={functionToClaimPoints}
        >
          Claim Points
        </Button>
      </div>
    </div>
  );
};
