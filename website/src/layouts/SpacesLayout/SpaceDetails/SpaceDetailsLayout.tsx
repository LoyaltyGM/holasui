import { Container, SpaceInfoBanner, JourneyCard, Carousel } from "components";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { IJourney, ISpace, ISpaceAdminCap } from "types";
import { suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { convertIPFSUrl } from "utils";
import { SkeletonSpaceDetails } from "components";
import { ethos, EthosConnectStatus } from "ethos-connect";
interface ISpaceAddressProps {
  spaceAddress: string;
}

export const SpaceDetailsLayout: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  const [space, setSpace] = useState<ISpace>();
  const [journeys, setJourneys] = useState<IJourney[] | IJourney>();
  const [isFetching, setFetching] = useState<boolean>(true);
  const [isAdmin, setAdmin] = useState<boolean>(false);
  const [isAdminFetching, setIsAdminFetching] = useState<boolean>(false);
  const { status, wallet } = ethos.useWallet();

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
        setIsAdminFetching(true);
      });
  }, []);

  useEffect(() => {
    async function fetchIsAdmin() {
      if (isAdminFetching && wallet) {
        try {
          const { address } = wallet;
          const ownedObjects = await suiProvider.getOwnedObjects({
            owner: "0xdf83a140f6be2498433e680933257fbf30af86dcc2168b1b392340b6259d507c",
          });
          console.log(ownedObjects);
          const nftIds: any = ownedObjects.data.map(({ data }) => data?.objectId);
          const nftObjects = await suiProvider.multiGetObjects({
            ids: nftIds,
            options: { showContent: true },
          });
          const spaceNfts: ISpaceAdminCap[] = nftObjects
            .map((object) => getObjectFields(object) as ISpaceAdminCap)
            .filter(
              (object) =>
                object.hasOwnProperty("space_id") &&
                object.hasOwnProperty("id") &&
                object.hasOwnProperty("name"),
            );
          for (let i = 0; i < spaceNfts.length; i++) {
            const { name, space_id } = spaceNfts[i];
            if (name === space?.name && space_id === space?.id) {
              setAdmin(true);
              break;
            }
          }
          setIsAdminFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchIsAdmin().then();
  }, [wallet, isAdminFetching]);

  const Info = () => (
    <div className="mt-10 text-blackColor md:mt-[50px] lg:mt-[70px]">
      <div className="flex flex-wrap justify-between">
        <h2 className="mb-3 text-[26px] font-extrabold md:mb-5">Journeys from {space?.name}</h2>
        <p className="order-last mb-3 text-[22px] font-semibold text-purpleColor md:order-none">
          Event 1
        </p>
      </div>
    </div>
  );
  return (
    <Container className="mb-[100px] overflow-x-hidden font-inter">
      {!isFetching ? (
        <>
          {space && <SpaceInfoBanner spaceAddress={spaceAddress} space={space} isAdmin={isAdmin} />}
          <Info />
          <div className="w-screen md:w-full">
            <Carousel>
              <JourneyCard color="orangeColor" />
              <JourneyCard color="purpleColor" />
              <JourneyCard color="yellowColor" />
              <JourneyCard color="pinkColor" />
            </Carousel>
          </div>
        </>
      ) : (
        <SkeletonSpaceDetails />
      )}
    </Container>
  );
};
