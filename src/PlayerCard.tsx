import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import type { Player } from "./types/Player";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import HelpIcon from "@material-ui/icons/Help";
import { Avatar } from "@material-ui/core";
import playerToImage from "./utils/playerToImage";
import { Phase } from "./types/Phase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    title: {
      fontSize: 14,
    },
    confirmButton: {
      width: "100%",
    },
    avatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    guessButton: {
      margin: 0,
      padding: 0,
    },
  })
);

type Props = {
  player: Player;
  phase: Phase;
  interactive: boolean;
  answerGuess?: (playerId: string, answer: "yes" | "no" | "maybe") => void;
  confirmRole?: () => void;
  voteForPlayer: (playerId: string) => void;
  votesForPlayer?: number;
  owned?: boolean;
  voting?: boolean;
};

export default function PlayerCard({
  player,
  interactive,
  answerGuess,
  confirmRole,
  voteForPlayer,
  votesForPlayer,
  owned,
  phase,
  voting,
}: Props) {
  const classes = useStyles();
  const [showingRole, setShowingRole] = useState(false);
  const updateGuessState = (answer: "yes" | "no" | "maybe") => {
    answerGuess?.(player.id, answer);
  };

  const onConfirmRole = () => {
    confirmRole?.();
    setShowingRole(false);
  };

  useEffect(() => {
    if (phase === "confirmingRoles" && owned) {
      setShowingRole(true);
    }
  }, [owned, phase]);

  let actions;
  if (showingRole && player.role) {
    actions = (
      <Button
        size="small"
        onClick={onConfirmRole}
        color="primary"
        className={classes.confirmButton}
      >
        <CheckCircleIcon /> &nbsp; {player.role}
      </Button>
    );
  } else if (phase === "endGame") {
    actions = <Typography variant="h6"> {votesForPlayer} </Typography>;
  } else {
    actions = (
      <React.Fragment>
        <Button
          className={classes.guessButton}
          size="small"
          onClick={() => interactive && updateGuessState("yes")}
          color="primary"
        >
          <CheckCircleIcon /> &nbsp; {player.yes}
        </Button>
        <Button
          className={classes.guessButton}
          size="small"
          onClick={() => interactive && updateGuessState("no")}
          color="secondary"
        >
          <CancelIcon /> &nbsp; {player.no}
        </Button>
        <Button
          className={classes.guessButton}
          size="small"
          onClick={() => interactive && updateGuessState("maybe")}
        >
          <HelpIcon /> &nbsp; {player.maybe}
        </Button>
      </React.Fragment>
    );
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {player.name}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Avatar className={classes.avatar} src={playerToImage(player.name)} />
        </Box>
      </CardContent>
      <Box display="flex" alignItems="center" justifyContent="center">
        {actions}
      </Box>
      {voting && (
        <Button
          size="small"
          onClick={() => voteForPlayer(player.id)}
          color="primary"
          className={classes.confirmButton}
        >
          Vote
        </Button>
      )}
    </Card>
  );
}
