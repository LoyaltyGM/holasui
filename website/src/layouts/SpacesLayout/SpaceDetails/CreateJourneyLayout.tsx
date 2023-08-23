import { ethos, EthosConnectStatus } from "ethos-connect";
import { NoConnectWallet, Container, DragAndDropImageForm, Button, Label } from "components";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Inputs {
  image_url: string;
  name: string;
  description: string;
}

export const CreateJourneyLayout = () => {
  const { wallet, status } = ethos.useWallet();
  const [image, setImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Inputs>();

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Add new journey!"} />
  ) : (
    <Container className="mb-[100px] font-inter">
      <h1 className="mb-[30px] text-[26px] font-extrabold text-blackColor md:text-3xl">
        New Journey
      </h1>
      <form onSubmit={() => {}} className={"flex w-full flex-col gap-5"}>
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
            }/500`}</p>
          </div>
          <textarea
            {...register("description", { required: true })}
            className="h-36 w-full resize-none rounded-md border border-grayColor bg-white px-4 py-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Company description"
            maxLength={500}
          />
        </div>
        <div className="mt-3 flex w-full gap-4 md:gap-5">
          <Button
            btnType="button"
            href="/spaces"
            type="reset"
            size="sm-full"
            variant="button-secondary-puprle"
          >
            Cancel
          </Button>
          <Button
            disabled={!isValid || !image || isSubmitting}
            btnType="button"
            type="submit"
            size="sm-full"
            variant="button-primary-puprle"
          >
            Create
          </Button>
        </div>
      </form>
    </Container>
  );
};
