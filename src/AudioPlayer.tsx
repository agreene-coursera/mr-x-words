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

export default function AudioPlayer({ phase, timeUsed }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (phase === "choosingWord") {
      {
        /* audioRef.current?.play(); */
      }
    }
  }, [phase]);

  useEffect(() => {
    if (timeUsed === 1000 * 60 * 4) {
      console.log(audioRef);
      audioRef.current?.play();
    }
  }, [timeUsed]);

  return (
    <React.Fragment>
      <audio
        ref={audioRef}
        preload="auto"
        src="https://dl.espressif.com/dl/audio/ff-16b-2c-44100hz.m4a"
      />
    </React.Fragment>
  );
}
