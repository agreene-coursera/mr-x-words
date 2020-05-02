import { PlayerName } from "./PlayerName";
import { DataConnection } from "peerjs";
import { PlayerRole } from "./PlayerRole";

export type Player = {
  id: string;
  name: PlayerName;
  yes: number;
  no: number;
  maybe: number;
  role: PlayerRole;
  dataConnection: DataConnection;
};

export const createPlayer = (dataConnection: DataConnection): Player => {
  const name = dataConnection.metadata.name;
  const id = dataConnection.peer;
  return {
    id,
    name,
    dataConnection,
    yes: 0,
    no: 0,
    maybe: 0,
    role: null,
  };
};
