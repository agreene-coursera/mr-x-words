import React, { useState, useEffect } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import { Avatar } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import playerToImage from "./utils/playerToImage";
import { Phase } from "./types/Phase";
import { PlayerName } from "./types/PlayerName";
import { PlayerRole } from "./types/PlayerRole";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 200,
      width: 250,
      padding: theme.spacing(2),
    },
    title: {
      fontSize: 14,
    },
    avatar: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    confirmButton: {
      width: "100%",
    },
  })
);

type Props = {
  mayor: { name: PlayerName; role?: PlayerRole } | undefined;
  owned?: boolean;
  guesses: number;
  voting: boolean;
  voteForPlayer: (playerId: string) => void;
  confirmRole?: () => void;
  votes?: { [playerId: string]: string };
  phase: Phase;
};

export default function MayorCard({
  mayor,
  owned,
  guesses,
  phase,
  voting,
  voteForPlayer,
  confirmRole,
  votes,
}: Props) {
  const classes = useStyles();
  const [showingRole, setShowingRole] = useState(owned);

  const onConfirmRole = () => {
    confirmRole?.();
    setShowingRole(false);
  };

  useEffect(() => {
    if (phase === "confirmingRoles" && owned) {
      setShowingRole(true);
    }
  }, [owned, phase]);

  const votesForPlayer =
    votes && Object.values(votes).filter((vote) => vote === "mayor").length;

  let actions;
  if (showingRole && mayor && mayor.role) {
    actions = (
      <CardActions>
        <Button
          size="small"
          onClick={onConfirmRole}
          color="primary"
          className={classes.confirmButton}
        >
          <CheckCircleIcon /> &nbsp; {mayor.role}
        </Button>
      </CardActions>
    );
  } else if (voting) {
    actions = (
      <CardActions>
        <Button
          size="small"
          onClick={() => voteForPlayer("mayor")}
          color="primary"
          className={classes.confirmButton}
        >
          Vote
        </Button>
      </CardActions>
    );
  } else if (phase === "endGame") {
    actions = <Typography variant="h6">{votesForPlayer}</Typography>;
  } else {
    actions = (
      <Typography gutterBottom variant="h6" component="h2">
        Guesses Remaining: {guesses}
      </Typography>
    );
  }

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Mayor
        </Typography>
        <Typography variant="h5" component="h2">
          {mayor?.name ?? "Loading..."}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Avatar className={classes.avatar} src={playerToImage(mayor?.name)} />
        </Box>
      </CardContent>
      {actions}
    </Card>
  );
}
