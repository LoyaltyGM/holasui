import { JourneyLayout } from "layouts";

import { GetServerSideProps, NextPage } from "next";

interface IAddressProps {
  journeyAddress: string;
  spaceAddress: string;
}

export const getServerSideProps: GetServerSideProps<IAddressProps> = async ({ params }) => {
  try {
    const journeyAddress = params?.journeyAddress as string;
    const spaceAddress = params?.spaceAddress as string;
    return {
      props: {
        journeyAddress,
        spaceAddress,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};

const Journey: NextPage<IAddressProps> = ({ spaceAddress, journeyAddress }) => {
  return <JourneyLayout spaceAddress={spaceAddress} journeyAddress={journeyAddress} />;
};

export default Journey;
