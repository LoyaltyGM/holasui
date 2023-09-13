import { Container, Button } from "components";

const SkeletonPromotedSpace = () => (
  <div className="flex max-h-[402px] min-h-[380px] w-full animate-pulse flex-col rounded-xl border border-black2Color bg-gray2Color px-4 py-5 sm:max-h-[376px] sm:min-h-[354px] md:max-h-[394px] md:min-h-[368px] lg:max-h-[418px] lg:min-h-[391px] lg:p-5 xl:max-h-[268px] xl:min-h-[241px] xl:flex-row-reverse xl:justify-between xl:gap-4" />
);

export const SkeletonSpace = () => {
  return (
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
      <div className="mb-[30px] grid gap-4 md:mb-10 md:grid-cols-2 lg:mb-[70px]">
        <SkeletonPromotedSpace />
        <SkeletonPromotedSpace />
      </div>
    </Container>
  );
};
