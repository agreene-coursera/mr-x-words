import React, { useRef, useEffect } from "react";
import { Phase } from "./types/Phase";

type Props = {
  phase: Phase;
  audioCue?: string;
};

export default function AudioPlayer({ phase, audioCue }: Props) {
  const openerRef = useRef<HTMLAudioElement>(null);
  const oneMinuteRef = useRef<HTMLAudioElement>(null);
  const thirtySecondsRef = useRef<HTMLAudioElement>(null);
  const findXRef = useRef<HTMLAudioElement>(null);
  const findInspectorRef = useRef<HTMLAudioElement>(null);
  const villagersVoteRef = useRef<HTMLAudioElement>(null);
  const werewolvesVoteRef = useRef<HTMLAudioElement>(null);
  const endRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    switch (phase) {
      case "choosingWord":
        openerRef.current?.play();
        break;
      case "villagerRedemption":
        findXRef.current?.play();
        break;
      case "werewolfRedemption":
        findInspectorRef.current?.play();
        break;
    }
  }, [phase]);

  useEffect(() => {
    switch (audioCue) {
      case "oneMinute":
        oneMinuteRef.current?.play();
        break;
      case "thirtySeconds":
        thirtySecondsRef.current?.play();
        break;
      case "werewolvesVote":
        werewolvesVoteRef.current?.play();
        break;
      case "villagersVote":
        villagersVoteRef.current?.play();
        break;
    }
  }, [audioCue]);

  return (
    <React.Fragment>
      <audio
        ref={openerRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/Opener.m4a`}
      />
      <audio
        ref={oneMinuteRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/oneMinute.m4a`}
      />
      <audio
        ref={thirtySecondsRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/thirtySeconds.m4a`}
      />
      <audio
        ref={findXRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/Find Mr X.m4a`}
      />
      <audio
        ref={findInspectorRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/Find the Inspector.m4a`}
      />
      <audio
        ref={werewolvesVoteRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/werewolvesVote.m4a`}
      />
      <audio
        ref={villagersVoteRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/vote.m4a`}
      />
    </React.Fragment>
  );
}
