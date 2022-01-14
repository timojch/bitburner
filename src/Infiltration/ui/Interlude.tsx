import React, { useState, useEffect } from "react";
import { IMinigameInfo } from "../IMinigameInfo";
import { IChallenge, IChallengeReward } from "../infiltration";
import { MinigameOption } from "./MinigameOption";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

interface IProps {
  onRetreat: () => void;
  onSelect: (option: IChallenge) => void;
  options: IChallenge[];
  canRetreat: boolean;
}

export function Interlude(props: IProps): React.ReactElement {


  function challengeOption(challenge: IChallenge, index : number): React.ReactElement {
    return (
      <MinigameOption
        buttonText={challenge.MinigameDefinition.FriendlyName}
        infoText={""}
        difficulty={challenge.Difficulty}
        reward={challenge.Reward}
        onClick={() => props.onSelect(challenge)}
        key={index}
      />
    )
  }
  
  const options = props.options.map((challenge, index) => challengeOption(challenge, index));

  return (
    <>
      {options}
      {props.canRetreat && (<Button onClick={props.onRetreat}>Finish Infiltration</Button>)}
    </>
  );
}
