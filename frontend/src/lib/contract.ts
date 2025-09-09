import { Transaction } from "@mysten/sui/transactions";

// Etkinlik oluşturma işlemi için transaction
export const createEventTx = (title: string, packageId: string) => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::guest_book::create_event`,
    arguments: [
      tx.pure.string(title),
    ],
  });
  return tx;
};

// Mesaj ekleme işlemi için transaction
export const addMessageTx = (eventId: string, message: string, packageId: string) => {
  const tx = new Transaction();
  tx.moveCall({
    target: `${packageId}::guest_book::add_message`,
    arguments: [
      tx.object(eventId),
      tx.pure.string(message),
    ],
  });
  return tx;
};