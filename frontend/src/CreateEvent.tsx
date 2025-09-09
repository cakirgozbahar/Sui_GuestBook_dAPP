import { useState } from "react";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { Transaction } from "@mysten/sui/transactions";

function CreateEvent({
  refreshKey,
  setRefreshKey,
}: {
  refreshKey: number;
  setRefreshKey: (key: number) => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const packageId = useNetworkVariable("packageId");
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const handleCreate = () => {
    setLoading(true);
    const tx = new Transaction();
    tx.moveCall({
      target: `${packageId}::guest_book::create_event`,
      arguments: [tx.pure.string(title)],
    });
    signAndExecuteTransaction({ transaction: tx }, {
      onSuccess: () => {
        setTitle("");
        setLoading(false);
        setRefreshKey(refreshKey + 1);
        alert("Etkinlik başarıyla oluşturuldu!");
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
        handleCreate();
      }}
      style={{ marginBottom: "20px" }}
    >
      <label>
        Etkinlik Başlığı:
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
          style={{ marginLeft: "10px" }}
        />
      </label>
      <button type="submit" disabled={loading} style={{ marginLeft: "10px" }}>
        {loading ? "Oluşturuluyor..." : "Etkinlik Oluştur"}
      </button>
    </form>
  );
}

export default CreateEvent;