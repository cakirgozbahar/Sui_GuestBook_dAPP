import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: "0x0",
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: "0xffd4544d8c2d6cf9b547941d97feacea5d538ccb24bb24807d3d8e2d2b7585d4",
   
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: "0x0",
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
