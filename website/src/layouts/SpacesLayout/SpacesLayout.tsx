import {
  Container,
  NoConnectWallet,
  PromotedCard,
  SpaceCard,
  Button,
  SkeletonSpace,
  GlassIcon,
} from "components";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { useEffect, useState } from "react";
import { ISpace } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { convertIPFSUrl, SPACE_HUB_ID } from "utils";

export const SpacesLayout = () => {
  const { status } = ethos.useWallet();

  const [promotedSpaces, setPromotedSpaces] = useState<ISpace[]>([]);
  const [spaces, setSpaces] = useState<ISpace[] | undefined>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    setIsLoading(true);
    const fetchPromotedSpaces = async () => {
      try {
        // TODO: add promoted objects ids as separate const instead of this mockup
        const mockupPromotedArr = [
          "0xdd97b3015108ce270752357178e8427ddfbab17c368918f387c419e738812353",
          "0xdd97b3015108ce270752357178e8427ddfbab17c368918f387c419e738812353",
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
          space.image_url = convertIPFSUrl(space.image_url);
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
        return Promise.all(
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
            return space as ISpace;
          }),
        );
      } catch (e) {
        console.log(e);
      }
    };

    fetchPromotedSpaces().then();
    fetchSpaces()
      .then((space) => setSpaces(space))
      .finally(() => {
        setIsLoading(false);
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

      return (
        <div className="md:w-1/2">
          <div className="relative rounded-lg">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <GlassIcon />
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
        {spaces && (
          <div className="mt-5 grid min-h-[120px] gap-[10px] md:grid-cols-2 md:gap-4 lg:mt-[30px] lg:min-h-[150px] lg:gap-5 xl:grid-cols-3">
            {searchInputValue.length > 0
              ? spaces
                  .filter(({ name }) =>
                    name.toLowerCase().includes(searchInputValue.toLowerCase().trim()),
                  )
                  .map((space) => (
                    <SpaceCard
                      title={space.name}
                      image_url={space.image_url}
                      spaceAddress={space.id}
                      description={space.description}
                    />
                  ))
              : spaces.map((space) => (
                  <SpaceCard
                    title={space.name}
                    image_url={space.image_url}
                    spaceAddress={space.id}
                    description={space.description}
                  />
                ))}
          </div>
        )}
      </>
    );
  };

  if (isLoading) {
    return <SkeletonSpace />;
  }

  const NoSpaces = () => (
    <div className="flex h-1/2 flex-col items-center justify-center font-medium text-blackColor md:text-lg">
      <p>There are no spaces yet</p>
      <p>Be the first and create something special</p>
    </div>
  );

  const DataError = () => (
    <div className="flex h-1/2 flex-col items-center justify-center font-medium text-blackColor md:text-lg">
      <p>Sorry, can't load data</p>
      <p>Please, refresh the page</p>
    </div>
  );

  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Spaces!"} />
  ) : (
    <Container>
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
      {spaces === undefined && <DataError />}
      {spaces && spaces.length > 0 ? (
        <>
          <PromotedSpaces />
          <SpaceCards />
        </>
      ) : (
        <NoSpaces />
      )}
    </Container>
  );
};
