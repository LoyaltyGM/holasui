import { ethos, EthosConnectStatus } from "ethos-connect";
import { Button, Container, DragAndDropImageForm, LabeledInput } from "components";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { storeNFT } from "services/ipfs";

interface Inputs {
  image_url: string;
  name: string;
  description: string;
  website: string;
  twitter: string;
}

export const CreateCompanyLayout = () => {
  const { wallet, status } = ethos.useWallet();
  const [image, setImage] = useState<File | null>(null);
  const [waitSui, setWaitSui] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: {},
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    setWaitSui(true);
    try {
      if (!image) {
        toast.error("Please upload image");
        return;
      }

      form.image_url = await storeNFT(image);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container className="mb-[100px] font-inter">
      <h1 className="mb-[30px] text-[26px] font-extrabold text-blackColor md:text-3xl ">
        New Company
      </h1>
      <form onSubmit={() => {}} className={"flex w-full flex-col gap-5"}>
        <DragAndDropImageForm
          label="Image"
          name="image"
          className="h-[140px] w-[140px] sm:h-40 sm:w-40 lg:h-[200px] lg:w-[200px]"
          handleChange={(file) => setImage(file)}
        />
        <LabeledInput label="Name">
          <input
            {...register("description", { required: true })}
            type="text"
            name="spaces"
            id="spaces"
            className="block h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Company name"
          />
        </LabeledInput>
        <LabeledInput label="Description">
          <textarea
            name="spaces"
            id="spaces"
            className="block h-36 w-full rounded-md border border-grayColor bg-white px-4 py-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Company description"
          />
        </LabeledInput>
        <LabeledInput label="Website">
          <input
            type="url"
            name="spaces"
            id="spaces"
            className="block h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Website"
          />
        </LabeledInput>
        <LabeledInput label="Twitter">
          <input
            type="url"
            name="spaces"
            id="spaces"
            className="block h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Twitter"
          />
        </LabeledInput>
        <div className="mt-3 flex w-full gap-4 md:gap-5">
          <Button btnType="button" type="reset" size="sm-full" variant="button-secondary-puprle">
            Cancel
          </Button>
          <Button btnType="button" type="submit" size="sm-full" variant="button-primary-puprle">
            Create
          </Button>
        </div>
      </form>
    </Container>
  );
};
