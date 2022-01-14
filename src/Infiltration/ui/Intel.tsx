import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

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
    <span className={classes.intel}>
      {typeof props.intel === "number" ? numeralWrapper.formatIntel(props.intel) : props.intel}
    </span>
  );
}
