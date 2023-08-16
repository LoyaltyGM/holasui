import { TransactionBlock } from "@mysten/sui.js";
import { suiProvider } from "../suiProvider";

async function isQuestVerified(
  spaceId: string,
  journeyId: string,
  questId: string,
  userAddress: string,
): Promise<boolean> {
  try {
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${"0x3c9ca75fefcd70def5ced73a89f0f08445cb26fcd7c332b0056875128f909fa5"}::${"quest"}::quest_completed_user`,
      arguments: [tx.pure(spaceId), tx.pure(journeyId), tx.pure(questId), tx.pure(userAddress)],
    });

    const response = await suiProvider.devInspectTransactionBlock({
      transactionBlock: tx,
      sender: "0xfa40dda8beaf0bee40130a32df04bc74bb8a4bc85b2d27c54289fe8676d5f977",
    });
    const result = response.results![0].returnValues![0]![0]![0];

    return result === 1;
  } catch (e) {
    console.error(e);
    return false;
  }
}
