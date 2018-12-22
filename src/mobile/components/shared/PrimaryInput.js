// @flow
import React from "react";
import { textStyles } from "mobile/styles/textStyles";
import Hoshi from "./customTextInput/Hoshi";
import { Colors } from "mobile/styles/colors";

type Props = {
  label: string,
  assitive: string,
  error: string,
  containerStyle: any, // TODO: type as a stylesheet
  onChange: (value: string) => void
};

type State = {};

export class PrimaryInput extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Hoshi
        {...this.props}
        labelStyle={{
          fontFamily: "SourceSansPro",
          fontSize: 14
        }}
        inputStyle={textStyles.headline6Style}
        primaryColor={Colors.Black}
        selectedColor={Colors.AquaMarine}
        errorColor={Colors.Grapefruit}
      />
    );
  }
}
