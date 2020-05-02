import Peer, { DataConnection } from "peerjs";

const connectionPrefix = "MRXWORDS";

export const createHost = (roomId: string | undefined) => {
  const debugLevel = process.env.NODE_ENV === "development" ? 1 : 0;
  const peer = new Peer(`${connectionPrefix}_${roomId}`, { debug: debugLevel });
  return peer;
};

export const connectToHost = (
  roomId: string | undefined,
  metadata: { name: string }
): Promise<[DataConnection, Peer]> => {
  const debugLevel = process.env.NODE_ENV === "development" ? 1 : 0;
  const peer = new Peer(undefined, { debug: debugLevel });
  return new Promise((res) => {
    peer.on("open", () => {
      res([peer.connect(`${connectionPrefix}_${roomId}`, { metadata }), peer]);
    });
  });
};
