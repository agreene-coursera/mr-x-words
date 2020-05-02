import { Player } from "../types/Player";

export const serializePlayer = (player: Player) => {
  const { dataConnection, ...serializedPlayer } = player;
  return serializedPlayer;
};

export const serializePlayers = (players: { [playerId: string]: Player }) => {
  return Object.entries(players).reduce((acc, [id, player]) => {
    return { ...acc, [id]: serializePlayer(player) };
  }, {});
};
