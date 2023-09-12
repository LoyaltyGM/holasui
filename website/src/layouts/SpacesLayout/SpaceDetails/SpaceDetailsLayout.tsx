import {
  Container,
  SpaceInfoBanner,
  JourneyCard,
  Carousel,
  NoConnectWallet,
  Breadcrumbs,
} from "components";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { IJourney, ISpace, ISpaceAdminCap } from "types";
import { getSpaceUserPoints, suiProvider } from "services/sui";
import { getObjectFields } from "@mysten/sui.js";
import { convertIPFSUrl } from "utils";
import { SkeletonSpaceDetails } from "components";
import { ethos, EthosConnectStatus } from "ethos-connect";
import { useRouter } from "next/router";
interface ISpaceAddressProps {
  spaceAddress: string;
}

export const SpaceDetailsLayout: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  const { status, wallet } = ethos.useWallet();
  const router = useRouter();
  // space states
  const [space, setSpace] = useState<ISpace>();
  const [journeys, setJourneys] = useState<IJourney[]>();

  //admin states
  const [isAdmin, setAdmin] = useState(false);

  // fetching states
  const [isFetching, setFetching] = useState(true);
  const [isAdminFetching, setAdminFetching] = useState(false);
  const [isJourneysFetching, setJourneysFetching] = useState(false);

  //utils states
  const [currentEvent, setCurrentEvent] = useState<number>(1);
  const [userPoints, setUserPoints] = useState(0);

  // space fetching
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
        setAdminFetching(true);
        setJourneysFetching(true);
      });
  }, []);
  //fetching user points in the space
  useEffect(() => {
    if (!wallet) return;
    getSpaceUserPoints({ space: spaceAddress, user: wallet.address }).then((points) =>
      setUserPoints(points),
    );
  }, [status]);
  // journeys fetching
  useEffect(() => {
    async function fetchJourneys() {
      const journeysFields = await suiProvider.getDynamicFields({
        parentId: space!.journeys.fields.id.id,
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
      return journeysObjects.map((object) => {
        const journey = getObjectFields(object);
        if (journey) {
          journey.reward_image_url = convertIPFSUrl(journey.reward_image_url);
          journey.id = journey.id.id;
        }
        return journey as IJourney;
      });
    }
    if (space && isJourneysFetching) {
      try {
        fetchJourneys()
          .then((data) => setJourneys(data))
          .finally(() => setJourneysFetching(false));
      } catch (e) {
        console.log(e);
      }
    }
  }, [space]);
  // is admin fetching
  useEffect(() => {
    async function fetchIsAdmin() {
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
            setAdmin(true);
          }
          setAdminFetching(false);
        } catch (e) {
          console.log(e);
        }
      }
    }
    fetchIsAdmin().then();
  }, [isAdminFetching, wallet]);

  const Info = () => (
    <div className="mt-10 text-blackColor md:mt-[50px] lg:mt-[70px]">
      <div className="flex flex-wrap justify-between">
        <h2 className="mb-3 text-[26px] font-extrabold md:mb-5">Journeys from {space?.name}</h2>
        <p className="order-last mb-3 text-[22px] font-semibold text-purpleColor md:order-none">
          Event {currentEvent}
        </p>
      </div>
    </div>
  );
  const NoJourneys = () => (
    <div className="mt-16 flex items-center justify-center text-lg font-medium text-blackColor md:mt-28">
      <p>There are no journeys and quests yet</p>
    </div>
  );
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Space!"} />
  ) : (
    <Container className="overflow-x-hidden">
      <Breadcrumbs linkNames={`Spaces/${space?.name}`} routerPath={router.asPath} />
      {!isFetching ? (
        <>
          {space && (
            <SpaceInfoBanner
              spaceAddress={spaceAddress}
              space={space}
              isAdmin={isAdmin}
              userPoints={userPoints}
            />
          )}
          {!isJourneysFetching && (
            <>
              {journeys && journeys.length > 0 ? (
                <>
                  <Info />
                  <div className="w-screen md:w-full">
                    <Carousel setCurrentEvent={setCurrentEvent}>
                      {journeys.map((journey, index) => (
                        <JourneyCard
                          journey={journey}
                          index={index}
                          key={index}
                          totalJourneys={journeys.length}
                        />
                      ))}
                    </Carousel>
                  </div>
                </>
              ) : (
                <NoJourneys />
              )}
            </>
          )}
        </>
      ) : (
        <SkeletonSpaceDetails />
      )}
    </Container>
  );
};
