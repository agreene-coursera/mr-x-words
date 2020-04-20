import React, { useEffect, useRef } from "react";
import { Box, Container } from "@material-ui/core";
import { usePeerState } from "react-peer";
import { createPlayer, Player } from "./types/Player";
import Timer from "./Timer";
import ChooseWord from "./ChooseWord";
import PlayerGrid from "./PlayerGrid";
import MayorCard from "./MayorCard";
import WordCard from "./WordCard";
import PhaseButton from "./PhaseButton";
import AudioPlayer from "./AudioPlayer";
import { useParams } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import shuffle from "lodash/shuffle";
import { PlayerName } from "./types/PlayerName";
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

type PeerState = {
  players: { [id: string]: Player };
  guesses: number;
  phase: Phase;
  word?: string;
  timeUsed: number;
  mayorRole?: "werewolf" | "seer" | "villager";
  mayorName:
    | "Austin"
    | "Sue"
    | "Claire"
    | "Alan"
    | "Rachel"
    | "Cheryl"
    | "Beth"
    | "Kevin"
    | "Garrett"
    | "Scott";
};

type UsePeerState = [PeerState, Function, string, Array<any>, string];

export default function MayorPage() {
  const classes = useStyles();
  const { roomId, name } = useParams();
  const [peerState, setPeerState, , connections]: UsePeerState = usePeerState(
    {
      players: {},
      guesses: 50,
      phase: "init",
      mayorName: name as PlayerName,
      timeUsed: 0,
    },
    { brokerId: `MR_X_WORDS${roomId}` }
  );

  const {
    players,
    guesses,
    phase,
    word,
    mayorRole,
    timeUsed,
  } = peerState as PeerState;

  const phaseTimerRef = useRef<any>(null);

  useEffect(() => {
    const playerIds = connections?.map(
      (connection) => connection.peer.split("MR_X_WORDS")[1]
    );
    const newPlayers = playerIds.reduce(
      (acc, id) => ({
        ...acc,
        [id]: players[id] ?? createPlayer(id),
      }),
      {}
    );
    setPeerState({ ...peerState, players: newPlayers });
    // eslint-disable-next-line
  }, [connections]);

  const dealCards = () => {
    let cards = Array(Object.keys(players).length + 1).fill("villager");
    cards[0] = "werewolf";
    cards[1] = "seer";
    cards = shuffle(cards);

    const playersWithCards = Object.entries(players).reduce(
      (acc, [key, player]) => ({
        ...acc,
        [key]: { ...player, role: cards.pop() },
      }),
      {}
    );
    console.log(playersWithCards);
    setPeerState({
      ...peerState,
      players: playersWithCards,
      phase: "confirmRoles",
      mayorRole: cards.pop(),
    });
  };

  const confirmRoles = () =>
    setPeerState({ ...peerState, phase: "choosingWord" });

  const answerGuess = (player: Player) => {
    const updatedPlayers = { ...players, [player.name]: player };
    const newGuesses = guesses - 1;
    setPeerState({
      ...peerState,
      players: updatedPlayers,
      guesses: newGuesses,
      phase: newGuesses === 0 ? "end" : phase,
    });
  };

  const onChooseWord = (word: string) => {
    setPeerState({ ...peerState, phase: "showingWord", word });
    phaseTimerRef.current = setTimeout(() => {
      console.log("guessing start");
      setPeerState({ ...peerState, phase: "guessing" });
      phaseTimerRef.current = setTimeout(() => {
        setPeerState({ ...peerState, phase: "villagerRedemption" });
      }, 1000 * 60 * 6);
    }, 58000);
  };

  const restartGame = () => {
    setPeerState({ ...peerState, phase: "init", word: undefined, guesses: 50 });
    clearTimeout(phaseTimerRef.current);
  };

  const guessCorrect = () => {
    setPeerState({ ...peerState, phase: "werewolfRedemption" });
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
        {phase === "guessing" && <Timer phase={phase} />}
        <div className="spacer" />
        {phase !== "choosingWord" && phase !== "showingWord" && (
          <PlayerGrid
            players={Object.values(players ?? {})}
            interactive={phase === "guessing"}
            answerGuess={answerGuess}
            phase={phase}
          />
        )}
        {phase === "choosingWord" && <ChooseWord onChooseWord={onChooseWord} />}
        {phase === "showingWord" && (
          <Box display="flex" justifyContent="center">
            <WordCard word={word ?? ""} />
          </Box>
        )}
        <MayorCard
          name={(name as PlayerName) ?? ""}
          role={mayorRole}
          guesses={guesses}
          phase={phase}
          owned
        />
        <PhaseButton
          dealCards={dealCards}
          confirmRoles={confirmRoles}
          restartGame={restartGame}
          phase={phase}
          guessCorrect={guessCorrect}
        />
        <AudioPlayer phase={phase} timeUsed={timeUsed} />
      </Box>
    </Container>
  );
}
