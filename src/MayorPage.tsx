import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import hostMachine from "./machines/hostMachine";
import { createHost } from "./utils/peerConnections";
import { Box, Container } from "@material-ui/core";
import Timer from "./Timer";
import ChooseWord from "./ChooseWord";
import PlayerGrid from "./PlayerGrid";
import MayorCard from "./MayorCard";
import WordCard from "./WordCard";
import PhaseButton from "./PhaseButton";
import AudioPlayer from "./AudioPlayer";
import { useParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Phase } from "./types/Phase";

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

export default function MayorPage() {
  const classes = useStyles();
  const { roomId, name } = useParams();
  const [state, send] = useMachine(hostMachine);

  useEffect(() => {
    const host = createHost(roomId);
    send("CREATE_HOST", { name });
    host.on("connection", (dataConnection) => {
      dataConnection.on("open", () => {
        send("CONNECTION", { dataConnection });
        dataConnection.on("data", (data) => {
          console.log("PEER DATA", data);
          send(data.event, { ...data.payload, id: dataConnection.peer });
        });
        dataConnection.on("close", () => {
          send("CONNECTION_CLOSED", { id: dataConnection.peer });
        });
      });
    });

    return () => host.disconnect();
  }, [roomId, name, send]);

  const phase = state.value as Phase;
  const { mayor, players, word, guesses, votes, voting, audio } = state.context;

  const confirmRole = () => {
    send("PLAYER_CONFIRM", { id: "mayor" });
  };

  const dealCards = () => {
    send("DEAL_CARDS");
  };

  const chooseWord = (word: string) => {
    send("WORD_CHOICE", { word });
  };

  const answerGuess = (playerId: string, answer: "yes" | "no" | "maybe") => {
    send("GUESS", { id: playerId, answer });
  };

  const guessCorrect = () => {
    send("CORRECT_GUESS");
  };

  const restartGame = () => {
    send("RESET_GAME");
  };

  const voteForPlayer = (playerId: string) => {
    send("VOTE", { id: "mayor", vote: playerId });
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
        <div className="spacer" />
        {phase !== "choosingWord" && (
          <PlayerGrid
            players={Object.values(players ?? {})}
            interactive={phase === "guessing"}
            answerGuess={answerGuess}
            votes={votes}
            phase={phase}
            voting={voting}
            voteForPlayer={voteForPlayer}
          />
        )}
        {phase === "choosingWord" && !word && (
          <ChooseWord chooseWord={chooseWord} />
        )}
        {phase === "choosingWord" && word && (
          <Box display="flex" justifyContent="center">
            <WordCard word={word ?? ""} />
          </Box>
        )}
        <MayorCard
          mayor={mayor}
          guesses={guesses}
          phase={phase}
          votes={votes}
          voting={voting}
          voteForPlayer={voteForPlayer}
          confirmRole={confirmRole}
          owned
        />
        <PhaseButton
          dealCards={dealCards}
          restartGame={restartGame}
          phase={phase}
          guessCorrect={guessCorrect}
        />
        <AudioPlayer phase={phase} audioCue={audio} />
      </Box>
    </Container>
  );
}
