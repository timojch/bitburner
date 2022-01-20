import React, { useState, useEffect } from "react";
import { Infiltration, IChallenge, IChallengeReward } from "../infiltration";
import { MinigameOption } from "./MinigameOption";
import { AlarmLevel } from "./AlarmLevel"
import { Intel } from "./Intel"
import { getArrow } from "../utils";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

interface IProps {
  onRetreat: () => void;
  onSelect: (option: IChallenge) => void;
  options: IChallenge[];
  metagame: Infiltration;
}

export function Interlude(props: IProps): React.ReactElement {
  const [selectionIndex, setIndex] = useState(0);

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    const k = event.key;
    if (k === " ") {
      props.onSelect(props.options[selectionIndex]);
      return;
    }

    let newIndex = selectionIndex;
    for (let arrow of getArrow(event)) {
      switch (arrow) {
        case "↑":
          newIndex++;
          break;
        case "↓":
          newIndex--;
          break;
      }
    }

    while (newIndex < 0) newIndex += props.options.length;
    while (newIndex > props.options.length - 1) newIndex -= props.options.length;
    setIndex(newIndex);
  }
  const canRetreat = props.metagame.AlarmLevel <= props.metagame.Target.maxAlarmLevelForEscape


  function challengeOption(challenge: IChallenge, index: number): React.ReactElement {
    return (
      <MinigameOption
        buttonText={challenge.MinigameDefinition.FriendlyName}
        infoText={challenge.MinigameDefinition.Description}
        difficulty={challenge.Difficulty}
        isSelected={selectionIndex == index}
        reward={challenge.Reward}
        onClick={() => props.onSelect(challenge)}
        key={index}
      />
    )
  }

  const options = props.options.map((challenge, index) => challengeOption(challenge, index));

  return (
    <>
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              Access Level increases Intel and Money earned from challenges.
            </Typography>
          }
        >
          <Typography>
            Access: {props.metagame.AccessLevel}&nbsp;/&nbsp;{props.metagame.Target.maxClearanceLevel}
          </Typography>
        </Tooltip>
      </Box>
      <Box display="flex">
        <Typography>
          Intel: <Intel intel={props.metagame.Intel} />
        </Typography>
      </Box>
      <Box display="flex">
        <AlarmLevel alarmLevel={props.metagame.AlarmLevel} maximumAlarmLevel={props.metagame.Target.maxAlarmLevelForEscape} />
      </Box>
      {options}
      {canRetreat && (<Button onClick={props.onRetreat}>{props.metagame.Intel > 0 ? "Finish Infiltration" : "Cancel Infiltration"}</Button>)}
      {!canRetreat && (<Typography>Can't escape! Lower the alarm level or find an Escape reward.</Typography>)}
    </>
  );
}
