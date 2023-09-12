import { ethos, EthosConnectStatus } from "ethos-connect";
import {
  NoConnectWallet,
  Container,
  DragAndDropImageForm,
  Button,
  Label,
  AlertSucceed,
  AlertErrorMessage,
  LabeledInput,
  Breadcrumbs,
} from "components";
import { useState, useEffect } from "react";
import { ISpaceAdminCap } from "types";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  REWARD_TYPE_NFT,
  REWARD_TYPE_SOULBOUND,
  convertDateToTimestamp,
  getTodayDate,
} from "utils";
import { toast } from "react-hot-toast";
import { storeNFT } from "services/ipfs";
import { signTransactionCreateJourney, suiProvider } from "services/sui";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { useRouter } from "next/router";
import { NextPage } from "next";
import { getObjectFields } from "@mysten/sui.js";

interface ISpaceAddressProps {
  spaceAddress: string;
}

type RewardTypes = "NFT" | "SOULBOUND";

interface Inputs {
  reward_image_url: string;
  name: string;
  description: string;
  reward_type: RewardTypes;
  reward_required_points: number;
  start_time: string;
  end_time: string;
}

export const CreateJourneyLayout: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  const { wallet, status } = ethos.useWallet();
  const [image, setImage] = useState<File | null>(null);
  const [isFetching, setFetching] = useState<boolean>(true);
  // FIXME: now default value is 'mockup'. solve what to put instead of
  const [adminCap, setAdminCap] = useState<string>("mockup");
  const [spaceName, setSpaceName] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    async function fetchAdminCapAndSpaceName() {
      if (isFetching && wallet) {
        try {
          const spaceObject = await suiProvider.getObject({
            id: spaceAddress,
            options: {
              showContent: true,
            },
          });
          const space = getObjectFields(spaceObject) as any;
          setSpaceName(space.name);
          const ownedObjects = wallet?.contents?.objects!;
          const adminCap: ISpaceAdminCap | undefined = ownedObjects
            .map((object) => getObjectFields(object) as ISpaceAdminCap)
            .filter(
              (object) =>
                object?.hasOwnProperty("space_id") &&
                object?.hasOwnProperty("id") &&
                object?.hasOwnProperty("name"),
            )
            .find(({ space_id }) => space_id === spaceAddress);
          if (adminCap) {
            setAdminCap(adminCap.id.id);
          }
          setFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchAdminCapAndSpaceName().then();
  }, [status]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Inputs>();

  const rewardTypeChange = (selectedValue: RewardTypes): number => {
    switch (selectedValue) {
      case "NFT":
        return REWARD_TYPE_NFT;
      case "SOULBOUND":
        return REWARD_TYPE_SOULBOUND;
      default:
        throw new Error(`Unknown reward type: ${selectedValue}`);
    }
  };

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    try {
      if (!image) {
        toast.error("Please upload image");
        return;
      }
      form.reward_image_url = await storeNFT(image);

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateJourney({
          admin_cap: adminCap,
          space: spaceAddress,
          reward_type: rewardTypeChange(form.reward_type),
          reward_image_url: form.reward_image_url,
          reward_required_points: form.reward_required_points,
          name: form.name,
          description: form.description,
          start_time: convertDateToTimestamp(form.start_time),
          end_time: convertDateToTimestamp(form.end_time),
        }),
        options: {
          showEffects: true,
        },
      });
      const status = getExecutionStatus(response);

      if (status?.status === "failure") {
        console.log(status.error);
        const error_status = getExecutionStatusError(response);
        if (error_status) AlertErrorMessage(error_status);
      } else {
        AlertSucceed("CreateJourney");
        router.replace(`/spaces/${spaceAddress}`).then();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Add new journey!"} />
  ) : (
    <Container>
      <Breadcrumbs linkNames={`Spaces/${spaceName}/New journey`} routerPath={router.asPath} />

      <h1 className="mb-[30px] text-[26px] font-extrabold text-blackColor md:text-3xl">
        New Journey
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex w-full flex-col gap-5"}>
        <DragAndDropImageForm
          label="Image"
          name="image"
          className="h-[140px] w-[140px] sm:h-40 sm:w-40 lg:h-[200px] lg:w-[200px]"
          handleChange={(file) => setImage(file)}
        />
        <div className="lg:max-w-[550px] xl:max-w-[700px]">
          <div className={"mb-[14px] flex items-end justify-between"}>
            <Label label="Name" />
            <p className={"text-sm text-black2Color"}>{`${watch("name")?.length ?? "0"}/32`}</p>
          </div>
          <input
            {...register("name", { required: true })}
            type="text"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Joruney name"
            maxLength={32}
          />
        </div>
        <div className="lg:max-w-[550px] xl:max-w-[700px]">
          <div className={"mb-[14px] flex items-end justify-between"}>
            <Label label="Joruney Description" />
            <p className={"text-sm text-black2Color"}>{`${
              watch("description")?.length ?? "0"
            }/180`}</p>
          </div>
          <textarea
            {...register("description", { required: true })}
            className="h-36 w-full resize-none rounded-md border border-grayColor bg-white px-4 py-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Company description"
            maxLength={180}
          />
        </div>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Reward type">
          <select
            {...register("reward_type", { required: true })}
            id="location"
            name="location"
            className="h-[48px] w-full cursor-pointer rounded-md border border-grayColor bg-white px-4 pr-10 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
          >
            <option>NFT</option>
            <option>SOULBOUND</option>
          </select>
        </LabeledInput>
        <LabeledInput
          className="lg:max-w-[550px] xl:max-w-[700px]"
          label="Required points to reward"
        >
          <input
            {...register("reward_required_points", { required: true })}
            type="number"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Required points to reward"
            step="1"
            min={0}
          />
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Duration">
          <div className="flex flex-col md:flex-row md:gap-7 lg:gap-8 xl:gap-9">
            <div className="w-full">
              <Label label="Start" className="mb-[12px]" textSize="text-base" />
              <input
                {...register("start_time", { required: true })}
                type="date"
                className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
                placeholder="Company name"
                min={getTodayDate()}
              />
            </div>
            <div className="w-full">
              <Label label="End" className="mb-[12px]" textSize="text-base" />
              <input
                {...register("end_time", { required: true })}
                type="date"
                className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor disabled:text-grayColor"
                placeholder="Company name"
                disabled={!watch("start_time")}
                min={watch("start_time")}
              />
            </div>
          </div>
        </LabeledInput>
        <div className="mt-3 flex w-full gap-4 md:gap-5">
          <Button
            btnType="button"
            href={`/spaces/${spaceAddress}`}
            type="reset"
            size="sm-full"
            variant="button-secondary-purple"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || !image || isSubmitting || isFetching}
            btnType="button"
            type="submit"
            size="sm-full"
            variant="button-primary-purple"
          >
            Create
          </Button>
        </div>
      </form>
    </Container>
  );
};
