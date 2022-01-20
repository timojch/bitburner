/**
 * React component for a selectable option on the Faction UI. These
 * options including working for the faction, hacking missions, purchasing
 * augmentations, etc.
 */
import * as React from "react";
import clsx from "clsx";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import { Money } from "../../ui/React/Money";
import { Intel } from "./Intel"
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { ChallengeDifficultyText } from "./ChallengeDifficultyText"

import { IChallengeDifficulty, IChallengeReward } from "../infiltration"

type IProps = {
  buttonText: string;
  infoText: string;
  difficulty: IChallengeDifficulty;
  isSelected: boolean;
  reward: IChallengeReward
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    access: {
      color: theme.colors.hack,
    },
    healing: {
      color: theme.colors.hp,
    },
    reduceAlarm: {
      color: theme.colors.white,
    },
    escape: {
      color: theme.colors.cha
    },
    active: {
      border: "1px solid " + theme.palette.primary.main,
    },
    inactive:{
      border: "1px solid " + theme.palette.secondary.main,
    }
  }),
);

function rewardText(reward: IChallengeReward) {
  const classes = useStyles();
  return (
    <>
      <Typography>Reward</Typography>
      {reward.IntelAmount > 0 && (
        <>
          <Typography><Intel intel={reward.IntelAmount} /> Intel</Typography>
        </>
      )}
      {reward.MoneyAmount > 0 && (
        <>
          <Typography><Money money={reward.MoneyAmount} /></Typography>
        </>
      )}
      {reward.AccessAmount > 0 && (
        <>
          <Typography><span className={classes.access}>+{reward.AccessAmount} Access Level</span></Typography>
        </>
      )}
      {reward.ReduceAlarmLevelAmount > 0 && (
        <>
          <Typography><span className={classes.reduceAlarm}>Reduce Alarm Level by {reward.ReduceAlarmLevelAmount}</span></Typography>
        </>
      )}
      {reward.HealingAmount > 0 && (
        <>
          <Typography><span className={classes.healing}>Heal {reward.HealingAmount} HP</span></Typography>
        </>
      )}
      {reward.HasEscape && (
        <>
          <Typography><span className={classes.escape}>Escape!</span></Typography>
        </>
      )}
    </>
  )
}

export function MinigameOption(props: IProps): React.ReactElement {
  let uiDifficulty = props.difficulty.Difficulty;
  let classes = useStyles();

  return (
    <Box>
      <Paper 
        sx={{ my: 1, p: 1, width: "100%" }} 
        className={clsx({
          [classes.active]: props.isSelected,
        })}>
        <Tooltip title={
          <Typography>
            {props.infoText}
          </Typography>
        }>
          <Button onClick={props.onClick}>{props.buttonText}</Button>
        </Tooltip>
        <ChallengeDifficultyText difficulty={uiDifficulty} />
        {rewardText(props.reward)}
      </Paper>
    </Box>

  );
}
