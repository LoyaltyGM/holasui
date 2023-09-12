import { CreateQuestLayout } from "layouts";

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

const CreateQuest: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  return <CreateQuestLayout spaceAddress={spaceAddress} />;
};

export default CreateQuest;
