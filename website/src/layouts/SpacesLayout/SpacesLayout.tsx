import { Container, NoConnectWallet, PromotedCard, SpaceCard } from "components";
import Image from "next/image";
import { ethos, EthosConnectStatus } from "ethos-connect";
import IconSearch from "/public/img/IconSearch.png";
import frensLogo from "/public/img/frens-logo.svg";
import { Button } from "components/Reusable/Button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ISpace } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { SPACE_HUB_ID } from "utils";
import { convertIPFSUrl } from "utils";

export const SpacesLayout = () => {
  const { status } = ethos.useWallet();

  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [isFetching, setFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const spaceHubObject = await suiProvider.getObject({
          id: SPACE_HUB_ID,
          options: {
            showContent: true,
          },
        });

        const spacesId = getObjectFields(spaceHubObject)!.spaces.fields.contents.fields.id.id;

        const response = await suiProvider.getDynamicFields({
          parentId: spacesId,
        });
        Promise.all(
          response?.data?.map(async (df): Promise<ISpace> => {
            const dfObject = getObjectFields(
              await suiProvider.getObject({
                id: df?.objectId!,
                options: { showContent: true },
              }),
            );

            const space = getObjectFields(
              await suiProvider.getObject({
                id: dfObject?.value,
                options: {
                  showContent: true,
                },
              }),
            )!;
            // TODO: fix for invalid images
            if (!space.image_url.startsWith("https") || !space.image_url.startsWith("http")) {
              space.image_url =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png";
            }

            space.id = space.id?.id;
            space.image_url = convertIPFSUrl(space.image_url);
            console.log(space);
            return space as ISpace;
          }),
        ).then((spaces) => setSpaces(spaces));
      } catch (e) {
        console.log(e);
      }
    };
    fetchSpaces()
      .then()
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const SearchBar = () => (
    <div>
      <div className="relative rounded-lg">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Image src={IconSearch} alt={"Search icon"} width={26} height={26} />
        </div>
        <input
          type="text"
          name="spaces"
          id="spaces"
          className="block h-[46px] w-full rounded-md border border-black2Color bg-basicColor pl-[46px] text-black2Color placeholder:text-grayColor focus:outline-1 focus:outline-blackColor"
          placeholder="Search space"
        />
      </div>
    </div>
  );

  const PromotedSpaces = () => (
    <div className="mb-[30px] grid gap-4 md:mb-10 md:grid-cols-2 lg:mb-[70px]">
      {spaces.map((space) => (
        <PromotedCard
          title={space.name}
          description={space.description}
          image_url={space.image_url}
          spaceAddress={space.id}
        />
      ))}
    </div>
  );

  const SpaceCards = () => (
    <div className="mt-5 grid gap-[10px] md:grid-cols-2 md:gap-4 lg:mt-[30px] lg:gap-5 xl:grid-cols-3">
      {spaces.map((space) => (
        <SpaceCard
          title={space.name}
          totalQuestsAmount={10}
          image_url={space.image_url}
          spaceAddress={space.id}
        />
      ))}
    </div>
  );

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Spaces!"} />
  ) : (
    <Container className="mb-[100px] font-inter">
      <div className="mb-5 flex  flex-wrap justify-between lg:mb-10">
        <h1 className="mb-5 text-[26px] font-extrabold sm:mb-0 lg:text-3xl">Hola, Spaces</h1>
        <Link href="spaces/create-company" className="w-full sm:w-max">
          <Button btnType="button" size="sm-full" variant="button-secondary-puprle">
            Create company
          </Button>
        </Link>
      </div>
      {!isFetching && <PromotedSpaces />}
      <SearchBar />
      {!isFetching && <SpaceCards />}
    </Container>
  );
};
