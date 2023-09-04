import { ethos, EthosConnectStatus } from "ethos-connect";
import {
  Button,
  AlertSucceed,
  AlertErrorMessage,
  Container,
  DragAndDropImageForm,
  LabeledInput,
  NoConnectWallet,
  Label,
  Breadcrumbs,
} from "components";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { storeNFT } from "services/ipfs";
import { useRouter } from "next/router";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { signTransactionCreateSpace } from "services/sui";

interface Inputs {
  image_url: string;
  name: string;
  description: string;
  website_url: string;
  twitter_url: string;
}

export const CreateCompanyLayout = () => {
  const router = useRouter();
  const { wallet, status } = ethos.useWallet();
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    try {
      if (!image) {
        toast.error("Please upload image");
        return;
      }

      form.image_url = await storeNFT(image);

      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateSpace(form),
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
        AlertSucceed("CreateSpace");
        router.push("/spaces").then();
      }
    } catch (e) {
      console.log(e);
    }
  };
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Create Company!"} />
  ) : (
    <Container className="mb-[100px] font-inter">
      <Breadcrumbs linkNames={"Spaces/New company"} routerPath={router.asPath} />
      <h1 className="mb-[30px] text-[26px] font-extrabold text-blackColor md:text-3xl">
        New Company
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex w-full flex-col gap-5"}>
        <DragAndDropImageForm
          label="Image"
          name="image"
          className="h-[140px] w-[140px] sm:h-40 sm:w-40 lg:h-[200px] lg:w-[200px]"
          handleChange={(file) => setImage(file)}
        />
        <div className="lg:max-w-[550px] xl:max-w-[700px] ">
          <div className={"mb-[14px] flex items-end justify-between"}>
            <Label label="Name" />
            <p className={"text-sm text-black2Color"}>{`${watch("name")?.length ?? "0"}/32`}</p>
          </div>
          <input
            {...register("name", { required: true })}
            type="text"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Company name"
            maxLength={32}
          />
        </div>
        <div className="lg:max-w-[550px] xl:max-w-[700px] ">
          <div className={"mb-[14px] flex items-end justify-between"}>
            <Label label="Description" />
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
        <LabeledInput label="Website" className="lg:max-w-[550px] xl:max-w-[700px] ">
          <input
            {...register("website_url", { required: true })}
            type="url"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Website"
          />
        </LabeledInput>
        <LabeledInput label="Twitter" className="lg:max-w-[550px] xl:max-w-[700px] ">
          <input
            {...register("twitter_url", { required: true })}
            type="url"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Twitter"
          />
        </LabeledInput>
        <div className="mt-3 flex w-full gap-4 md:gap-5">
          <Button
            btnType="button"
            href="/spaces"
            type="reset"
            size="sm-full"
            variant="button-secondary-purple"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || !image || isSubmitting}
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
