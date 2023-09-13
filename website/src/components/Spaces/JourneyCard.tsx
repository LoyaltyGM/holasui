import Image from "next/image";
import { Button, Spinner } from "components";
import { IJourney } from "types";
import { formatTimestampToDate, getTodayMilliseconds } from "utils";
import { useRouter } from "next/router";
import { useJourneyStore } from "store";
import { useEffect, useState } from "react";

type Color = "purpleColor" | "orangeColor" | "pinkColor";
type ButtonVariant =
  | "button-secondary-purple"
  | "button-secondary-orange"
  | "button-secondary-pink";
type JourneyStatus = "over" | "not started" | "active" | null;

export const JourneyCard = ({
  journey,
  index,
  totalJourneys,
}: {
  journey: IJourney;
  index: number;
  totalJourneys: number;
}) => {
  const { setBgColor } = useJourneyStore();
  const router = useRouter();
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>(null);
  useEffect(() => {
    if (journey.end_time < getTodayMilliseconds()) {
      setJourneyStatus("over");
    }
    if (journey.start_time > getTodayMilliseconds()) {
      setJourneyStatus("not started");
    } else {
      setJourneyStatus("active");
    }
  }, []);

  const getButtonTitle = () => {
    switch (journeyStatus) {
      case "active":
        return "Complete quests";
      case "not started":
        return "Not started";
      case "over":
        return "Get reward";
      default:
        throw new Error(`Unknown journey status: ${journeyStatus}`);
    }
  };

  const getColorForIndex = (index: number): [Color, ButtonVariant] => {
    const bgColors: Color[] = ["purpleColor", "orangeColor", "pinkColor"];
    const btnVariants: ButtonVariant[] = [
      "button-secondary-purple",
      "button-secondary-orange",
      "button-secondary-pink",
    ];
    const colorIndex = index % bgColors.length;
    const bgColor = bgColors[colorIndex];
    const btnVariant = btnVariants[colorIndex];
    return [bgColor, btnVariant];
  };
  const [bgColor, btnVariant] = getColorForIndex(index);

  const handleClickCompeleteQuests = () => {
    setBgColor(bgColor);
    router.push(`${router.asPath}/${journey.id}`);
  };

  const ImageInfoPlate = () => (
    <div className="relative mb-1 h-[232px] w-full md:h-[196px] lg:h-[232px]">
      <Image
        src={journey.reward_image_url}
        alt={"Journey image"}
        fill
        className="rounded-t-lg object-cover md:rounded-tl-none"
      />
      <div className="absolute right-[10px] top-[10px] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-white text-base">
        <span className="font-medium">{`${index + 1}/${totalJourneys}`}</span>
      </div>
    </div>
  );
  const TitleAndBtn = () => (
    <div className="mx-4">
      <h2 className="mb-6 line-clamp-1 text-[26px] font-bold md:text-4xl md:font-extrabold lg:mb-10 lg:text-5xl lg:leading-tight">
        {journey.name}
      </h2>
      <Button
        btnType="button"
        variant={btnVariant}
        disabled={getTodayMilliseconds() < journey.start_time}
        onClick={handleClickCompeleteQuests}
      >
        {journeyStatus ? getButtonTitle() : <Spinner />}
      </Button>
    </div>
  );
  const TimePlate = () => (
    <div
      className={`bg-${bgColor} flex h-[108px] items-center gap-3 rounded-b-xl border-t-6 border-dashed border-basicColor p-4 md:order-first md:min-h-full md:w-[180px] md:items-end md:rounded-l-lg md:rounded-br-none md:border-r-6 md:border-t-0 lg:w-[220px]`}
    >
      {journeyStatus === "over" ? (
        <p className="font-medium text-white">Journey is over</p>
      ) : (
        <>
          <div className="font-medium text-white">
            <p className="mb-2">Start</p>
            <p>End</p>
          </div>
          <div className="font-semibold text-white">
            <p className="mb-2">{formatTimestampToDate(journey.start_time)}</p>
            <p>{formatTimestampToDate(journey.end_time)}</p>
          </div>
        </>
      )}
    </div>
  );
  return (
    // TODO: fix card shadow only from lg screen
    <div className="card-shadow flex min-w-[310px] max-w-[310px] flex-col justify-center rounded-xl bg-white md:h-[340px] md:min-w-[600px] md:max-w-[600px] md:flex-row md:border-2 md:border-blackColor md:text-sm lg:h-[400px] lg:min-w-[700px] lg:max-w-[700px] lg:text-base">
      <div className="mb-5 flex-1">
        <ImageInfoPlate />
        <TitleAndBtn />
      </div>
      <TimePlate />
    </div>
  );
};
