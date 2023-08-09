import { Container, NoConnectWallet, MainSpaceCard, SpaceCard } from "components";
import Image from "next/image";
import { ethos, EthosConnectStatus } from "ethos-connect";
import IconSearch from "/public/img/IconSearch.png";

export const SpacesLayout = () => {
  const { status } = ethos.useWallet();

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
  return status === EthosConnectStatus.NoConnection ? (
    <NoConnectWallet title={"Spaces!"} />
  ) : (
    <Container className="mb-[100px] font-inter">
      <div className="flex justify-between">
        <h1 className="mb-5 text-[26px] font-extrabold lg:mb-10 lg:text-3xl">Hola, Spaces</h1>
        <button className="button-secondary-purple button-shadow">Create company</button>
      </div>
      <div className="mb-[30px] grid gap-4 md:mb-10 md:grid-cols-2 lg:mb-[70px]">
        <MainSpaceCard />
        <MainSpaceCard />
      </div>
      <SearchBar />
      <div className="mt-5 grid gap-[10px] md:grid-cols-2 md:gap-4 lg:mt-[30px] lg:gap-5 xl:grid-cols-3">
        <SpaceCard />
        <SpaceCard />
        <SpaceCard />
        <SpaceCard />
        <SpaceCard />
        <SpaceCard />
      </div>
    </Container>
  );
};
