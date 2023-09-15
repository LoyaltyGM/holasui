import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useJourneyStore } from "store";
import cn from "classnames";
import { HomeIcon } from "components/Icons";

export const Breadcrumbs = ({
  linkNames,
  routerPath,
}: {
  linkNames: string;
  routerPath: string;
}) => {
  const { isJourneyColor } = useJourneyStore();
  const pages = linkNames.split("/");
  const hrefParts = routerPath.slice(1).split("/");
  const hrefs: string[] = [];
  for (let i = 0; i < hrefParts.length; i++) {
    hrefs.push(hrefParts.slice(0, i + 1).join("/"));
  }

  const Skeleton = () => (
    <li aria-current="page">
      <div className={cn("flex items-center", isJourneyColor ? "text-white" : "text-black2Color")}>
        <p
          className={cn(
            "font-semibold md:ml-2 md:mr-2",
            isJourneyColor ? "text-gray2Color" : "text-grayColor",
          )}
        >
          /
        </p>
        <FolderIcon className="mr-1.5 h-4 w-4" />
        <div className="h-3 w-20 animate-pulse rounded-2xl bg-grayColor" />
      </div>
    </li>
  );

  const HomePage = ({ page }: { page: string }) => (
    <li aria-current="page">
      <Link
        href={`/${hrefs[0]}`}
        className={cn(
          "inline-flex items-center",
          isJourneyColor
            ? "text-gray2Color hover:text-white"
            : "text-grayColor hover:text-black2Color",
        )}
      >
        <HomeIcon className="mr-1.5 h-4 w-4 fill-current" />
        {page}
      </Link>
    </li>
  );

  const CurrentPage = ({ page }: { page: string }) => (
    <li aria-current="page">
      <div className={cn("flex items-center", isJourneyColor ? "text-white" : "text-black2Color")}>
        <p
          className={cn(
            "font-semibold md:ml-2 md:mr-2",
            isJourneyColor ? "text-gray2Color" : "text-grayColor",
          )}
        >
          /
        </p>
        <FolderIcon className="mr-1.5 h-4 w-4" />
        <span>{page}</span>
      </div>
    </li>
  );

  const PreviousPage = ({ page, idx }: { page: string; idx: number }) => (
    <li aria-current="page">
      <Link
        href={`/${hrefs[idx]}`}
        className={cn(
          "inline-flex items-center",
          isJourneyColor
            ? "text-gray2Color hover:text-white"
            : "text-grayColor hover:text-black2Color",
        )}
      >
        <p
          className={cn(
            "font-semibold md:ml-2 md:mr-2",
            isJourneyColor ? "text-gray2Color" : "text-grayColor",
          )}
        >
          /
        </p>
        <FolderIcon className="mr-1.5 h-4 w-4 fill-current" />
        <p>{page}</p>
      </Link>
    </li>
  );

  return (
    <nav className="mb-[70px] hidden font-medium lg:flex" aria-label="Breadcrumbs">
      <ol className="inline-flex items-center">
        {pages.map((page, idx) => {
          if (page === "undefined") return <Skeleton key={idx} />;
          if (idx === 0) return <HomePage page={page} key={idx} />;
          if (idx === pages.length - 1) return <CurrentPage page={page} key={idx} />;
          return <PreviousPage page={page} idx={idx} key={idx} />;
        })}
      </ol>
    </nav>
  );
};
