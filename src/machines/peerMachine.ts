import { Machine, assign, AnyEventObject } from "xstate";
import { Player } from "../types/Player";
import { PlayerRole } from "../types/PlayerRole";
import { PlayerName } from "../types/PlayerName";
import Peer, { DataConnection } from "peerjs";

type Context = {
  players: { [playerId: string]: Player };
  mayor?: { name: PlayerName; role?: PlayerRole };
  word?: string;
  guesses: number;
  voting: boolean;
  votes: { [playerId: string]: string };
  dataConnection?: DataConnection;
  peer?: Peer;
};

const peerMachine = Machine<Context>(
  {
    id: "peer",
    initial: "connecting",
    context: {
      guesses: 50,
      players: {},
      votes: {},
      voting: false,
    },
    states: {
      connecting: {
        on: {
          CONNECTED: { actions: "handleConnected" },
          CONNECTION: { actions: "addPlayer" },
          SYNC_UP: { actions: "syncState" },
          CARDS_DEALT: { target: "confirmingRoles", actions: "syncState" },
        },
      },
      confirmingRoles: {
        on: {
          PLAYER_CONFIRM: { actions: "sendConfirmation" },
          ALL_CONFIRMED: "choosingWord",
        },
      },
      choosingWord: {
        on: {
          WORD_CHOICE: { actions: "setWord" },
        },
        after: { 20000: "showingSeer" },
      },
      showingSeer: {
        after: { 15000: "showingWerewolf" },
      },
      showingWerewolf: {
        after: { 23000: "guessing" },
      },
      guessing: {
        on: {
          GUESS: { actions: "updatePlayerGuesses" },
          REDEEM_VILLAGERS: "villagerRedemption",
          REDEEM_WEREWOLVES: "werewolfRedemption",
        },
      },
      villagerRedemption: {
        entry: "setVoting",
        on: {
          SEND_VOTE: { actions: "sendVote" },
          VOTING_ENDED: { target: "endGame", actions: "setVotes" },
        },
      },
      werewolfRedemption: {
        entry: "setVoting",
        on: {
          SEND_VOTE: { actions: "sendVote" },
          VOTING_ENDED: { target: "endGame", actions: "setVotes" },
        },
      },
      endGame: {
        on: {
          RESET_GAME: {
            target: "connecting",
            actions: ["resetPlayers"],
          },
        },
      },
    },
  },
  {
    actions: {
      handleConnected: assign((context, event: AnyEventObject) => {
        const { dataConnection, peer } = event;
        return { dataConnection, peer };
      }),
      syncState: assign((context, event: AnyEventObject) => {
        return { players: event.players, mayor: event.mayor };
      }),
      addPlayer: assign({
        players: (context, event) => ({
          ...context.players,
          [event.player.id]: event.player,
        }),
      }),
      sendConfirmation: (context, event) => {
        const { dataConnection, peer } = context;
        if (dataConnection && peer) {
          dataConnection.send({ event: "PLAYER_CONFIRM" });
        }
      },
      setWord: assign({ word: (context, event) => event.word }),
      updatePlayerGuesses: assign({
        // @ts-ignore
        players: (
          context,
          event: { answer: "yes" | "no" | "maybe"; playerId: string }
        ) => {
          const { players } = context;
          const { answer, playerId } = event;
          const guessingPlayer = players[event.playerId];
          const updatedPlayer = {
            ...guessingPlayer,
            [answer]: guessingPlayer[answer] + 1,
          };

          return { ...players, [playerId]: updatedPlayer };
        },
        guesses: (context) => context.guesses - 1,
      }),
      setVoting: assign({
        voting: (context, event) => {
          const { players, peer } = context;
          const eventType = event.type;
          if (peer) {
            const currentPlayer = players[peer.id];
            if (eventType === "REDEEM_VILLAGERS") {
              return true;
            } else if (
              currentPlayer.role === "Mr/Mrs X" &&
              eventType === "REDEEM_WEREWOLVES"
            ) {
              return true;
            }
          }
          return false;
        },
      }),
      sendVote: assign({
        voting: (context, event) => {
          if (context.dataConnection) {
            context.dataConnection.send({
              event: "VOTE",
              payload: { vote: event.vote },
            });
          }
          return false;
        },
      }),
      setVotes: assign({ votes: (context, event) => event.votes }),
      resetPlayers: assign((context) => {
        const resetPlayers = Object.entries(context.players).reduce(
          (players, [id, player]) => {
            return {
              ...players,
              [id]: { ...player, yes: 0, no: 0, maybe: 0, role: null },
            };
          },
          {}
        );
        return {
          guesses: 50,
          votes: {},
          voting: false,
          players: resetPlayers,
          word: undefined,
          mayor: context.mayor && { ...context.mayor, role: null },
        };
      }),
    },
    guards: {},
  }
);

export default peerMachine;
