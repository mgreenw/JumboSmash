// @flow
import * as React from 'react';
import { View, FlatList, ImageBackground, Text } from 'react-native';
import NavigationService from 'mobile/components/navigation/NavigationService';
import GEMHeader from 'mobile/components/shared/Header';
import { ListItem } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';
import type { NavigationScreenProp } from 'react-navigation';
import { DormCodeList, codeToName } from 'mobile/data/Dorms/';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type Props = {
  navigation: NavigationScreenProp<any>
};

type State = {};

class SelectDormScreen extends React.Component<Props, State> {
  _onBack = () => {
    NavigationService.back();
  };

  _save = (code: string) => {
    const { navigation } = this.props;
    const onSave: ?(?string) => void = navigation.getParam('onSave', null);
    if (onSave) onSave(code);
  };

  _onPress = (code: string) => {
    this._save(code);
    this._onBack();
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%'
        }}
      />
    );
  };

  renderDormName = (code: string) => {
    return <Text style={textStyles.body1Style}>{codeToName(code)}</Text>;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="1st Year Dorm"
          leftIconName="back"
          onLeftIconPress={this._onBack}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <FlatList
            data={DormCodeList}
            renderItem={({ item: code }) => (
              <ListItem
                onPress={() => {
                  this._onPress(code);
                }}
                title={this.renderDormName(code)}
              />
            )}
            keyExtractor={code => code}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderSeparator}
          />
        </View>
      </View>
    );
  }
}

export default SelectDormScreen;
