// @flow

import { View, FlatList, ImageBackground, Text } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from 'mobile/components/navigation/NavigationService';
import GEMHeader from 'mobile/components/shared/Header';
import React from 'react';
import { ListItem, SearchBar } from 'react-native-elements';
import _ from 'lodash';

import type {
  NavigationEventPayload,
  NavigationEventSubscription
} from 'react-navigation';

type LocationAncestor = {
  code: string,
  name: string
};
type LocationAncestors = {
  continent: ?LocationAncestor,
  country: ?LocationAncestor,
  state: ?LocationAncestor
};

type Location = {
  name: string,
  type: string,
  alias: string[],
  ancestors: ?LocationAncestors
};

const LOCATIONS: {
  [type: string]: { [code: string]: Location }
} = require('../../../../../mobile/data/FormatedLocations.json');

const States = Object.keys(LOCATIONS.States).map(
  code => LOCATIONS.States[code]
);
const Countries = Object.keys(LOCATIONS.Countries).map(
  code => LOCATIONS.Countries[code]
);
const Cities = Object.keys(LOCATIONS.Cities).map(
  code => LOCATIONS.Cities[code]
);

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

/**
 *
 * @param {Location} location
 * @returns {string} a nicely formatted version of where the location is.
 */
function formatSubtitle(location: Location): string {
  if (!location.ancestors) return '';
  const { country, state } = location.ancestors;
  if (state && country) return `${state.name}, ${country.name}`;
  if (state) return state.name;
  if (country) return country.name;
  return '';
}

/**
 *
 * @param {string} search
 * @param {Location} item
 * Show the alias text that matches the search
 */
function aliasText(search, item) {
  const searchName = search.toUpperCase();
  const alias = [...item.alias];
  if (alias.length !== 0) {
    // // Don't show alias if a real match
    // const searchName = search.toUpperCase();
    // const locationName = item.name.toUppperCase();
    // if (locationName.indexOf(searchName) > -1) return '';

    // Check if alias matches
    const aliasName = alias.find(a => a.toUpperCase().indexOf(searchName) > -1);
    if (aliasName) {
      return <Text>{aliasName}</Text>;
    }
  }
  return null;
}

type NavigationProps = {
  navigation: any
};

type ReduxProps = {};

type DispatchProps = {};

type Props = ReduxProps & NavigationProps & DispatchProps;

type State = {
  postGradLocation: ?string,
  search: string,
  locations: Location[]
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
    this.state = {
      postGradLocation: null,
      search: '',
      locations: Cities
    };

    this.willBlurListener = props.navigation.addListener(
      'willBlur',
      this._onWillBlur
    );
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
    // Show the search immediately
    this.setState({
      search
    });
    const searchName = search.toUpperCase();

    const [citiesMatchingByOwnName, citiesRestByName] = _.partition(
      Cities,
      (location: Location) => {
        const locationName = location.name.toUpperCase();
        return locationName.indexOf(searchName) > -1;
      }
    );

    const [citiesMatchingByAlias, citiesRestByAlias] = _.partition(
      citiesRestByName,
      (location: Location) => {
        if (location.alias.length > 0) {
          return (
            [...location.alias].find(
              a => a.toUpperCase().indexOf(searchName) > -1
            ) !== undefined
          );
        }
        return false;
      }
    );

    const [citiesMatchingByStateName, citiesRestByState] = _.partition(
      citiesRestByAlias,
      (location: Location) => {
        if (location.ancestors && location.ancestors.state) {
          const stateName = location.ancestors.state.name.toUpperCase();
          return stateName.indexOf(searchName) > -1;
        }
        return false;
      }
    );

    const newLocations = [
      ...citiesMatchingByOwnName,
      ...citiesMatchingByAlias,
      ...citiesMatchingByStateName
    ];

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

  _save = () => {
    const { navigation } = this.props;
    const { postGradLocation } = this.state;
    const onSave: ?(?string) => void = navigation.getParam('onSave', null);
    if (onSave) onSave(postGradLocation);
  };

  _onBack = () => {
    this._save();
    NavigationService.back();
  };

  _onWillBlur = (payload: NavigationEventPayload) => {
    if (payload.action.type === 'Navigation/BACK') {
      this._save();
      this.willBlurListener.remove();
    }
  };

  willBlurListener: NavigationEventSubscription;

  render() {
    const { locations, search } = this.state;
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
                  rightElement={aliasText(search, item)}
                  title={item.name}
                  subtitle={formatSubtitle(item)}
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
