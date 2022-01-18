import React from "react";

import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

import Typography from "@mui/material/Typography";

type IProps = {
  difficulty: number
}

const difficultyText : [number, string][] = [
  [3.5, "Impossible"],
  [3.0, "Almost Impossible"],
  [2.5, "Very Difficult"],
  [2.0, "Difficult"],
  [1.5, "Challenging"],
  [1.0, "Normal"],
  [0.5, "Easy"],
  [0.0, "Routine"],
]

const difficultyColors : [number, string][] = [
  [3.5, "purple"],
  [3.0, "red"],
  [2.5, "orange"],
  [2.0, "#ffd700"],
  [1.5, "yellow"],
  [1.0, "lightgreen"],
  [0.5, "white"],
  [0.0, "gray"],
]

function lookup(value: number, table: [number, string][]) : string{
  for(var pair of table) {
    if(pair[0] < value) {
      return pair[1];
    }
  }
  return "invalid";
}

export function ChallengeDifficultyText(props: IProps): React.ReactElement {
  var difficultyName = lookup(props.difficulty, difficultyText)
  var difficultyColor = lookup(props.difficulty, difficultyColors);
  return <Typography>Difficulty: <span style={{ color: difficultyColor }}>{difficultyName}</span></Typography>
}