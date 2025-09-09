import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Transaction } from "@mysten/sui/transactions";

function AddMessage({ eventId, onMessageAdded }: { eventId: string; onMessageAdded?: () => void }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleAddMessage = () => {
    setLoading(true);
     const tx = new Transaction();
     tx.moveCall({
      target: `${packageId}::guest_book::add_message`,
      arguments: [
        tx.object(eventId),
        tx.pure.string(message),
    ],
  });
    signAndExecuteTransaction({ transaction: tx }, {
      onSuccess: () => {
        setMessage("");
        setLoading(false);
        if (onMessageAdded) onMessageAdded();
        alert("Mesaj başarıyla eklendi!");
      },
      onError: (err: any) => {
        setLoading(false);
        alert("Hata: " + err.message);
      },
    });
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleAddMessage();
      }}
      style={{ marginBottom: "20px" }}
    >
      <label>
        Mesajınız:
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Ekleniyor..." : "Mesaj Ekle"}
      </button>
    </form>
  );
}

export default AddMessage;