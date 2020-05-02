import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import PlayerCard from "./PlayerCard";

import { Player } from "./types/Player";
import { Phase } from "./types/Phase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, 1fr)",
      gridTemplateRows: "repeat(2, 1fr)",
      gridGap: theme.spacing(2),
    },
  })
);

type Props = {
  players: Array<Player>;
  phase: Phase;
  ownedPlayer?: Player;
  voting: boolean;
  interactive: boolean;
  answerGuess?: (playerId: string, answer: "yes" | "no" | "maybe") => void;
  voteForPlayer: (playerId: string) => void;
  votes?: { [playerId: string]: string };
  confirmRole?: () => void;
};
export default function PlayerGrid({
  players,
  phase,
  ownedPlayer,
  answerGuess,
  confirmRole,
  voteForPlayer,
  votes,
  interactive,
  voting,
}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      {players.map((player) => {
        const votesForPlayer =
          votes &&
          Object.values(votes).filter((vote) => vote === player.id).length;
        return (
          <PlayerCard
            interactive={interactive}
            player={player}
            key={player.name}
            owned={player === ownedPlayer}
            voting={voting}
            votesForPlayer={votesForPlayer}
            answerGuess={answerGuess}
            confirmRole={confirmRole}
            voteForPlayer={voteForPlayer}
            phase={phase}
          />
        );
      })}
    </div>
  );
}
