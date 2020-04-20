import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
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
    }
  })
);

type Props = {
  player: Player;
  phase: Phase;
  interactive: boolean;
  answerGuess?: (player: Player) => void;
  owned?: boolean;
};

export default function PlayerCard({
  player,
  interactive,
  answerGuess,
  owned,
  phase,
}: Props) {
  const classes = useStyles();
  const [showingRole, setShowingRole] = useState(owned);
  const updateGuessState = (type: "yes" | "no" | "maybe") => {
    const updatedPlayer = { ...player, [type]: player[type] + 1 };
    answerGuess?.(updatedPlayer);
  };

  const confirmRole = () => setShowingRole(false);

  useEffect(() => {
    if (phase === "confirmRoles" && owned) {
      setShowingRole(true);
    }
  }, [owned, phase]);

  return (
    <Card variant={owned ? "outlined" : undefined} className={classes.root}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {player.name}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Avatar className={classes.avatar} src={playerToImage(player.name)} />
        </Box>
      </CardContent>
      <Box display="flex" alignItems="center">
        {showingRole && player.role ? (
          <Button
            size="small"
            onClick={confirmRole}
            color="primary"
            className={classes.confirmButton}
          >
            <CheckCircleIcon /> &nbsp; {player.role}
          </Button>
        ) : (
          <React.Fragment>
            <Button
              className={classes.guessButton}
              disabled={!interactive}
              size="small"
              onClick={() => updateGuessState("yes")}
              color="primary"
            >
              <CheckCircleIcon /> &nbsp; {player.yes}
            </Button>
            <Button
              className={classes.guessButton}
              disabled={!interactive}
              size="small"
              onClick={() => updateGuessState("no")}
              color="secondary"
            >
              <CancelIcon /> &nbsp; {player.no}
            </Button>
            <Button
              className={classes.guessButton}
              disabled={!interactive}
              size="small"
              onClick={() => updateGuessState("maybe")}
            >
              <HelpIcon /> &nbsp; {player.maybe}
            </Button>
          </React.Fragment>
        )}
      </Box>
    </Card>
  );
}
