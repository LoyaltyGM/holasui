import { CreateJourneyLayout } from "layouts";

import { GetServerSideProps, NextPage } from "next";

interface ISpaceAddressProps {
  spaceAddress: string;
}

export const getServerSideProps: GetServerSideProps<ISpaceAddressProps> = async ({ params }) => {
  try {
    const spaceAddress = params?.spaceAddress as string;
    return {
      props: {
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
const CreateJourney: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  return <CreateJourneyLayout spaceAddress={spaceAddress} />;
};

export default CreateJourney;
