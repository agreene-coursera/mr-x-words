import { Machine } from "xstate";

type PeerEvent = {
  type: string;
  payload: any;
};

type MachineContext = {
  role: "host" | "sub" | null;
  player?: any;
  players: Array<any>;
};

export default Machine<MachineContext>(
  {
    id: "game",
    initial: "connecting",
    context: {
      role: null,
      players: [],
      player: null,
    },
    states: {
      connecting: {
        entry: ["connect"],
        on: {
          CONFIRM_PLAYERS: "roleSelect",
          ADD_PLAYER: "addPlayer",
        },
      },
      roleSelect: {},
    },
  },
  {
    actions: {},
  }
);
