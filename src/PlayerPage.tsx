import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import peerMachine from "./machines/peerMachine";
import { connectToHost } from "./utils/peerConnections";
import { Container, Box } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";

import { ConnectionIndicator } from "./ConnectionIndicator";
import Timer from "./Timer";
import MayorCard from "./MayorCard";
import PlayerGrid from "./PlayerGrid";
import WordCard from "./WordCard";

import { Phase } from "./types/Phase";
import { DataConnection } from "peerjs";

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
  const [state, send] = useMachine(peerMachine);

  useEffect(() => {
    let connection: DataConnection;
    connectToHost(roomId, { name: name as string }).then(
      ([dataConnection, peer]) => {
        connection = dataConnection;
        send("CONNECTED", { dataConnection, peer });
        dataConnection.on("data", (data) => {
          console.log("PEER DATA", data);
          send(data.event, data.payload);
        });
      }
    );

    return () => connection.close();
  }, [roomId, name, send]);

  const phase = state.value as Phase;
  const { players, mayor, word, peer, guesses, voting, votes } = state.context;

  const myPlayer = peer && players[peer.id];

  const confirmRole = () => send("PLAYER_CONFIRM");
  const showWord =
    (phase === "showingSeer" && myPlayer?.role === "Inspector") ||
    (phase === "showingWerewolf" && myPlayer?.role === "Mr/Mrs X");

  const voteForPlayer = (playerId: string) => {
    send("SEND_VOTE", { vote: playerId });
  };

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
        <ConnectionIndicator isConnected={!!myPlayer} />
        <div className="spacer" />
        {!showWord ? (
          <PlayerGrid
            players={Object.values(players ?? {})}
            confirmRole={confirmRole}
            phase={phase}
            interactive={false}
            ownedPlayer={myPlayer}
            voteForPlayer={voteForPlayer}
            votes={votes}
            voting={voting}
          />
        ) : (
          <Box display="flex" justifyContent="center">
            <WordCard word={word ?? ""} />
          </Box>
        )}
        <MayorCard
          mayor={mayor}
          phase={phase}
          guesses={guesses}
          owned={false}
          voting={voting}
          voteForPlayer={voteForPlayer}
        />
      </Box>
    </Container>
  );
}
