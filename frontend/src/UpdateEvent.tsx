import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Transaction } from "@mysten/sui/transactions";

function UpdateEventTitle() {
  const [eventId, setEventId] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleUpdate = () => {
    setLoading(true);
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::guest_book::update_event_title`,
      arguments: [
        tx.object(eventId),
        tx.pure.string(newTitle),
      ],
    });
    signAndExecuteTransaction({ transaction: tx }, {
      onSuccess: () => {
        setNewTitle("");
        setLoading(false);
        alert("Başlık başarıyla güncellendi!");
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
        handleUpdate();
      }}
      style={{ marginBottom: "20px" }}
    >
      <label>
        Etkinlik ID:
        <input
          type="text"
          value={eventId}
          onChange={e => setEventId(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
      </label>
      <label style={{ marginLeft: "10px" }}>
        Yeni Başlık:
        <input
          type="text"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Güncelleniyor..." : "Başlığı Güncelle"}
      </button>
    </form>
  );
}

export default UpdateEventTitle;