import React, { useState, useEffect } from "react";
import { IMinigameInfo, IMinigameInstanceInfo } from "./IMinigameInfo";
import { MinigameOption } from "./MinigameOption";

import Button from "@mui/material/Button";

interface IProps {
  onRetreat: () => void;
  onSelect: (option : IMinigameInstanceInfo) => void;
  options: IMinigameInstanceInfo[]
}

export function Interlude(props: IProps): React.ReactElement {

  return (
    <>
      <MinigameOption
        buttonText={props.options[0].Info.FriendlyName}
        infoText={""}
        difficulty={props.options[0].Difficulty}
        reward={props.options[0].Reward}
        onClick={() => props.onSelect(props.options[0]) }
      />
      <MinigameOption
        buttonText={props.options[1].Info.FriendlyName}
        infoText={""}
        difficulty={props.options[1].Difficulty}
        reward={props.options[1].Reward}
        onClick={() => props.onSelect(props.options[1]) }
      />
      <MinigameOption
        buttonText={props.options[2].Info.FriendlyName}
        infoText={""}
        difficulty={props.options[2].Difficulty}
        reward={props.options[2].Reward}
        onClick={() => props.onSelect(props.options[2]) }
      />
      <Button onClick={props.onRetreat}>Retreat</Button>
    </>
  );
}
