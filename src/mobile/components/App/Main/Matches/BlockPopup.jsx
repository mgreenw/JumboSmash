// @flow

import React from 'react';
import { View, Text } from 'react-native';
import Popup from 'mobile/components/shared/Popup';
import CustomIcon from 'mobile/assets/icons/CustomIcon';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';
import Layout from 'mobile/components/shared/Popup_Layout';
import ReasonSelector from './ReasonSelector';
import type { SelectedReason } from './ReasonSelector';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  onCancel: () => void,
  onDone: () => void
};

type Props = ProppyProps;

type State = {
  step: 1 | 2,
  selectedReasons: SelectedReason[]
};

const BLOCK_REASONS = [
  { text: 'Made me uncomfortable', code: 'UNCOMFORTABLE' },
  { text: 'Abusive or threatening', code: 'ABUSIVE' },
  { text: 'Inappropriate content', code: 'INAPPROPRIATE' },
  { text: 'Bad offline behavior', code: 'BEHAVIOR' },
  { text: 'No reason', code: 'NO_REASON' }
];

class BlockPopup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      step: 1,
      selectedReasons: BLOCK_REASONS.map(r => {
        return {
          reason: r,
          selected: false
        };
      })
    };
  }

  _onSelectReason = (selected: boolean, index: number) => {
    const { selectedReasons } = this.state;
    const newSelectedReasons = [...selectedReasons];
    newSelectedReasons[index].selected = selected;
    this.setState({ selectedReasons: newSelectedReasons });
  };

  _renderBlockReasons() {
    const { selectedReasons } = this.state;
    const { displayName, onCancel } = this.props;

    const reasonSelector = (
      <View style={{ marginBottom: 31 }}>
        <ReasonSelector
          reasons={selectedReasons}
          onSelect={this._onSelectReason}
        />
      </View>
    );

    return (
      <Layout
        title={'Block'}
        subtitle={`Help keep JumboSmash safe by telling the team why you’re blocking ${displayName}.`}
        body={reasonSelector}
        primaryButtonText={'Block'}
        primaryButtonDisabled={
          selectedReasons.filter(r => r.selected).length === 0
        }
        primaryButtonLoading={false}
        onPrimaryButtonPress={() => this.setState({ step: 2 })}
        secondaryButtonText={'Cancel'}
        secondaryButtonDisabled={false}
        secondaryButtonLoading={false}
        onSecondaryButtonPress={onCancel}
      />
    );
  }

  _renderDone() {
    const { displayName, onDone } = this.props;
    const body = (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20
        }}
      >
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 20,
            backgroundColor: 'black',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5
          }}
        >
          <CustomIcon name="check" size={10} color={Colors.White} />
        </View>
        <Text style={[textStyles.subtitle1Style]}>
          {`${displayName} has been blocked`}
        </Text>
      </View>
    );

    return (
      <Layout
        title={'Block'}
        subtitle={`Thanks for letting the team know. ${displayName} won’t be able to see you anymore in JumboSmash or JumboSocial.`}
        body={body}
        primaryButtonText={'Done'}
        primaryButtonDisabled={false}
        primaryButtonLoading={false}
        onPrimaryButtonPress={onDone}
        flexRow={false}
      />
    );
  }

  render() {
    const { step } = this.state;
    const { visible } = this.props;
    let renderedContent;
    if (step === 1) {
      renderedContent = this._renderBlockReasons();
    } else if (step === 2) {
      renderedContent = this._renderDone();
    } else {
      throw new Error('Error in Block Popup, invalid step number');
    }
    return (
      <Popup visible={visible} onTouchOutside={() => {}}>
        {renderedContent}
      </Popup>
    );
  }
}

export default BlockPopup;
