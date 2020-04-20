import React from "react";

import { Fab } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Phase } from "./types/Phase";

type Props = {
  dealCards: () => void;
  confirmRoles: () => void;
  guessCorrect: () => void;
  restartGame: () => void;
  phase: Phase;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: 12,
      right: 12,
    },
  })
);

export default function PhaseButton({
  dealCards,
  confirmRoles,
  restartGame,
  guessCorrect,
  phase,
}: Props) {
  const classes = useStyles();
  let action: (() => void) | null | undefined = null;
  let label;
  switch (phase) {
    case "init":
      label = "Deal Cards";
      action = dealCards;
      break;
    case "confirmRoles":
      label = "Start Game";
      action = confirmRoles;
      break;
    case "guessing":
      label = "Correct Guess!";
      action = guessCorrect;
      break;
    case "villagerRedemption":
    case "werewolfRedemption":
      label = "Restart";
      action = restartGame;
      break;
  }
  return (
    <Fab
      className={classes.fab}
      disabled={!action}
      variant="extended"
      onClick={() => action?.()}
    >
      {label}
    </Fab>
  );
}
