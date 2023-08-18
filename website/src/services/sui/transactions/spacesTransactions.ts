import { TransactionBlock } from "@mysten/sui.js";
import { SPACE_HUB_ID, SPACE_PACKAGE } from "utils";

export const signTransactionCreateSpace = ({
  name,
  description,
  image_url,
  website_url,
  twitter_url,
}: {
  name: string;
  description: string;
  image_url: string;
  website_url: string;
  twitter_url: string;
}) => {
  const tx = new TransactionBlock();

  tx.moveCall({
    target: `${SPACE_PACKAGE}::quest::create_space`,
    arguments: [
      tx.pure(SPACE_HUB_ID),
      tx.pure(name),
      tx.pure(description),
      tx.pure(image_url),
      tx.pure(website_url),
      tx.pure(twitter_url),
    ],
  });
  return tx;
};
