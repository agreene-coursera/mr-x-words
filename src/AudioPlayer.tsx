import React, { useRef, useEffect } from "react";
import { Phase } from "./types/Phase";

type Props = {
  phase: Phase;
};

export default function AudioPlayer({ phase }: Props) {
  const openerRef = useRef<HTMLAudioElement>(null);
  const findXRef = useRef<HTMLAudioElement>(null);
  const findInspectorRef = useRef<HTMLAudioElement>(null);
  const endRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === "choosingWord") {
      openerRef.current?.play();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "villagerRedemption") {
      findXRef.current?.play();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "werewolfRedemption") {
      findInspectorRef.current?.play();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "end") {
      endRef.current?.play();
    }
  }, [phase]);

  return (
    <React.Fragment>
      <audio
        ref={openerRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/Opener.m4a`}
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
        ref={endRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/vote.m4a`}
      />
    </React.Fragment>
  );
}
