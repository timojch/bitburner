import { IMinigameInfo } from "../IMinigameInfo";

export const minigames: IMinigameInfo[] = [
  {
    ProgrammaticName: "SlashGame",
    FriendlyName: "Slash the Guard",
    Description: "Press space when the guard is attacking you. There are three " +
     "phases. The first is guarding, where attacking back will result in failure. " +
     "The 2nd is preparing, this informs you that in 250ms there will be an opening " + 
     "window to attack. The 3rd is attack, during this phase you can press space to " + 
     "slash and kill the enemy.",
    Index: 0
  },
  {
    ProgrammaticName: "BracketGame",
    FriendlyName: "Close the Brackets",
    Description: "Enter all the matching brackets in reverse order.",
    Index: 1
  },
  {
    ProgrammaticName: "BackwardGame",
    FriendlyName: "Type Reversed Text",
    Description: "Type the words that are written backward.",
    Index: 2
  },
  {
    ProgrammaticName: "BribeGame",
    FriendlyName: "Flatter the Guard",
    Description: "Use the arrows to find a compliment for the guard.",
    Index: 3
  },
  {
    ProgrammaticName: "CheatCodeGame",
    FriendlyName: "Enter the Code",
    Description: "Match the arrows as they appears.",
    Index: 4
  },
  {
    ProgrammaticName: "Cyberpunk2077Game",
    FriendlyName: "Match the Symbols",
    Description: "Move the cursor to the matching symbol and press space to confirm.",
    Index: 5
  },
  {
    ProgrammaticName: "MinesweeperGame",
    FriendlyName: "Remember the Mines",
    Description: "A grid will be shown with several squares marked. After a few seconds, " + 
      "the marks will disappear. Move the cursor over each space that was previously marked " +
      "and press space to mark it again.",
    Index: 6
  },
  {
    ProgrammaticName: "WireCuttingGame",
    FriendlyName: "Cut the Wires",
    Description: "A set of wires will be displayed, along with a set of instructions " +
      "as to which wires to cut. Press 1-9 to cut the appropriate wires. Wires can be " +
      "cut in any order.",
    Index: 7
  },
]