import { useEffect, useState } from "react";

const MD_WIDTH = 768;
const LG_WIDTH = 976;

const MD_GAP = 16;
const LG_GAP = 24;

const MD_CARD_WIDTH = 600;
const LG_CARD_WIDTH = 700;

const useWidth = (): number => {
  const [width, setWindowDimensions] = useState<number>(0);
  useEffect(() => {
    function handleResize(): void {
      setWindowDimensions(window.innerWidth);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return width;
};

export const Carousel = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const width = useWidth();
  const lastIndex: number = Array.isArray(children) ? children.length - 1 : 0;
  const [curPosition, setCurPosition] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [curScreen, setCurScreen] = useState<string | null>(null);
  const [currentCardIdx, setCurrentCardIdx] = useState<number>(0);

  useEffect(() => {
    let newCurrentScreen = "";
    let newMaxWidth = 0;

    if (!Array.isArray(children)) {
      setMaxWidth(0);
      return;
    }
    if (width >= MD_WIDTH && width < LG_WIDTH) {
      newCurrentScreen = "medium";
      newMaxWidth = lastIndex * MD_CARD_WIDTH + lastIndex * MD_GAP;
    }
    if (width >= LG_WIDTH) {
      newCurrentScreen = "large";
      newMaxWidth = lastIndex * LG_CARD_WIDTH + lastIndex * LG_GAP;
    }
    if (newCurrentScreen !== curScreen) {
      const calculatePosition = () => (newMaxWidth / lastIndex) * currentCardIdx;

      setCurPosition(-calculatePosition());
      setCurScreen(newCurrentScreen);
      setMaxWidth(newMaxWidth);
    }
  }, [width]);

  const slideRight = () => {
    if (curPosition <= -maxWidth) {
      return;
    } else if (width >= MD_WIDTH && width < LG_WIDTH) {
      setCurrentCardIdx(currentCardIdx + 1);
      setCurPosition(curPosition - 616);
    } else if (width >= LG_WIDTH) {
      setCurrentCardIdx(currentCardIdx + 1);
      setCurPosition(curPosition - 724);
    }
  };
  const slideLeft = () => {
    if (curPosition >= 0) {
      return;
    } else if (width >= MD_WIDTH && width < LG_WIDTH) {
      setCurrentCardIdx(currentCardIdx - 1);
      setCurPosition(curPosition + 616);
    } else if (width >= LG_WIDTH) {
      setCurrentCardIdx(currentCardIdx - 1);
      setCurPosition(curPosition + 724);
    }
  };
  // TODO: Make separate arrow(additional) button
  const ArrowIconLeft = ({ disabled }: { disabled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M12.5 4.16669L7.5 10L12.5 15.8334"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={disabled ? "stroke-grayColor" : "stroke-blackColor"}
      />
    </svg>
  );
  const ArrowIconRight = ({ disabled }: { disabled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M7.5 4.16669L12.5 10L7.5 15.8334"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        className={disabled ? "stroke-grayColor" : "stroke-blackColor"}
      />
    </svg>
  );
  return (
    <div className="h-max">
      {Array.isArray(children) && (
        <div className="mb-5 hidden justify-end gap-2 md:flex">
          <button
            onClick={slideLeft}
            disabled={currentCardIdx === 0}
            className="flex h-[30px] w-10 items-center justify-center rounded-lg border border-blackColor bg-white disabled:border-grayColor"
          >
            <ArrowIconLeft disabled={currentCardIdx === 0} />
          </button>
          <button
            onClick={slideRight}
            disabled={currentCardIdx === children.length - 1}
            className="flex h-[30px] w-10 items-center justify-center rounded-lg border border-blackColor bg-white disabled:border-grayColor"
          >
            <ArrowIconRight disabled={currentCardIdx === children.length - 1} />
          </button>
        </div>
      )}

      <div
        className="hide-scroll-bar flex h-max gap-4 overflow-x-auto transition-all duration-500  md:overflow-visible lg:gap-6"
        style={{ transform: `translateX(${curPosition}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
