import { classNames } from "utils";
import Image from "next/image";
import { LabeledInput } from "components/Forms/Inputs";
import ImageSuiToken from "/public/img/SuiToken.png";
import { ISwapInformation } from "types";

export const SwapInformation = ({
  userObjectIds,
  setShowCollection,
  setCoinAmount,
  coinAmount = null,
  recipientAddress = "",
  isRecipient = false,
}: ISwapInformation) => {
  return (
    <div className="w-full md:mb-0 md:w-full ">
      <div
        className="mb-5 flex h-[45vh] w-full cursor-pointer flex-col justify-between rounded-lg border-[1px] border-grayColor bg-white px-2 py-2 font-normal text-purpleColor md:h-[30vh]"
        onClick={() => setShowCollection(true)}
      >
        <div
          className={
            "grid h-[27vh] grid-cols-3 gap-1 overflow-auto md:mt-4 md:h-[20vh] md:grid-cols-4 md:gap-4"
          }
        >
          {coinAmount !== 0 && coinAmount !== null ? (
            <div className="flex h-24 w-24 items-center justify-center gap-2 rounded-md border bg-white text-center text-2xl">
              <Image
                src={ImageSuiToken}
                alt="token"
                className="h-[25px] w-[26px]"
                aria-hidden="true"
              />
              <p>{`${coinAmount}`}</p>
            </div>
          ) : (
            <></>
          )}
          {userObjectIds?.map((object) => {
            return (
              <div
                key={object.id}
                className={classNames(
                  "flex h-24 w-24 cursor-pointer flex-col content-center items-center justify-center rounded-md border bg-white  p-2",
                  "",
                )}
              >
                <Image
                  src={object.url}
                  alt="collection_img"
                  width={90}
                  height={90}
                  className="mt-1"
                />
              </div>
            );
          })}
        </div>
        <p className="flex content-center items-center justify-center text-center font-medium text-blackColor">
          {isRecipient ? (
            <p>Specify wallet address to select tokens you want to get</p>
          ) : (
            <p>Specify NFTs and SUI you could offer</p>
          )}
        </p>
      </div>
      {/* Your Sui Value */}
      <div className="relative rounded-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center border-grayColor pl-3 pr-3">
          <Image src={ImageSuiToken} alt="token" className="h-[25px] w-[26px]" aria-hidden="true" />
        </div>
        <input
          className="block h-[46px] w-full rounded-md border border-grayColor bg-white pl-[46px] font-medium text-blackColor placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
          type="number"
          name="sui_amount"
          placeholder="SUI Amount Send"
          max="10000"
          min="0"
          onChange={(e) => setCoinAmount(Number(e.target.value))}
        />
      </div>
    </div>
  );
};
