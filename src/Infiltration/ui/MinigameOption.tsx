/**
 * React component for a selectable option on the Faction UI. These
 * options including working for the faction, hacking missions, purchasing
 * augmentations, etc.
 */
import * as React from "react";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

type IProps = {
  buttonText: string;
  infoText: string;
  difficulty: number;
  reward: number
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

export function MinigameOption(props: IProps): React.ReactElement {
  const difficultyName =
    props.difficulty >= 4 ? "Impossible" :
      props.difficulty >= 3 ? "Hard" :
        props.difficulty >= 2 ? "Normal" :
          props.difficulty >= 1 ? "Easy" :
            "Routine"
  const difficultyColor =
    props.difficulty >= 4 ? "red" :
      props.difficulty >= 3 ? "orange" :
        props.difficulty >= 2 ? "yellow" :
          props.difficulty >= 1 ? "green" :
            "white"

  const rewardColor = props.reward > 1 ? "green" : "white"

  return (
    <Box>
      <Paper sx={{ my: 1, p: 1, width: "100%" }}>
        <Button onClick={props.onClick}>{props.buttonText}</Button>
        <Typography>Difficulty: <span style={{ color: difficultyColor }}>{difficultyName}</span></Typography>
        <Typography>Reward: <span style={{ color: rewardColor }}>{props.reward}</span></Typography>
        <Typography>{props.infoText}</Typography>
      </Paper>
    </Box>
  );
}
