import React, { useRef, useEffect } from "react";

type Props = {
  phase:
    | "init"
    | "confirmRoles"
    | "choosingWord"
    | "showingWord"
    | "guessing"
    | "end";
  timeUsed: number;
};

export default function AudioPlayer({ phase }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === "choosingWord") {
      audioRef.current?.play();
    }
  }, [phase]);

  return (
    <React.Fragment>
      <audio
        ref={audioRef}
        preload="auto"
        src={`${process.env.PUBLIC_URL}/audio/Opener.m4a`}
      />
    </React.Fragment>
  );
}
