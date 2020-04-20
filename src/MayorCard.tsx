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
  name: PlayerName
  role?: string;
  owned?: boolean;
  guesses: number;
  phase: Phase;
};

export default function MayorCard({
  name,
  owned,
  role,
  guesses,
  phase,
}: Props) {
  const classes = useStyles();
  const [showingRole, setShowingRole] = useState(owned);

  const confirmRole = () => setShowingRole(false);

  useEffect(() => {
    if (phase === "confirmRoles" && owned) {
      setShowingRole(true);
    }
  }, [owned, phase]);

  return (
    <Card variant={owned ? "outlined" : undefined} className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Mayor
        </Typography>
        <Typography variant="h5" component="h2">
          {name}
        </Typography>
        <Box display="flex" justifyContent="center">
          <Avatar className={classes.avatar} src={playerToImage(name)} />
        </Box>
      </CardContent>
      {showingRole && role ? (
        <CardActions>
          <Button
            size="small"
            onClick={confirmRole}
            color="primary"
            className={classes.confirmButton}
          >
            <CheckCircleIcon /> &nbsp; {role}
          </Button>
        </CardActions>
      ) : (
        <Typography gutterBottom variant="h6" component="h2">
          Guesses Remaining: {guesses}
        </Typography>
      )}
    </Card>
  );
}
