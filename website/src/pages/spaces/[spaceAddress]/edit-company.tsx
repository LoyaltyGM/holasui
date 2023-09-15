import { EditCompanyLayout } from "layouts";

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

const CompanyQuestsDetail: NextPage<ISpaceAddressProps> = ({ spaceAddress }) => {
  return <EditCompanyLayout spaceAddress={spaceAddress} />;
};

export default CompanyQuestsDetail;
