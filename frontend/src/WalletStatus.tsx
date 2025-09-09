import { useCurrentAccount } from "@mysten/dapp-kit";
import { Container, Flex, Heading, Text } from "@radix-ui/themes";
import CreateEvent from "./CreateEvent";
import AddMessage from "./AddMessage";
import { useState } from "react";

export function WalletStatus() {
  const account = useCurrentAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  const [eventId, setEventId] = useState("");

  return (
    <Container my="2">
      <Heading mb="2">Wallet Status</Heading>
      {account ? (
        <Flex direction="column" gap="2">
          <Text>Wallet connected</Text>
          <Text>Address: {account.address}</Text>
          <CreateEvent refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
          <div style={{ marginBottom: "10px" }}>
            <label>
              Etkinlik ID:
              <input
                type="text"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder="Etkinlik ID giriniz"
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
          {eventId && (
            <AddMessage
              eventId={eventId}
              onMessageAdded={() => setRefreshKey((prev) => prev + 1)}
            />
          )}
        </Flex>
      ) : (
        <Text>Wallet not connected</Text>
      )}
    </Container>
  );
}