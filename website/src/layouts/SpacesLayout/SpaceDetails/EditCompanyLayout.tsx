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
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { storeNFT } from "services/ipfs";
import { useRouter } from "next/router";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { signTransactionEditSpace } from "services/sui";
import { NextPage } from "next";
import { ISpace, ISpaceAdminCap } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { convertIPFSUrl } from "utils";

type argumentKeys = "name" | "description" | "image_url" | "twitter_url" | "website_url";

interface Inputs {
  image_url: string;
  name: string;
  description: string;
  website_url: string;
  twitter_url: string;
}

interface ISpaceAddressProps {
  spaceAddress: string;
}

export const EditCompanyLayout: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  const router = useRouter();
  const { wallet, status } = ethos.useWallet();
  const [space, setSpace] = useState<ISpace>();
  // FIXME: now default value is 'mockup'. solve what to put instead of
  const [adminCap, setAdminCap] = useState<string>("mockup");
  const [image, setImage] = useState<File | null>(null);
  const [isFetching, setFetching] = useState<boolean>(true);
  const [isAdminCapFetching, setAdminCapFetching] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
    setValue,
    getValues,
  } = useForm<Inputs>();

  useEffect(() => {
    async function fetchAdminCap() {
      if (isAdminCapFetching && wallet) {
        try {
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
          setAdminCapFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchAdminCap().then();
  }, [status, isAdminCapFetching]);

  useEffect(() => {
    async function fetchSpace() {
      try {
        const spaceObject = await suiProvider.getObject({
          id: spaceAddress,
          options: {
            showContent: true,
          },
        });

        const space = getObjectFields(spaceObject) as any;
        space.id = space.id.id;
        space.image_url = convertIPFSUrl(space.image_url);

        setSpace(getObjectFields(spaceObject) as ISpace);
      } catch (e) {
        console.log(e);
      }
    }
    fetchSpace()
      .then()
      .finally(() => {
        setFetching(false);
        setAdminCapFetching(true);
      });
  }, []);

  useEffect(() => {
    if (space) {
      setValue("name", space.name);
      setValue("description", space.description);
      setValue("website_url", space.website_url);
      setValue("twitter_url", space.twitter_url);
    }
  }, [space]);

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    try {
      if (space) {
        if (image) {
          form.image_url = await storeNFT(image);
        }
        const args: Partial<Record<argumentKeys, string>> = {};

        if (form.name !== space.name) {
          args["name"] = form.name;
        }
        if (form.description !== space.description) {
          args["description"] = form.description;
        }
        if (form.image_url && form.image_url !== space.image_url) {
          args["image_url"] = form.image_url;
        }
        if (form.twitter_url !== space.twitter_url) {
          args["twitter_url"] = form.twitter_url;
        }
        if (form.website_url !== space.website_url) {
          args["website_url"] = form.website_url;
        }

        if (Object.keys(args).length === 0) {
          router.replace(`/spaces/${spaceAddress}`).then();
          return;
        }
        const response = await wallet.signAndExecuteTransactionBlock({
          transactionBlock: signTransactionEditSpace({
            admin_cap: adminCap,
            space: space.id,
            ...args,
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
          AlertSucceed("EditSpace");
          router.replace(`/spaces/${spaceAddress}`).then();
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Edit Company!"} />
  ) : (
    <Container>
      <Breadcrumbs linkNames={`Spaces/${space?.name}/Edit company`} routerPath={router.asPath} />
      <h1 className="mb-[30px] text-[26px] font-extrabold text-blackColor md:text-3xl">
        Edit Company
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex w-full flex-col gap-5"}>
        <DragAndDropImageForm
          label="New Image"
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
            disabled={isFetching}
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
            disabled={isFetching}
          />
        </div>
        <LabeledInput label="Website" className="lg:max-w-[550px] xl:max-w-[700px] ">
          <input
            {...register("website_url", { required: true })}
            type="url"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Website"
            disabled={isFetching}
          />
        </LabeledInput>
        <LabeledInput label="Twitter" className="lg:max-w-[550px] xl:max-w-[700px] ">
          <input
            {...register("twitter_url", { required: true })}
            type="url"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Twitter"
            disabled={isFetching}
          />
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
            disabled={!isValid || isSubmitting || isFetching || isAdminCapFetching}
            btnType="button"
            type="submit"
            size="sm-full"
            variant="button-primary-purple"
          >
            Save
          </Button>
        </div>
      </form>
    </Container>
  );
};
