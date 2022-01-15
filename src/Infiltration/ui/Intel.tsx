import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    intel: {
      color: theme.colors.rep,
    },
  }),
);

interface IProps {
  intel: number | string;
}
export function Intel(props: IProps): React.ReactElement {
  const classes = useStyles();
  return (
    <Tooltip
      title={
        <Typography>
          Intel grants rewards on the completion of an infiltration mission.
        </Typography>
    }>
      <span className={classes.intel}>
        {typeof props.intel === "number" ? numeralWrapper.formatIntel(props.intel) : props.intel}
      </span>
    </Tooltip>
  );
}
