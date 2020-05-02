import { Machine, assign } from "xstate";
import Peer from "peerjs";
import xor from "lodash/xor";
import shuffle from "lodash/shuffle";
import { Player, createPlayer } from "../types/Player";
import { serializePlayer, serializePlayers } from "../utils/serialization";
import { PlayerRole } from "../types/PlayerRole";
import { PlayerName } from "../types/PlayerName";

type Context = {
  players: { [playerId: string]: Player };
  mayor?: { name: PlayerName; role: PlayerRole };
  confirmedPlayers: Array<string>;
  host?: Peer;
  word?: string;
  guesses: number;
  votes: { [playerId: string]: string };
  voting: boolean;
  audio?: string;
};
const hostMachine = Machine<Context>(
  {
    id: "host",
    initial: "connecting",
    context: {
      guesses: 50,
      players: {},
      confirmedPlayers: [],
      votes: {},
      voting: false,
    },
    states: {
      connecting: {
        on: {
          CREATE_HOST: { actions: "initializeHost" },
          CONNECTION: { actions: "addPlayer" },
          DEAL_CARDS: { target: "confirmingRoles", actions: "dealCards" },
          CONNECTION_CLOSED: { actions: "removePlayer" },
        },
      },
      confirmingRoles: {
        on: {
          PLAYER_CONFIRM: [
            {
              target: "choosingWord",
              actions: "sendAllConfirmed",
              cond: "allConfirmed",
            },
            { actions: "confirmPlayer" },
          ],
        },
      },
      choosingWord: {
        on: {
          WORD_CHOICE: { actions: "chooseWord" },
        },
        after: { 20000: "showingSeer" },
      },
      showingSeer: {
        after: { 15000: "showingWerewolf" },
      },
      showingWerewolf: {
        after: { 21000: "guessing" },
      },
      guessing: {
        on: {
          GUESS: [
            {
              target: "villagerRedemption",
              actions: "handleGuess",
              cond: "outOfGuesses",
            },
            { actions: "handleGuess" },
          ],
          CORRECT_GUESS: {
            target: "werewolfRedemption",
          },
        },
        after: {
          300000: { actions: assign({ audio: (context) => "oneMinute" }) },
          330000: { actions: assign({ audio: (context) => "thirtySeconds" }) },
          360000: "villagerRedemption",
        },
      },
      villagerRedemption: {
        entry: ["sendRedeemVillager"],
        on: {
          VOTE: [
            {
              target: "endGame",
              actions: "handleVote",
              cond: "allPlayersVoted",
            },
            { actions: "handleVote" },
          ],
        },
        after: {
          50000: { actions: assign({ audio: (context) => "villagersVote" }) },
          60000: "endGame",
        },
        exit: "sendVotes",
      },
      werewolfRedemption: {
        entry: ["sendRedeemWerewolf"],
        on: {
          VOTE: [
            {
              target: "endGame",
              actions: "handleVote",
              cond: "allWerewolvesVoted",
            },
            { actions: "handleVote" },
          ],
        },
        after: {
          23000: { actions: assign({ audio: (context) => "werewolvesVote" }) },
          30000: "endGame",
        },
        exit: "sendVotes",
      },
      endGame: {
        on: {
          RESET_GAME: {
            target: "connecting",
            actions: ["resetGameState"],
          },
        },
      },
    },
  },
  {
    actions: {
      initializeHost: assign({
        mayor: (context, event) => ({ name: event.name, role: null }),
      }),
      // initializeHost: assign({ host: (context, event) => event.host, mayor: (context, event) => ({ name: event.name, role: null }) }),
      addPlayer: assign({
        players: (context, event) => {
          const currentPlayers = context.players;
          const newPlayer = createPlayer(event.dataConnection);

          const newPlayers = { ...currentPlayers, [newPlayer.id]: newPlayer };
          for (const player of Object.values(currentPlayers)) {
            player.dataConnection.send({
              event: "CONNECTION",
              payload: { player: serializePlayer(newPlayer) },
            });
          }

          newPlayer.dataConnection.send({
            event: "SYNC_UP",
            payload: {
              players: serializePlayers(newPlayers),
              mayor: context.mayor,
            },
          });
          return newPlayers;
        },
      }),
      confirmPlayer: assign({
        confirmedPlayers: (context, event) => {
          const currentConfirmedPlayers = context.confirmedPlayers;
          const newConfirmation = event.id;
          return [...currentConfirmedPlayers, newConfirmation];
        },
      }),
      removePlayer: assign({
        players: (context, event) => {
          const {
            [event.id]: removedPlayer,
            ...remainingPlayers
          } = context.players;
          for (const player of Object.values(remainingPlayers)) {
            player.dataConnection.send({ event: 'SYNC_UP', payload: {players: serializePlayers(remainingPlayers), mayor: context.mayor} })
          }
          return remainingPlayers;
        },
      }),
      dealCards: assign((context, event) => {
        const currentPlayers = context.players;
        let cards: Array<PlayerRole> = Array(
          Object.keys(currentPlayers).length + 1
        ).fill("Greene");
        cards[0] = "Mr/Mrs X";
        cards[1] = "Inspector";
        if (Object.keys(currentPlayers).length > 6) {
          cards[2] = "Mr/Mrs X";
        }

        cards = shuffle(cards);

        const playersWithCards: { [playerId: string]: Player } = Object.entries(
          currentPlayers
        ).reduce(
          (acc, [key, player]) => ({
            ...acc,
            [key]: { ...player, role: cards.pop() },
          }),
          {}
        );

        const mayorWithCard = context.mayor && {
          ...context.mayor,
          role: cards.pop(),
        };

        for (const player of Object.values(playersWithCards)) {
          player.dataConnection.send({
            event: "CARDS_DEALT",
            payload: {
              players: serializePlayers(playersWithCards),
              mayor: mayorWithCard,
            },
          });
        }

        return { players: playersWithCards, mayor: mayorWithCard };
      }),
      sendAllConfirmed: (context) => {
        for (const player of Object.values(context.players)) {
          player.dataConnection.send({ event: "ALL_CONFIRMED" });
        }
      },
      chooseWord: assign({
        word: (context, event) => {
          const { players } = context;
          for (const player of Object.values(players)) {
            player.dataConnection.send({
              event: "WORD_CHOICE",
              payload: { word: event.word },
            });
          }
          return event.word;
        },
      }),
      handleGuess: assign({
        players: (context, event) => {
          const currentPlayers = context.players;
          for (const player of Object.values(currentPlayers)) {
            player.dataConnection.send({
              event: "GUESS",
              payload: { answer: event.answer, playerId: event.id },
            });
          }

          const answeredPlayer = currentPlayers[event.id];
          const updatedPlayer = {
            ...answeredPlayer,
            //@ts-ignore
            [event.answer]: answeredPlayer[event.answer] + 1,
          };

          return { ...currentPlayers, [updatedPlayer.id]: updatedPlayer };
        },
        guesses: (context) => context.guesses - 1,
      }),
      sendRedeemVillager: assign({
        voting: (context) => {
          for (const player of Object.values(context.players)) {
            player.dataConnection.send({ event: "REDEEM_VILLAGERS" });
          }
          return true;
        },
      }),
      sendRedeemWerewolf: assign({
        voting: (context) => {
          for (const player of Object.values(context.players)) {
            player.dataConnection.send({ event: "REDEEM_WEREWOLVES" });
          }

          if (context.mayor?.role === "Mr/Mrs X") {
            return true;
          } else {
            return false;
          }
        },
      }),
      handleVote: assign({
        votes: (context, event) => {
          return { ...context.votes, [event.id]: event.vote };
        },
        voting: (context, event) => {
          return event.id === "mayor" ? false : context.voting;
        },
      }),
      sendVotes: (context) => {
        for (const player of Object.values(context.players)) {
          player.dataConnection.send({
            event: "VOTING_ENDED",
            payload: { votes: context.votes },
          });
        }
      },
      resetGameState: assign((context) => {
        const resetPlayers = Object.entries(context.players).reduce(
          (players, [id, player]) => {
            player.dataConnection.send({ event: "RESET_GAME" });
            return {
              ...players,
              [id]: { ...player, yes: 0, no: 0, maybe: 0, role: null },
            };
          },
          {}
        );

        return {
          guesses: 50,
          confirmedPlayers: [],
          votes: {},
          voting: false,
          players: resetPlayers,
          word: undefined,
          mayor: context.mayor && { ...context.mayor, role: null },
        };
      }),
    },
    guards: {
      allConfirmed: (context, event) => {
        const playerIds = [...Object.keys(context.players), "mayor"];
        const setDifference = xor(playerIds, context.confirmedPlayers);
        return setDifference.length === 1 && setDifference[0] === event.id;
      },
      outOfGuesses: (context) => context.guesses <= 1,
      allPlayersVoted: (context, event) => {
        const allPlayers = [...Object.keys(context.players), "mayor"];
        const voters = [...Object.keys(context.votes), event.id];
        const setDifference = xor(voters, allPlayers);
        return setDifference.length === 0;
      },
      allWerewolvesVoted: (context, event) => {
        const allWerewolves = Object.values(context.players)
          .filter((player) => player.role === "Mr/Mrs X")
          .map((player) => player.id);
        if (context.mayor?.role === "Mr/Mrs X") {
          allWerewolves.push("mayor");
        }
        const voters = [...Object.keys(context.votes), event.id];
        const setDifference = xor(voters, allWerewolves);
        return setDifference.length === 0;
      },
    },
  }
);

export default hostMachine;
