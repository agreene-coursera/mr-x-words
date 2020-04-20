import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Timer from "react-compound-timer";

type Props = {
  phase: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    timerContainer: {
      position: "fixed",
      top: 76,
      left: 12,
    },
  })
);

export default function ({ phase }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.timerContainer}>
      {phase === "guessing" && (
        <Timer initialTime={1000 * 60 * 6} direction="backward">
          {() => {
            return (
              <React.Fragment>
                <Timer.Minutes />:<Timer.Seconds />
              </React.Fragment>
            );
          }}
        </Timer>
      )}
      {phase === "werewolfRedemption" && (
        <Timer initialTime={1000 * 30} direction="backward">
          {() => {
            return (
              <React.Fragment>
                <Timer.Minutes />:<Timer.Seconds />
              </React.Fragment>
            );
          }}
        </Timer>
      )}
      {phase === "villagerRedemption" && (
        <Timer initialTime={1000 * 60} direction="backward">
          {() => {
            return (
              <React.Fragment>
                <Timer.Minutes />:<Timer.Seconds />
              </React.Fragment>
            );
          }}
        </Timer>
      )}
    </div>
  );
}
