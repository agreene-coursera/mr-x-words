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
  interactive: boolean;
  answerGuess?: (player: Player) => void;
};
export default function PlayerGrid({
  players,
  phase,
  ownedPlayer,
  answerGuess,
  interactive,
}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.grid}>
      {players.map((player) => (
        <PlayerCard
          interactive={interactive}
          player={player}
          key={player.name}
          owned={player === ownedPlayer}
          answerGuess={answerGuess}
          phase={phase}
        />
      ))}
    </div>
  );
}
