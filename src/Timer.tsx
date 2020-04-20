import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Timer from "react-compound-timer";
import { Typography } from "@material-ui/core";

type Props = {
  phase: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    timerContainer: {
      position: "fixed",
      top: 76,
      left: 24,
    },
  })
);

export default function ({ phase }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.timerContainer}>
      {phase === "guessing" && (
        <Timer key={phase} initialTime={1000 * 60 * 6} direction="backward">
          {({timerState}: { timerState: any }) => {
            console.log(Timer.Seconds)
            return (
              <Typography variant='h5'>
                <Timer.Minutes />m <Timer.Seconds />s
              </Typography>
            );
          }}
        </Timer>
      )}
      {phase === "werewolfRedemption" && (
        <Timer key={phase} initialTime={1000 * 30} direction="backward">
          {() => {
            return (
              <Typography variant='h5'>
                <Timer.Minutes />m <Timer.Seconds />s
              </Typography>
            );
          }}
        </Timer>
      )}
      {phase === "villagerRedemption" && (
        <Timer key={phase} initialTime={1000 * 60} direction="backward">
          {() => {
            return (
              <Typography variant='h5'>
                <Timer.Minutes />m <Timer.Seconds />s
              </Typography>
            );
          }}
        </Timer>
      )}
    </div>
  );
}
