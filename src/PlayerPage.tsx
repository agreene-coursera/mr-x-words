import React from "react";
import { useReceivePeerState } from "react-peer";
import { Container, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

import { ConnectionIndicator } from "./ConnectionIndicator";
import Timer from "./Timer";
import MayorCard from "./MayorCard";
import PlayerGrid from "./PlayerGrid";
import WordCard from "./WordCard";

import { Player } from "./types/Player";
import { PlayerName } from "./types/PlayerName";
import { Phase } from "./types/Phase";

type PeerState = {
  players: { [id: string]: Player };
  guesses: number;
  phase: Phase;
  word?: string;
  mayorName: PlayerName;
};

type UseReceivePeerState = [PeerState | undefined, boolean, any];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingBottom: "12px",
    },
    container: {
      height: "calc(100vh - 72px)",
    },
  })
);

export default function PlayerPage() {
  const classes = useStyles();
  const { roomId, name } = useParams();
  const [peerState, isConnected]: UseReceivePeerState = useReceivePeerState(
    `MRXWORDS_${roomId}`,
    {
      brokerId: `MRXWORDS_${roomId}_${name}`,
    }
  );

  console.log(`MRXWORDS_${roomId}`)


  const { mayorName, players, guesses, phase, word } =
    (peerState as PeerState) ?? {};
  const myPlayer = name ? (peerState as PeerState)?.players[name] : undefined;

  return (
    <Container className={classes.root}>
      <Box
        className={classes.container}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        alignItems="center"
      >
        <Timer phase={phase} />
        <ConnectionIndicator isConnected={isConnected} />
        <div className="spacer" />
        {phase !== "showingWord" || myPlayer?.role === "Greene" ? (
          <PlayerGrid
            players={Object.values(players ?? {})}
            phase={phase}
            interactive={false}
            ownedPlayer={myPlayer}
          />
        ) : (
          <Box display="flex" justifyContent="center">
            <WordCard word={word ?? ""} />
          </Box>
        )}
        <MayorCard
          name={mayorName ?? ""}
          guesses={guesses}
          phase={phase}
          owned
        />
      </Box>
    </Container>
  );
}
