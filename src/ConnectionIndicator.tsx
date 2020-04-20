import React from "react";

import WifiTetheringIcon from "@material-ui/icons/WifiTethering";
import PortableWifiOffIcon from "@material-ui/icons/PortableWifiOff";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

type Props = {
  isConnected: boolean;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      position: "fixed",
      top: 76,
      right: 12,
    },
  })
);

export function ConnectionIndicator({ isConnected }: Props) {
  const classes = useStyles();
  return (
    <div className={classes.iconContainer}>
      {" "}
      {isConnected ? (
        <WifiTetheringIcon color="primary" />
      ) : (
        <PortableWifiOffIcon color="error" />
      )}
    </div>
  );
}
