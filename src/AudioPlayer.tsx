import React, { useRef, useEffect } from "react";
import { Phase } from "./types/Phase";

type Props = {
  phase: Phase;
  timeUsed: number;
};

export default function AudioPlayer({ phase }: Props) {
  const openerRef = useRef<HTMLAudioElement>(null);
  const findXRef = useRef<HTMLAudioElement>(null);
  const findInspectorRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === "choosingWord") {
      openerRef.current?.play();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "villagerRedemption") {
      openerRef.current?.play();
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
    </React.Fragment>
  );
}
