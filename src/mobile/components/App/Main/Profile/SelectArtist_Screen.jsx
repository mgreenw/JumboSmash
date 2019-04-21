// @flow
import * as React from 'react';
import { View, ImageBackground } from 'react-native';
import NavigationService from 'mobile/components/navigation/NavigationService';
import GEMHeader from 'mobile/components/shared/Header';
import { ListItem, SearchBar } from 'react-native-elements';
import { textStyles } from 'mobile/styles/textStyles';
import type { NavigationScreenProp } from 'react-navigation';
import type { Artist } from 'mobile/reducers/artists';
import type { ReduxState, Dispatch } from 'mobile/reducers';
import { connect } from 'react-redux';
import searchArtistsAction from 'mobile/actions/artists/searchArtists';
import { Colors } from 'mobile/styles/colors';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

const wavesFull = require('../../../../assets/waves/wavesFullScreen/wavesFullScreen.png');

type NavigationProps = {
  navigation: NavigationScreenProp<any>
};

type DispatchProps = {
  searchArtists: (artistName: string) => void
};

type ReduxProps = {
  searchInProgress: boolean,
  searchResultIds: string[],
  artistMap: { [id: string]: Artist }
};

type Props = NavigationProps & DispatchProps & ReduxProps;

type State = {
  searchText: string
};

function mapStateToProps({ artists }: ReduxState): ReduxProps {
  const { inProgress, byId, searchResultIds } = artists;
  return {
    searchInProgress: inProgress.search,
    searchResultIds,
    artistMap: byId
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    searchArtists: (artistName: string) => {
      dispatch(searchArtistsAction(artistName));
    }
  };
}

class SelectCityScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: ''
    };
  }

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

  // Controls the filerting of the location list.
  onSearchChange = (searchText: string) => {
    // Show the search immediately
    this.setState({
      searchText
    });
  };

  _onSearch = () => {
    const { searchText } = this.state;
    const { searchArtists } = this.props;
    if (searchText.trim().length > 0) {
      searchArtists(searchText);
    }
  };

  renderHeader = () => {
    const { searchText } = this.state;
    const { searchInProgress } = this.props;
    return (
      <SearchBar
        containerStyle={{ backgroundColor: Colors.White }}
        inputContainerStyle={{ backgroundColor: Colors.IceBlue }}
        placeholder={'"Guster"'}
        placeholderTextColor={Colors.Grey80}
        inputStyle={[textStyles.body1Style, { color: Colors.Black }]}
        lightTheme
        round
        onChangeText={text => this.onSearchChange(text)}
        autoCorrect={false}
        value={searchText}
        showLoading={searchInProgress}
        returnKeyType={'search'}
        onSubmitEditing={this._onSearch}
      />
    );
  };

  _save = (id: string) => {
    const { navigation, artistMap } = this.props;
    const onSave: ?(
      id: null | string,
      artist: null | Artist
    ) => void = navigation.getParam('onSave', null);
    if (onSave) onSave(id, artistMap[id]);
  };

  _onBack = () => {
    NavigationService.back();
  };

  _onPress = (id: string) => {
    this._save(id);
    this._onBack();
  };

  render() {
    const { searchResultIds, artistMap } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <GEMHeader
          title="Spring Fling Artist"
          leftIconName="back"
          onLeftIconPress={this._onBack}
        />
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={wavesFull}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
          />
          <KeyboardAwareFlatList
            enableResetScrollToCoords={false}
            data={searchResultIds}
            renderItem={({ item: id }) => {
              const { name, images } = artistMap[id];
              const [{ url = null }] =
                images && images.length > 0 ? images.slice(-1) : [{}];
              return (
                <ListItem
                  onPress={() => {
                    this._onPress(id);
                  }}
                  leftAvatar={{
                    title: artistMap[id].name[0],
                    source: url ? { uri: url } : null,
                    size: 'medium'
                  }}
                  titleStyle={textStyles.body1Style}
                  title={name}
                />
              );
            }}
            keyExtractor={id => id}
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
