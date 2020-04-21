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
  mayorName: PlayerName;
};

type UsePeerState = [PeerState, Function, string, Array<any>, string];

export default function MayorPage() {
  const classes = useStyles();
  const { roomId, name } = useParams();
  const [peerState, setPeerState, brokerId, connections]: UsePeerState = usePeerState(
    {
      players: {},
      guesses: 50,
      phase: "init",
      mayorName: name as PlayerName,
      timeUsed: 0,
    },
    { brokerId: `MRXWORDS_${roomId}` }
  );

  console.log(brokerId)

  const {
    players,
    guesses,
    phase,
    word,
    mayorRole,
  } = peerState as PeerState;

  const phaseTimerRef = useRef<any>(null);

  useEffect(() => {
    debugger;
    const playerIds = connections?.map(
      (connection) => connection.peer.split("_")[2]
    );
    console.log(playerIds);
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
    let cards = Array(Object.keys(players).length + 1).fill("Greene");
    cards[0] = "Mr/Mrs X";
    cards[1] = "Inspector";
    if (Object.keys(players).length > 6) {
      cards[2] = "Mr/Mrs X";
    }

    cards = shuffle(cards);

    const playersWithCards = Object.entries(players).reduce(
      (acc, [key, player]) => ({
        ...acc,
        [key]: { ...player, role: cards.pop() },
      }),
      {}
    );
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
      phase: newGuesses === 0 ? "villagerRedemption" : phase,
    });
  };

  const onChooseWord = (word: string) => {
    setPeerState({ ...peerState, phase: "showingWord", word });
    phaseTimerRef.current = setTimeout(() => {
      setPeerState({ ...peerState, phase: "guessing" });
      phaseTimerRef.current = setTimeout(() => {
        setPeerState({ ...peerState, phase: "villagerRedemption" });

        phaseTimerRef.current = setTimeout(() => {
          setPeerState({ ...peerState, phase: "end" });
        }, 1000 * 60);
      }, 1000 * 60 * 6);
    }, 58000);
  };

  const restartGame = () => {
    setPeerState({ ...peerState, phase: "init", word: undefined, guesses: 50 });
    clearTimeout(phaseTimerRef.current);
  };

  const guessCorrect = () => {
    setPeerState({ ...peerState, phase: "werewolfRedemption" });
    phaseTimerRef.current = setTimeout(() => {
      setPeerState({ ...peerState, phase: "end" });
    }, 1000 * 30);
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
        <AudioPlayer phase={phase} />
      </Box>
    </Container>
  );
}
