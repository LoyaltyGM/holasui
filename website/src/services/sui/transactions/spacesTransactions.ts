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

export const signTransactionCreateJourney = ({
  admin_cap,
  space,
  reward_type,
  reward_image_url,
  reward_required_points,
  name,
  description,
  start_time,
  end_time,
}: {
  admin_cap: string;
  space: string;
  reward_type: number;
  reward_image_url: string;
  reward_required_points: number;
  name: string;
  description: string;
  start_time: number;
  end_time: number;
}) => {
  const tx = new TransactionBlock();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(0, "u64")]);
  console.log(coin);
  tx.moveCall({
    target: `${SPACE_PACKAGE}::quest::create_journey`,
    arguments: [
      tx.pure(SPACE_HUB_ID),
      coin,
      tx.pure(admin_cap),
      tx.pure(space),
      tx.pure(reward_type),
      tx.pure(reward_image_url),
      tx.pure(reward_required_points),
      tx.pure(name),
      tx.pure(description),
      tx.pure(start_time),
      tx.pure(end_time),
    ],
  });
  return tx;
};
