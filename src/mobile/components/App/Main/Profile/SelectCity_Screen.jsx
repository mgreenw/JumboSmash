// @flow
import * as React from 'react';
import { View, FlatList, ImageBackground, Text } from 'react-native';
import { connect } from 'react-redux';
import NavigationService from 'mobile/components/navigation/NavigationService';
import GEMHeader from 'mobile/components/shared/Header';
import { ListItem, SearchBar } from 'react-native-elements';
import _ from 'lodash';
import { textStyles } from 'mobile/styles/textStyles';
import { Colors } from 'mobile/styles/colors';

import type {
  NavigationEventPayload,
  NavigationEventSubscription
} from 'react-navigation';

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
 * @param {string} substring
 * @param {string} string
 * @returns {{preBold: string, bold: string, postBold: string}}
 */
function splitBoldText(substring: string, string: string) {
  const matchStart = string.toUpperCase().lastIndexOf(substring.toUpperCase());
  const matchEnd = matchStart + substring.length;

  return {
    preBold: string.substring(0, matchStart),
    bold: string.substring(matchStart, matchEnd),
    postBold: string.substring(matchEnd)
  };
}

/**
 * Show the alias text that matches the search
 * @param {string} search
 * @param {string[]} alias
 * @param {boolean} skipFormatting Signifies whether to not do any checks. Useful for eficeincy when parrent knows there is no match, e.g. when there is no search
 */
function formatAliasText(
  search: string,
  alias: string[],
  skipFormatting: boolean = false
): { component: React.Node, isMatch: boolean } {
  // Anything after this point happens so infrequently we can be a little lazy computationally.
  // (> 1% of our data has alias, max # of alias is 10)
  if (!skipFormatting && alias.length !== 0) {
    const searchName = search.toUpperCase();

    // Check if alias matches
    // Use the first matching one, same as we do in the actual search algo.
    // Bold the first part of the string that matches.
    const aliasName = alias.find(a => a.toUpperCase().indexOf(searchName) > -1);
    if (aliasName) {
      // We have guarenteed to be > -1 by above.
      const { preBold, bold, postBold } = splitBoldText(searchName, aliasName);
      const component = (
        <Text>
          <Text style={textStyles.body2Style}>{preBold}</Text>
          <Text style={textStyles.body2StyleBold}>{bold}</Text>
          <Text style={textStyles.body2Style}>{postBold}</Text>
        </Text>
      );
      return { component, isMatch: true };
    }
  }
  return { component: null, isMatch: false };
}

/**
 * Show the title text that matches the search
 * @param {string} search
 * @param {string} title
 * @param {boolean} subtitle for text size
 * @param {?boolean} skipFormatting for effeciency in chaining these parses. e.g. if Title matches, subtitle can be skipped
 */
function formatTitle(
  search,
  title,
  subtitle: boolean,
  skipFormatting: ?boolean = false
): { component: React.Node, isMatch: boolean } {
  const normalFont = subtitle ? textStyles.body2Style : textStyles.body1Style;
  const boldFont = subtitle
    ? textStyles.body2StyleBold
    : textStyles.body1StyleSemibold;
  if (!skipFormatting && search.length > 0) {
    if (title.toUpperCase().indexOf(search.toUpperCase()) === -1) {
      return { component: <Text>{title}</Text>, isMatch: false };
    }
    const { preBold, bold, postBold } = splitBoldText(search, title);
    const component = (
      <Text>
        <Text style={normalFont}>{preBold}</Text>
        <Text style={boldFont}>{bold}</Text>
        <Text style={normalFont}>{postBold}</Text>
      </Text>
    );
    return {
      component,
      isMatch: bold.length > 0
    };
  }
  return { component: <Text style={normalFont}>{title}</Text>, isMatch: true };
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
      locations: GenesisLocations
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

    // Both terminate early AND show the special ordering if empty
    if (search.length === 0) {
      this.setState({
        locations: GenesisLocations
      });
      return;
    }

    const searchName = search.toUpperCase();

    const [matchingByOwnName, restByName] = _.partition(
      AlphabeticalLocations,
      (location: Location) => {
        const locationName = location.name.toUpperCase();
        return locationName.indexOf(searchName) > -1;
      }
    );

    const [matchingByAlias, restByAlias] = _.partition(
      restByName,
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

    const [matchingByStateName, restByState] = _.partition(
      restByAlias,
      (location: Location) => {
        if (location.ancestors && location.ancestors.state) {
          const stateName = location.ancestors.state.name.toUpperCase();
          return stateName.indexOf(searchName) > -1;
        }
        return false;
      }
    );

    const [matchingByCountryName] = _.partition(
      restByState,
      (location: Location) => {
        if (location.ancestors && location.ancestors.country) {
          const countryName = location.ancestors.country.name.toUpperCase();
          return countryName.indexOf(searchName) > -1;
        }
        return false;
      }
    );

    const newLocations = [
      ...matchingByOwnName,
      ...matchingByAlias,
      ...matchingByStateName,
      ...matchingByCountryName
    ];

    this.setState({
      locations: newLocations
    });
  };

  renderHeader = () => {
    const { search } = this.state;
    return (
      <SearchBar
        containerStyle={{ backgroundColor: Colors.White }}
        inputContainerStyle={{ backgroundColor: Colors.IceBlue }}
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
              const {
                component: titleComponent,
                isMatch: titleMatches
              } = formatTitle(search, item.name, false);
              const {
                component: subtitleComponent,
                isMatch: subTitleMatches
              } = formatTitle(search, formatSubtitle(item), true, titleMatches);
              const { component: aliasComponent } = formatAliasText(
                search,
                item.alias,
                titleMatches || subTitleMatches
              );
              return (
                <ListItem
                  onPress={() => {
                    // TODO:
                    console.log(item);
                  }}
                  title={titleComponent}
                  subtitle={subtitleComponent}
                  rightElement={aliasComponent}
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
