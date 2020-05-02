import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import sampleSize from "lodash/sampleSize";
import wordList from "./utils/words";
import WordCard from "./WordCard";

type Props = {
  chooseWord: (word: string) => void;
};

export default function PlayerCard({ chooseWord }: Props) {
  const [words] = useState(sampleSize(wordList, 3));

  return (
    <Box display="flex" justifyContent="space-around" width="100%">
      {words.map((word) => (
        <WordCard
          word={word}
          interactive={true}
          onChooseWord={chooseWord}
          key={word}
        />
      ))}
    </Box>
  );
}
