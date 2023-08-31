import { TransactionBlock } from "@mysten/sui.js";
import { space } from "postcss/lib/list";
import { SPACE_HUB_ID, SPACE_PACKAGE } from "utils";
import { suiProvider } from "../suiProvider";

// ==== SPACES ====

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

export const signTransactionEditSpace = ({
  admin_cap,
  space,
  name,
  description,
  image_url,
  twitter_url,
  website_url,
}: {
  admin_cap: string;
  space: string;
  name?: string;
  description?: string;
  image_url?: string;
  twitter_url?: string;
  website_url?: string;
}) => {
  const tx = new TransactionBlock();
  if (name) {
    tx.moveCall({
      target: `${SPACE_PACKAGE}::quest::update_space_name`,
      arguments: [tx.object(admin_cap), tx.object(space), tx.pure(name)],
    });
  }
  if (description) {
    tx.moveCall({
      target: `${SPACE_PACKAGE}::quest::update_space_description`,
      arguments: [tx.object(admin_cap), tx.object(space), tx.pure(description)],
    });
  }
  if (image_url) {
    tx.moveCall({
      target: `${SPACE_PACKAGE}::quest::update_space_image_url`,
      arguments: [tx.object(admin_cap), tx.object(space), tx.pure(image_url)],
    });
  }
  if (twitter_url) {
    tx.moveCall({
      target: `${SPACE_PACKAGE}::quest::update_space_twitter_url`,
      arguments: [tx.object(admin_cap), tx.object(space), tx.pure(twitter_url)],
    });
  }
  if (website_url) {
    tx.moveCall({
      target: `${SPACE_PACKAGE}::quest::update_space_website_url`,
      arguments: [tx.object(admin_cap), tx.object(space), tx.pure(website_url)],
    });
  }
  return tx;
};

// ==== JOURNEYS ====

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
  // TODO: fix gas
  const [coin] = tx.splitCoins(tx.gas, [tx.pure(0, "u64")]);
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

// TODO: rework
// export const getJourney = async ({
//   sender = "0xbfa592bb480ab82022b716ee1d754b36799d9890559620b64c30127695c87c13",
//   space_id,
//   journey_id,
// }: {
//   sender?: string;
//   space_id: string;
//   journey_id: string;
// }) => {
//   const tx = new TransactionBlock();
//   tx.moveCall({
//     target: `${SPACE_PACKAGE}::quest::journey`,
//     arguments: [tx.pure(space_id), tx.pure(journey_id)],
//   });
//   const response = await suiProvider.devInspectTransactionBlock({
//     transactionBlock: tx,
//     sender,
//   });
//   console.log("respones", response.results);
// };

// ==== QUESTS ====

export const signTransactionCreateQuest = ({
  admin_cap,
  space,
  journey_id,
  points_amount,
  name,
  description,
  call_to_action_url,
  package_id,
  module_name,
  function_name,
  func_arguments,
}: {
  admin_cap: string;
  space: string;
  journey_id: string;
  points_amount: number;
  name: string;
  description: string;
  call_to_action_url: string;
  package_id: string;
  module_name: string;
  function_name: string;
  func_arguments: string[];
}) => {
  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${SPACE_PACKAGE}::quest::create_quest`,
    arguments: [
      tx.object(admin_cap),
      tx.object(space),
      tx.object(journey_id),
      tx.pure(points_amount),
      tx.pure(name),
      tx.pure(description),
      tx.pure(call_to_action_url),
      tx.pure(package_id),
      tx.pure(module_name),
      tx.pure(function_name),
      tx.pure(func_arguments),
    ],
  });
  return tx;
};
