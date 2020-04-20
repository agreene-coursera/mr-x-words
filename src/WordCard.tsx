import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { CardActionArea } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 275,
      padding: theme.spacing(2),
    },
    title: {
      fontWeight: "bold",
    },
  })
);

type Props = {
  word: string;
  onChooseWord?: (word: string) => void;
  interactive?: boolean;
};

export default function WordCard({ word, onChooseWord, interactive }: Props) {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea
        onClick={() => onChooseWord?.(word)}
        disabled={!interactive}
      >
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            variant="h4"
          >
            {word}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
