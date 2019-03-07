// @flow

import React from 'react';
import { View } from 'react-native';
import Popup from 'mobile/components/shared/Popup';
import Layout from 'mobile/components/shared/Popup_Layout';

type ProppyProps = {
  visible: boolean,
  displayName: string,
  onCancel: () => void,
  onDone: () => void
};

type Props = ProppyProps;

class UnmatchPopup extends React.Component<Props> {
  render() {
    const { visible, onCancel, displayName, onDone } = this.props;
    const body = <View style={{ marginTop: 20 }} />;

    return (
      <Popup visible={visible} onTouchOutside={() => {}}>
        <Layout
          title={'Are you sure?'}
          subtitle={`This will unmatch you and ${displayName} in JumboSmash and JumboSocial.`}
          body={body}
          primaryButtonText={'Unmatch'}
          primaryButtonDisabled={false}
          primaryButtonLoading={false}
          onPrimaryButtonPress={onDone}
          secondaryButtonText={'Cancel'}
          secondaryButtonDisabled={false}
          secondaryButtonLoading={false}
          onSecondaryButtonPress={onCancel}
        />
      </Popup>
    );
  }
}

export default UnmatchPopup;
