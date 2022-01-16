import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { IMinigameProps } from "./IMinigameProps";
import { KeyHandler } from "./KeyHandler";
import { GameTimer } from "./GameTimer";
import { random } from "../utils";
import { interpolate } from "./Difficulty";
import { BlinkingCursor } from "./BlinkingCursor";
import Typography from "@mui/material/Typography";

interface Difficulty {
  [key: string]: number;
  timer: number;
  minLength: number;
}

const difficulties: {
  Trivial: Difficulty;
  Easy: Difficulty;
  Normal: Difficulty;
  Hard: Difficulty;
  Impossible: Difficulty;
} = {
  Trivial: { timer: 9000, minLength: 15 },
  Easy: { timer: 8500, minLength: 18 },
  Normal: { timer: 8000, minLength: 26 },
  Hard: { timer: 7500, minLength: 31 },
  Impossible: { timer: 7000, minLength: 40 },
};

export function BackwardGame(props: IMinigameProps): React.ReactElement {
  const difficulty: Difficulty = { timer: 0, minLength: 0 };
  interpolate(difficulties, props.difficulty, difficulty);
  const timer = difficulty.timer;
  const [answer] = useState(makeAnswer(difficulty));
  const [guess, setGuess] = useState("");

  function press(this: Document, event: KeyboardEvent): void {
    event.preventDefault();
    if (event.key === "Backspace") return;
    if (event.key === "Shift") return;
    const nextGuess = guess + event.key.toUpperCase();
    if (!answer.startsWith(nextGuess)) props.onFailure();
    else if (answer === nextGuess) props.onSuccess();
    else setGuess(nextGuess);
  }

  return (
    <Grid container spacing={3}>
      <GameTimer millis={timer} onExpire={props.onFailure} />
      <Grid item xs={12}>
        <Typography variant="h4">Type it backward</Typography>
        <KeyHandler onKeyDown={press} onFailure={props.onFailure} />
      </Grid>
      <Grid item xs={6}>
        <Typography style={{ transform: "scaleX(-1)" }}>{answer}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>
          {guess}
          <BlinkingCursor />
        </Typography>
      </Grid>
    </Grid>
  );
}

function makeAnswer(difficulty: Difficulty): string {
  let answer = "";
  while (answer.length < difficulty.minLength) {
    if (answer.length > 0) answer += " ";
    answer += words[Math.floor(Math.random() * words.length)];
  }

  return answer;
}

const words = [
  "ALGORITHM",
  "ANALOG",
  "APP",
  "APPLICATION",
  "ARRAY",
  "BACKUP",
  "BANDWIDTH",
  "BINARY",
  "BIT",
  "BITE",
  "BITMAP",
  "BLOG",
  "BLOGGER",
  "BOOKMARK",
  "BOOT",
  "BROADBAND",
  "BROWSER",
  "BUFFER",
  "BUG",
  "BUS",
  "BYTE",
  "CACHE",
  "CAPS LOCK",
  "CAPTCHA",
  "CD",
  "CD-ROM",
  "CLIENT",
  "CLIPBOARD",
  "CLOUD",
  "COMPUTING",
  "COMMAND",
  "COMPILE",
  "COMPRESS",
  "COMPUTER",
  "CONFIGURE",
  "COOKIE",
  "COPY",
  "CPU",
  "CYBERCRIME",
  "CYBERSPACE",
  "DASHBOARD",
  "DATA",
  "MINING",
  "DATABASE",
  "DEBUG",
  "DECOMPRESS",
  "DELETE",
  "DESKTOP",
  "DEVELOPMENT",
  "DIGITAL",
  "DISK",
  "DNS",
  "DOCUMENT",
  "DOMAIN",
  "DOMAIN NAME",
  "DOT",
  "DOT MATRIX",
  "DOWNLOAD",
  "DRAG",
  "DVD",
  "DYNAMIC",
  "EMAIL",
  "EMOTICON",
  "ENCRYPT",
  "ENCRYPTION",
  "ENTER",
  "EXABYTE",
  "FAQ",
  "FILE",
  "FINDER",
  "FIREWALL",
  "FIRMWARE",
  "FLAMING",
  "FLASH",
  "FLASH DRIVE",
  "FLOPPY DISK",
  "FLOWCHART",
  "FOLDER",
  "FONT",
  "FORMAT",
  "FRAME",
  "FREEWARE",
  "GIGABYTE",
  "GRAPHICS",
  "HACK",
  "HACKER",
  "HARDWARE",
  "HOME PAGE",
  "HOST",
  "HTML",
  "HYPERLINK",
  "HYPERTEXT",
  "ICON",
  "INBOX",
  "INTEGER",
  "INTERFACE",
  "INTERNET",
  "IP ADDRESS",
  "ITERATION",
  "JAVA",
  "JOYSTICK",
  "JUNKMAIL",
  "KERNEL",
  "KEY",
  "KEYBOARD",
  "KEYWORD",
  "LAPTOP",
  "LASER PRINTER",
  "LINK",
  "LINUX",
  "LOG OUT",
  "LOGIC",
  "LOGIN",
  "LURKING",
  "MACINTOSH",
  "MACRO",
  "MAINFRAME",
  "MALWARE",
  "MEDIA",
  "MEMORY",
  "MIRROR",
  "MODEM",
  "MONITOR",
  "MOTHERBOARD",
  "MOUSE",
  "MULTIMEDIA",
  "NET",
  "NETWORK",
  "NODE",
  "NOTEBOOK",
  "COMPUTER",
  "OFFLINE",
  "ONLINE",
  "OPENSOURCE",
  "OPERATING",
  "SYSTEM",
  "OPTION",
  "OUTPUT",
  "PAGE",
  "PASSWORD",
  "PASTE",
  "PATH",
  "PHISHING",
  "PIRACY",
  "PIRATE",
  "PLATFORM",
  "PLUGIN",
  "PODCAST",
  "POPUP",
  "PORTAL",
  "PRINT",
  "PRINTER",
  "PRIVACY",
  "PROCESS",
  "PROGRAM",
  "PROGRAMMER",
  "PROTOCOL",
  "QUEUE",
  "QWERTY",
  "RAM",
  "REALTIME",
  "REBOOT",
  "RESOLUTION",
  "RESTORE",
  "ROM",
  "ROOT",
  "ROUTER",
  "RUNTIME",
  "SAVE",
  "SCAN",
  "SCANNER",
  "SCREEN",
  "SCREENSHOT",
  "SCRIPT",
  "SCROLL",
  "SCROLL",
  "SEARCH",
  "ENGINE",
  "SECURITY",
  "SERVER",
  "SHAREWARE",
  "SHELL",
  "SHIFT",
  "SHIFT KEY",
  "SNAPSHOT",
  "SOCIAL NETWORKING",
  "SOFTWARE",
  "SPAM",
  "SPAMMER",
  "SPREADSHEET",
  "SPYWARE",
  "STATUS",
  "STORAGE",
  "SUPERCOMPUTER",
  "SURF",
  "SYNTAX",
  "TABLE",
  "TAG",
  "TERMINAL",
  "TEMPLATE",
  "TERABYTE",
  "TEXT EDITOR",
  "THREAD",
  "TOOLBAR",
  "TRASH",
  "TROJAN HORSE",
  "TYPEFACE",
  "UNDO",
  "UNIX",
  "UPLOAD",
  "URL",
  "USER",
  "USER INTERFACE",
  "USERNAME",
  "UTILITY",
  "VERSION",
  "VIRTUAL",
  "VIRTUAL MEMORY",
  "VIRUS",
  "WEB",
  "WEBMASTER",
  "WEBSITE",
  "WIDGET",
  "WIKI",
  "WINDOW",
  "WINDOWS",
  "WIRELESS",
  "PROCESSOR",
  "WORKSTATION",
  "WEB",
  "WORM",
  "WWW",
  "XML",
  "ZIP",
];
