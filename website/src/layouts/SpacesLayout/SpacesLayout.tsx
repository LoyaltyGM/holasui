import {
  Container,
  NoConnectWallet,
  PromotedCard,
  SkeletonPromotedSpace,
  SpaceCard,
} from "components";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { Button } from "components/Reusable/Button";
import { useEffect, useState } from "react";
import { ISpace } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { SPACE_HUB_ID } from "utils";
import { convertIPFSUrl } from "utils";

export const SpacesLayout = () => {
  const { status } = ethos.useWallet();

  const [promotedSpaces, setPromotedSpaces] = useState<ISpace[]>([]);
  const [spaces, setSpaces] = useState<ISpace[]>([]);
  const [isFetching, setFetching] = useState<boolean>(true);

  console.log(spaces);
  useEffect(() => {
    const fetchPromotedSpaces = async () => {
      try {
        // TODO: add promoted objects ids as separate const instead of this mockup
        const mockupPromotedArr = [
          "0xa085103de3398a4f6b7eb8730d586e1ee30940c6fe871e1b65fdce1d2a47a7a4",
          "0xf825a802853485880f245e636532d4913f362ec1ae5b2d3a137d7586787d3de7",
        ];
        const promotedSpacesObjects = await Promise.all(
          mockupPromotedArr.map((id) =>
            suiProvider.getObject({
              id: id,
              options: {
                showContent: true,
              },
            }),
          ),
        );
        const fixedPromotedSpaces = promotedSpacesObjects.map((spaceObject) => {
          const space = getObjectFields(spaceObject) as any;
          space.id = space.id?.id;
          space.image = convertIPFSUrl(space.image);
          // TODO: fix for invalid images
          if (!space.image_url.startsWith("https") || !space.image_url.startsWith("http")) {
            space.image_url =
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png";
          }

          return space as ISpace;
        });

        setPromotedSpaces(fixedPromotedSpaces);
      } catch (e) {
        console.log(e);
      }
    };
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
            space.id = space.id?.id;
            space.image_url = convertIPFSUrl(space.image_url);

            // TODO: fix for invalid images
            if (!space.image_url.startsWith("https") || !space.image_url.startsWith("http")) {
              space.image_url =
                "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png";
            }

            return space as ISpace;
          }),
        ).then((spaces) => setSpaces(spaces));
      } catch (e) {
        console.log(e);
      }
    };

    fetchPromotedSpaces().then();
    fetchSpaces()
      .then()
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const PromotedSpaces = () => (
    <div className="mb-[30px] grid gap-4 md:mb-10 md:grid-cols-2 lg:mb-[70px]">
      {promotedSpaces.map((space) => (
        <PromotedCard
          title={space.name}
          description={space.description}
          image_url={space.image_url}
          spaceAddress={space.id}
        />
      ))}
    </div>
  );

  const SpaceCards = () => {
    const [searchInputValue, setSearchInputValue] = useState<string>("");
    const [hasInteracted, setHasInteracted] = useState<boolean>(false);

    const SearchBar = () => {
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInputValue(e.target.value);
        if (!hasInteracted) {
          setHasInteracted(true);
        }
      };
      const GlassLogo = () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M9.65104 3.15104C6.06119 3.15104 3.15104 6.06119 3.15104 9.65104C3.15104 13.2409 6.06119 16.151 9.65104 16.151C13.2409 16.151 16.151 13.2409 16.151 9.65104C16.151 6.06119 13.2409 3.15104 9.65104 3.15104ZM0.984375 9.65104C0.984375 4.86457 4.86457 0.984375 9.65104 0.984375C14.4375 0.984375 18.3177 4.86457 18.3177 9.65104C18.3177 11.6538 17.6384 13.4979 16.4976 14.9655L22.3337 20.8017C22.7568 21.2247 22.7568 21.9107 22.3337 22.3337C21.9107 22.7568 21.2247 22.7568 20.8017 22.3337L14.9655 16.4976C13.4979 17.6384 11.6538 18.3177 9.65104 18.3177C4.86457 18.3177 0.984375 14.4375 0.984375 9.65104Z"
            className="fill-black2Color"
          />
        </svg>
      );
      return (
        <div className="md:w-1/2">
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <GlassLogo />
            </div>
            <input
              autoFocus={hasInteracted}
              type="text"
              onChange={handleInputChange}
              className="block h-[46px] w-full rounded-md border border-black2Color bg-basicColor pl-[46px] font-medium text-blackColor placeholder:font-medium placeholder:text-black2Color focus:outline-1 focus:outline-blackColor"
              placeholder="Search space"
              value={searchInputValue}
            />
          </div>
        </div>
      );
    };

    return (
      <>
        <SearchBar />
        <div className="mt-5 grid min-h-[120px] gap-[10px] md:grid-cols-2 md:gap-4 lg:mt-[30px] lg:min-h-[150px] lg:gap-5 xl:grid-cols-3">
          {searchInputValue.length > 0
            ? spaces
                .filter(({ name }) =>
                  name.toLowerCase().includes(searchInputValue.toLowerCase().trim()),
                )
                .map((space) => (
                  <SpaceCard
                    title={space.name}
                    totalQuestsAmount={10}
                    image_url={space.image_url}
                    spaceAddress={space.id}
                  />
                ))
            : spaces.map((space) => (
                <SpaceCard
                  title={space.name}
                  totalQuestsAmount={10}
                  image_url={space.image_url}
                  spaceAddress={space.id}
                />
              ))}
        </div>
      </>
    );
  };

  const NoSpaces = () => (
    <div className="flex h-1/2 flex-col items-center justify-center font-medium text-blackColor md:text-lg">
      <p>There are no spaces yet</p>
      <p>Be the first and create something special</p>
    </div>
  );

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Spaces!"} />
  ) : (
    <Container className="mb-[100px] font-inter">
      <div className="mb-5 flex  flex-wrap justify-between lg:mb-10">
        <h1 className="mb-5 text-[26px] font-extrabold sm:mb-0 lg:text-3xl">Hola, Spaces</h1>
        <Button
          btnType="button"
          href="spaces/create-company"
          className="w-full sm:w-max"
          size="sm-full"
          variant="button-secondary-purple"
        >
          Create company
        </Button>
      </div>
      {!isFetching ? (
        spaces.length > 0 ? (
          <>
            <PromotedSpaces />
            <SpaceCards />
          </>
        ) : (
          <NoSpaces />
        )
      ) : (
        <div className="mb-[30px] grid gap-4 md:mb-10 md:grid-cols-2 lg:mb-[70px]">
          <SkeletonPromotedSpace />
          <SkeletonPromotedSpace />
        </div>
      )}
    </Container>
  );
};
