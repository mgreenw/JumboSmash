// @flow

import { View, FlatList, ImageBackground, Image } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from 'mobile/components/navigation/NavigationService';
import GEMHeader from 'mobile/components/shared/Header';
import React from 'react';
import { ListItem, SearchBar } from 'react-native-elements';

const LOCATIONS = require('./Locations');

console.log(LOCATIONS);

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

// Cities:
const SanFransisco = require('../../../../assets/icons/locations/SanFransisco.png');
const NewYork = require('../../../../assets/icons/locations/NewYork.png');
const DC = require('../../../../assets/icons/locations/DC.png');
const Seattle = require('../../../../assets/icons/locations/Seattle.png');
const Boston = require('../../../../assets/icons/locations/Boston.png');
const Austin = require('../../../../assets/icons/locations/Austin.png');
const Chicago = require('../../../../assets/icons/locations/Chicago.png');
const LosAngeles = require('../../../../assets/icons/locations/LosAngeles.png');
const OnTheRoad = require('../../../../assets/icons/locations/OnTheRoad.png');
const Miami = require('../../../../assets/icons/locations/Miami.png');
const Minneapolis = require('../../../../assets/icons/locations/Minneapolis.png');
const Philadelphia = require('../../../../assets/icons/locations/Philadelphia.png');

// Meta:
const Marker = require('../../../../assets/icons/locations/Marker.png');

const CityIcons = {
  SanFransisco,
  NewYork,
  DC,
  Seattle,
  Boston,
  Austin,
  Chicago,
  LosAngeles,
  OnTheRoad,
  Miami,
  Minneapolis,
  Philadelphia
};

type NavigationProps = {
  navigation: any
};

type ReduxProps = {};

type DispatchProps = {};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {
  postGradLocation: ?string,
  onSave: () => void,
  search: string,
  locations: string[]
};

function mapStateToProps(): ReduxProps {
  return {};
}

function mapDispatchToProps(): DispatchProps {
  return {};
}

// const LOCATIONS = ['HELLO', 'YOU', 'CATS', 'AND', 'DOGS'];

class SelectCityScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      postGradLocation: null,
      onSave: navigation.getParam('onSave', null),
      search: '',
      locations: LOCATIONS.locations
    };
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%'
          // backgroundColor: '#CED0CE',
        }}
      />
    );
  };

  onSearchChange = (search: string) => {
    this.setState({
      search
    });

    const newLocations = LOCATIONS.filter(item => {
      const itemData = item;
      const textData = search.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      locations: newLocations
    });
  };

  renderHeader = () => {
    const { search } = this.state;
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => this.onSearchChange(text)}
        autoCorrect={false}
        value={search}
      />
    );
  };

  _onBack = () => {
    const { onSave } = this.state;
    onSave();
    NavigationService.back();
  };

  _renderCityIcon = (city?: string) => (
    <Image
      style={{ width: 60, height: 60 }}
      source={city ? CityIcons[city] : Marker}
    />
  );

  render() {
    const { locations } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Post-Grad Location"
          leftIconName="back"
          onLeftIconPress={this._onBack}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <FlatList
            data={locations}
            renderItem={({ item }) => {
              return (
                <ListItem
                  onPress={() => {
                    console.log(item);
                  }}
                  leftAvatar={this._renderCityIcon(item.image)}
                  title={item.name}
                  subtitle={item.name}
                />
              );
            }}
            keyExtractor={item => item.code}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
          />
        </View>
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectCityScreen);
