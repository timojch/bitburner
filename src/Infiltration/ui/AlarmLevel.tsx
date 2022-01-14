import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Typography from "@mui/material/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    safe: {
      color: theme.palette.info.main
    },
    threatening: {
      color: theme.palette.warning.main,
    },
    verythreatening: {
      color: theme.palette.error.main,
    }
  }),
);

interface IProps {
  alarmLevel: number;
  maximumAlarmLevel: number;
}
export function AlarmLevel(props: IProps): React.ReactElement {
  const classes = useStyles();

  const emptyAlarmLevel = Math.max((props.maximumAlarmLevel - props.alarmLevel), 0);
  const criticalAlarmLevel = Math.min(Math.max((props.alarmLevel - props.maximumAlarmLevel), 0), props.maximumAlarmLevel);
  const normalAlarmLevel = props.maximumAlarmLevel - criticalAlarmLevel - emptyAlarmLevel;

  let firstPart : string = "‼".repeat(Math.floor(criticalAlarmLevel));
  let secondPart : string = "!".repeat(Math.floor(normalAlarmLevel));
  let thirdPart : string = ".".repeat(Math.ceil(emptyAlarmLevel));
  
  return (
    <Typography>Alarm Level: [<span className={classes.verythreatening}>{firstPart}</span><span className={classes.threatening}>{secondPart}</span><span className={classes.safe}>{thirdPart}</span>]</Typography>
  );
}
