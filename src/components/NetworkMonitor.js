import React, { useCallback } from "react";
import { useOcean } from "@oceanprotocol/react";
import { ConfigHelper } from "@oceanprotocol/lib";
import { useEffect } from "react";

export default function NetworkMonitor() {
  const { connect, web3Provider } = useOcean();

  const handleNetworkChanged = useCallback(
    chainId => {
      const config = new ConfigHelper().getConfig(chainId);
      connect(config);
    },
    [connect]
  );

  useEffect(() => {
    if (!web3Provider) return;

    web3Provider.on("chainChanged", handleNetworkChanged);

    return () => {
      web3Provider.removeListener("chainChanged", handleNetworkChanged);
    };
  }, [web3Provider, handleNetworkChanged]);

  return <></>;
};
