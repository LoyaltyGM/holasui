import Link from "next/link";
import { FolderIcon } from "@heroicons/react/24/solid";
import { useJourneyStore } from "store";
import cn from "classnames";

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
  const HomePageLogo = ({ className }: { className?: string }) => (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
    </svg>
  );
  // TODO: add maybe spinner when page is loading for page names in breadcrumbs
  return (
    <nav className="mb-[70px] hidden font-medium lg:flex" aria-label="Breadcrumbs">
      <ol className="inline-flex items-center">
        {pages.map((page, idx) => {
          if (idx === 0) {
            return (
              <li className="inline-flex items-center">
                <Link
                  href={`/${hrefs[0]}`}
                  className={cn(
                    "inline-flex items-center",
                    isJourneyColor
                      ? "text-gray2Color hover:text-white"
                      : "text-grayColor hover:text-black2Color",
                  )}
                >
                  <HomePageLogo className="mr-1.5 h-4 w-4 fill-current" />
                  {page}
                </Link>
              </li>
            );
          }
          if (idx === pages.length - 1) {
            return (
              <li aria-current="page">
                <div
                  className={cn(
                    "flex items-center",
                    isJourneyColor ? "text-white" : "text-black2Color",
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
                  <FolderIcon className="mr-1.5 h-4 w-4" />
                  <span>{page}</span>
                </div>
              </li>
            );
          }
          return (
            <li className="inline-flex items-center">
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
        })}
      </ol>
    </nav>
  );
};
