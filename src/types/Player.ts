import { PlayerName } from "./PlayerName";

export type Player = {
  name: PlayerName;
  yes: number;
  no: number;
  maybe: number;
  role: "Inspector" | "Greene" | "Mr/Mrs X" | null;
};

export const createPlayer = (name: string) => {
  return {
    name,
    yes: 0,
    no: 0,
    maybe: 0,
    role: null,
  };
};
