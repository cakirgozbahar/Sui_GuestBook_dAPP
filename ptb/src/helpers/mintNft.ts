import { SuiTransactionBlockResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { suiClient } from "../suiClient";
import { getSigner } from "./getSigner";
import { ENV } from "../env";
import { getAddress } from "./getAddress";

/**
 * Guest book kontratında etkinlik oluşturmak için mintNft fonksiyonu güncellendi.
 * title parametresi ile yeni etkinlik oluşturur.
 */
export const mintNft = async (title: string): Promise<SuiTransactionBlockResponse> => {
  if (!ENV.USER_SECRET_KEY) {
    throw new Error("USER_SECRET_KEY is required");
  }
  if (!ENV.PACKAGE_ID) {
    throw new Error("PACKAGE_ID is required");
  }

  const tx = new Transaction();

  tx.moveCall({
    target: `${ENV.PACKAGE_ID}::guest_book::create_event`,
    arguments: [
      tx.pure.string(title),
    ],
  });

  return suiClient.signAndExecuteTransaction({
    transaction: tx,
    signer: getSigner({ secretKey: ENV.USER_SECRET_KEY }),
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
};