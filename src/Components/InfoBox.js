import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./InfoBox.css";

export default function InfoBox({ title, cases, total, active, ...props }) {
  return (
    <Card
      className={`infoBox 
      ${props.isRed && active && "infoBox--red"} ${
        props.isGreen && active && "infoBox--green"
      } ${props.isGrey && active && "infoBox--grey"} `}
      onClick={props.onClick}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        <h2
          className={`infoBox__cases ${
            !props.isRed && "infoBox__cases--green"
          } ${!props.isGreen && "infoBox__cases--grey"} ${
            !props.isGrey && !props.isGreen && "infoBox__cases--red"
          }`}
        >
          {cases}
        </h2>
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}
