import React, { FunctionComponent } from "react";
import { View } from "react-native";

interface ISpacerProps {
  height?: number;
  width?: number;
}

export const Spacer: FunctionComponent<ISpacerProps> = ({ height, width }: ISpacerProps): JSX.Element => {
  return <View style={{ height: height, width: width }}></View>;
};
