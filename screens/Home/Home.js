import React from 'react';
import { View, StatusBar, StyleSheet, DrawerLayoutAndroid, Image, FlatList, TouchableOpacity, Text, ActivityIndicator, ToastAndroid } from 'react-native';
import { Rating } from "react-native-elements";
import { Drawer, Toolbar } from 'react-native-material-ui';
import { Card, CardItem, Thumbnail, Text as NativeBaseText, Icon as NativeBaseIcon, Left, Body, Button as NativeBaseButton, Right } from 'native-base';
import { connect } from 'react-redux';
import { FIREBASE_DATABASE } from '../../constants/Firebase';
import { FILTER_DATA, CAPITALIZE_FIRST_LETTER, DISTANCE } from '../../constants/Functions';
import _ from 'lodash';
import { isLogin } from '../../redux/actions/actions';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      generalStarCount: 3.3,
      filter: undefined,
      userData: undefined,
      fetchList: [],
      searchList: [],
      isSearchLoading: false,
      searchLists: [],
      isFetchLoading: true,
      isSearch: false,
      searchTxt: '',
      list: [
        {
          name: 'shariq',
          service: 'electrician',
          area: 'Liaquatabad'
        },
        {
          name: 'ali',
          service: 'welder',
          area: 'nazimabad'
        },
        {
          name: 'anus',
          service: 'plumber',
          area: 'karimabad'
        },
        {
          name: 'usman',
          service: 'fridge technician',
          area: 'usmanabad'
        },
      ]
    }
    this._openDrawer = this._openDrawer.bind(this);
  }

  static navigationOptions = {
    header: null,
  };


  static getDerivedStateFromProps(nextProps) {
    return {
      userData: nextProps.userData,
      filter: nextProps.filter,
    };
  };

  _openDrawer() {
    this.drawer.openDrawer()
  }

  componentDidMount() {
    this._fetchData();
  }

  _searchData = () => {
    let { userData, searchTxt, searchList } = this.state;
    let myId = userData.id;

    if (searchTxt) {
      this.setState({ isSearchLoading: true, isSearch: true })
      searchList = [];
      var firstChar = searchTxt.charAt(0);
      var searchBy = firstChar === 0 ? "phoneNumber" : "name";
      var query = firstChar === 0 ? searchTxt : CAPITALIZE_FIRST_LETTER(searchTxt);
      FIREBASE_DATABASE.ref('users').orderByChild(searchBy).startAt(query).endAt(query + "\uf8ff").once('value', snap => {
        snap.forEach(snapshot => {
          var data = snapshot.val();
          var id = data.id;
          if (!data.isBlock && data.isAccountCreate && myId !== id) {
            searchList.push(snapshot.val());
          }
        })

      }).then(() => {
        this.setState({ searchList, isSearchLoading: false })

      }).catch((err) => console.log(err.message))

    } else {
      ToastAndroid.show('Please enter some text for searching', ToastAndroid.SHORT);
    }
  }

  _fetchData = async () => {
    let { userData, fetchList } = this.state;
    let myId = userData.id;
    let myLat = userData.location.coords.latitude;
    let myLng = userData.location.coords.longitude;

    FIREBASE_DATABASE.ref('users').on('value', snap => {
      fetchList = [];
      snap.forEach(snapshot => {
        var data = snapshot.val();
        var id = data.id;
        var lat = data.location.coords.latitude;
        var lng = data.location.coords.longitude;
        var distance = DISTANCE(myLat, myLng, lat, lng, 'K');
        if (!data.isBlock && data.isAccountCreate && myId !== id && distance <= 10) {
          fetchList.push(snapshot.val());
        }
      })
      this.setState({ fetchList, isFetchLoading: false })
    })
  }

  _toolbar = () => {
    return (
      <Toolbar
        style={{
          container: { backgroundColor: "#262726" },
          rightElementContainer: { right: 0 }
        }}
        leftElement="menu"
        centerElement="Cogent"
        searchable={{
          autoFocus: true,
          placeholder: 'Search',
          onSubmitEditing: () => this._searchData(),
          onSearchClosed: () => {
            this.setState({ searchTxt: '', isSearch: false })
          },
          onChangeText: (e) => this.setState({ searchTxt: e }),
        }}
        onLeftElementPress={this._openDrawer}
        rightElement="tune"
        onRightElementPress={() => this.props.navigation.navigate('Filter')}
      />
    );
  }

  _cardsHeader = (params) => {
    return (
      <CardItem header>
        <Left>
          <Thumbnail source={require('../../images/img_forest.jpg')} />
          <Body>
            <NativeBaseText style={styles.fontStyle}>{CAPITALIZE_FIRST_LETTER(params.name)}</NativeBaseText>
            <NativeBaseText style={styles.fontStyle} note>{CAPITALIZE_FIRST_LETTER(params.service)}</NativeBaseText>
          </Body>
        </Left>
        <Right>
          <NativeBaseButton transparent>
            <NativeBaseIcon type="MaterialCommunityIcons" style={{ fontSize: 27, color: '#000', fontWeight: 'lighter' }} name="heart-outline" />
          </NativeBaseButton>
        </Right>
      </CardItem>
    )
  }

  _cardsBottom = (params) => {
    return (
      <CardItem>
        <Left>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <NativeBaseIcon type="MaterialIcons" style={{ fontSize: 25, color: '#000', fontWeight: 'lighter' }} name="location-on" />
            <NativeBaseText style={{ marginLeft: 10, fontSize: 15 }}>{CAPITALIZE_FIRST_LETTER(params.location.data[0].city)}</NativeBaseText>
          </View>
        </Left>
        <Right>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '100%' }}>
            <NativeBaseText style={{ marginRight: 10, fontSize: 16, fontWeight: '300' }}>{this.state.generalStarCount}</NativeBaseText>
            <Rating
              imageSize={20}
              readonly
              ratingCount={1}
              startingValue={this.state.generalStarCount}
              fractions={10}
            />
          </View>
        </Right>
      </CardItem>
    )
  }

  _renderCards = (params) => {
    return (
      <Card>
        {this._cardsHeader(params)}
        {this._cardsBottom(params)}
      </Card>
    )
  }

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={`list-${index}`}
        style={styles.item}
        onPress={() => this.props.navigation.navigate('Profile', item)}
      >
        {this._renderCards(item)}
      </TouchableOpacity>
    );
  };

  _flatList = () => {
    const { isFetchLoading, searchTxt, isSearch, isSearchLoading, userData, filter, searchList } = this.state;
    let newFilter = searchList.length && FILTER_DATA(searchList, filter, userData);

    return (
      isSearch ?
        !isSearchLoading ?
          newFilter.length >= 0
            ?
            <FlatList
              refreshing={true}
              extraData={newFilter}
              data={newFilter}
              keyExtractor={(item, index) => 'searchKey' + index}
              renderItem={this.renderItem}
            />
            :
            <View style={styles.drawerProfileWrapper}>
              <Text style={{ fontWeight:'bold', fontSize: 18 }}>No search found "{searchTxt}"</Text>
            </View>
          :
          <View style={styles.drawerProfileWrapper}>
            <ActivityIndicator size="large" color="#262726" />
          </View>
        :
        !isFetchLoading ?
          <FlatList
            refreshing={true}
            extraData={this.state.fetchList}
            data={this.state.fetchList}
            keyExtractor={(item, index) => 'virtualKey' + index}
            renderItem={this.renderItem}
          />
          :
          <View style={styles.drawerProfileWrapper}>
            <ActivityIndicator size="large" color="#262726" />
          </View>
    )
  }

  _logout = () => {
    this.props.onDispatchIsLogin(false);
    this.props.navigation.navigate('Login');
  }

  render() {
    const { userData } = this.state;

    var navigationView = (
      <Drawer>
        <Drawer.Header
          style={{ contentContainer: styles.drawercontentContainer, contentContainer: { height: 220 } }}
          image={
            <Image source={require('../../images/drawerCover.jpg')} />
          }
        >
          <Drawer.Header.Account
            avatar={
              <View style={styles.drawerProfileWrapper}>
                <Image source={{ uri: userData.image.path }} style={styles.drawerProfileImage} />
                <Text style={styles.drawerProfileText} >{CAPITALIZE_FIRST_LETTER(userData.name)}</Text>
              </View>
            }
          />
        </Drawer.Header>
        <Drawer.Section
          divider
          items={[
            { icon: 'bookmark-border', value: 'Saved', onPress: () => console.log('hello') },
            { icon: 'chat', value: 'Messages', onPress: () => this.props.navigation.navigate('Chat') },
          ]}
        />
        <Drawer.Section
          title="Personal"
          items={[
            { icon: 'settings', value: 'Settings', onPress: () => console.log('hello') },
            { icon: 'input', value: 'Logout', onPress: () => this._logout() },
          ]}
        />
      </Drawer>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        statusBarBackgroundColor="#262726"
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        ref={(ref) => this.drawer = ref}
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>
          <View style={styles.toolbar}>
            {this._toolbar()}
          </View>

          {this._flatList()}
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#fff",
  },
  drawercontentContainer: {
    marginTop: StatusBar.currentHeight,
    color: "#fff",
  },
  header: {
    fontSize: 25
  },
  item: {
    justifyContent: 'center',
    marginRight: 10,
    marginLeft: 10,
    marginBottom: 3,
  },
  toolbar: {
    marginBottom: 15,
  },
  fontStyle: {
    textTransform: 'capitalize',
  },
  drawerProfileWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  drawerProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 100
  },
  drawerProfileText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16
  },
  loader: {
    marginTop: 20,
  }
})

const mapStateToProps = (state) => {
  return {
    userData: state.AuthReducer.user,
    filter: state.AuthReducer.filter,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDispatchIsLogin: (flag) => dispatch(isLogin(flag)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);