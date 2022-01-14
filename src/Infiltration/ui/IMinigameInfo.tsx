import React from "react";
import { IMinigameProps } from "./IMinigameProps"

export interface IMinigameInfo {
    ProgrammaticName: string,
    FriendlyName: string,
    Callback: (props : IMinigameProps) => React.ReactElement,
    Index: number
}

export interface IMinigameInstanceInfo {
    Info: IMinigameInfo,
    Difficulty: number,
    Reward: number
}