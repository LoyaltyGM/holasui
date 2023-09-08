import { ethos, EthosConnectStatus } from "ethos-connect";
import {
  NoConnectWallet,
  Container,
  Button,
  Label,
  LabeledInput,
  AlertSucceed,
  AlertErrorMessage,
  Breadcrumbs,
} from "components";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Switch } from "@headlessui/react";
import cn from "classnames";
import { suiProvider } from "services/sui";
import { NextPage } from "next";
import { getObjectFields } from "@mysten/sui.js";
import { signTransactionCreateQuest } from "services/sui";
import { ISpaceAdminCap } from "types";
import { getExecutionStatus, getExecutionStatusError } from "@mysten/sui.js";
import { useRouter } from "next/router";

interface ISpaceAddressProps {
  spaceAddress: string;
}

interface Inputs {
  image_url: string;
  name: string;
  description: string;
  points_amount: number;
  journey_id: string;
  call_to_action_url: string;
  package_id: string;
  module_name: string;
  function_name: string;
  func_arguments: [] | string;
}

type JourneysType = Record<string, string>;

export const CreateQuestLayout: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  const { wallet, status } = ethos.useWallet();
  const router = useRouter();
  const [argumentsEnabled, setArgumentsEnabled] = useState<boolean>(false);
  const [isFetching, setFetching] = useState<boolean>(true);
  const [isAdminFetching, setAdminFetching] = useState<boolean>(false);
  // FIXME: now default value is 'mockup'. solve what to put instead of
  const [adminCap, setAdminCap] = useState<string>("mockup");
  const [journeys, setJourneys] = useState<JourneysType>({});
  const [spaceName, setSpaceName] = useState<string>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { isValid, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      journey_id: "",
      func_arguments: [],
    },
  });
  useEffect(() => {
    async function fetchJourneysAndSpaceName() {
      try {
        const spaceObject = await suiProvider.getObject({
          id: spaceAddress,
          options: {
            showContent: true,
          },
        });
        const space = getObjectFields(spaceObject) as any;
        setSpaceName(space.name);
        const journeysFields = await suiProvider.getDynamicFields({
          parentId: space.journeys.fields.id.id,
        });
        const journeysObjects = await Promise.all(
          journeysFields.data.map(({ objectId }) =>
            suiProvider.getObject({
              id: objectId,
              options: {
                showContent: true,
              },
            }),
          ),
        );
        const journeys = journeysObjects.reduce((acc, object) => {
          const journey = getObjectFields(object);
          if (journey) {
            return { ...acc, [journey["name"]]: journey.id.id };
          }
          return { ...acc };
        }, {} as JourneysType);
        setJourneys(journeys);
      } catch (e) {
        console.log(e);
      }
    }
    if (isFetching) {
      fetchJourneysAndSpaceName()
        .then()
        .finally(() => {
          setAdminFetching(true);
          setFetching(false);
        });
    }
  }, []);

  useEffect(() => {
    async function fetchAdminCap() {
      if (isAdminFetching && wallet) {
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
          setAdminFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchAdminCap().then();
  }, [wallet, isAdminFetching]);

  const formatArguments = (args: [] | string) => {
    if (Array.isArray(args) || !argumentsEnabled) {
      return [];
    }
    return args.split(",");
  };

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    if (!wallet) return;
    try {
      const response = await wallet.signAndExecuteTransactionBlock({
        transactionBlock: signTransactionCreateQuest({
          admin_cap: adminCap,
          space: spaceAddress,
          journey_id: form.journey_id,
          points_amount: form.points_amount,
          name: form.name,
          description: form.description,
          call_to_action_url: form.call_to_action_url,
          package_id: form.package_id,
          module_name: form.module_name,
          function_name: form.function_name,
          func_arguments: formatArguments(form.func_arguments),
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
        AlertSucceed("CreateQuest");
        router.replace(`/spaces/${spaceAddress}`).then();
      }
    } catch (e) {
      console.log(e);
    }
  };
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Add new quest!"} />
  ) : (
    <Container>
      <Breadcrumbs linkNames={`Spaces/${spaceName}/New quest`} routerPath={router.asPath} />
      <h1 className="mb-[30px] text-[26px] font-extrabold text-blackColor md:text-3xl">
        New Quest
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className={"flex w-full flex-col gap-5"}>
        <div className="lg:max-w-[550px] xl:max-w-[700px] ">
          <div className={"mb-[14px] flex items-end justify-between"}>
            <Label label="Name" />
            <p className={"text-sm text-black2Color"}>{`${watch("name")?.length ?? "0"}/32`}</p>
          </div>
          <input
            {...register("name", { required: true })}
            type="text"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Quest name"
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
            placeholder="Quest description"
            maxLength={180}
          />
        </div>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Journey">
          <select
            disabled={isFetching}
            {...register("journey_id", { required: true })}
            className="h-[48px] w-full cursor-pointer rounded-md border border-grayColor bg-white px-4 pr-10 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
          >
            <option hidden />
            {Object.keys(journeys).length > 0 &&
              Object.keys(journeys).map((journeyName, idx) => (
                <option key={idx} value={journeys[journeyName]}>
                  {journeyName}
                </option>
              ))}
          </select>
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Points amount">
          <input
            {...register("points_amount", { required: true })}
            type="number"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Points amount"
            min="0"
          />
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Call to action url">
          <input
            {...register("call_to_action_url", { required: true })}
            type="url"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Call to action url"
          />
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Package id">
          <input
            {...register("package_id", { required: true })}
            type="text"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Package id"
          />
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Module name">
          <input
            {...register("module_name", { required: true })}
            type="text"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Module name"
          />
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Function name">
          <input
            {...register("function_name", { required: true })}
            type="text"
            className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
            placeholder="Function name"
          />
        </LabeledInput>
        <LabeledInput className="lg:max-w-[550px] xl:max-w-[700px]" label="Arguments">
          <Switch
            checked={argumentsEnabled}
            onChange={setArgumentsEnabled}
            className={cn(
              argumentsEnabled ? "bg-purpleColor" : "bg-gray-200",
              "relative mb-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            )}
          >
            <span className="sr-only">Use setting</span>
            <span
              aria-hidden="true"
              className={cn(
                argumentsEnabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              )}
            />
          </Switch>
          {argumentsEnabled && (
            <input
              {...register("func_arguments", { required: false })}
              type="text"
              className="h-[48px] w-full rounded-md border border-grayColor bg-white px-4 font-medium text-black2Color placeholder:font-medium placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
              placeholder="Empty or function's arguments separated by comma"
            />
          )}
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
            disabled={!isValid || isSubmitting || isFetching || isAdminFetching}
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
