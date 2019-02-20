import React from 'react';
import { View, StatusBar, StyleSheet, DrawerLayoutAndroid, Image, FlatList, TouchableOpacity } from 'react-native';
import { Rating } from "react-native-elements";
import { Avatar, Drawer, Toolbar } from 'react-native-material-ui';
import { Card, CardItem, Thumbnail, Text as NativeBaseText, Icon as NativeBaseIcon, Left, Body, Button as NativeBaseButton, Right } from 'native-base';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      navIndex: 0,
      generalStarCount: 3.3,
      list:[
        {
          name:'shariq',
          service:'electrician',
          area:'Liaquatabad'
        },
        {
          name:'ali',
          service:'welder',
          area:'nazimabad'
        },
        {
          name:'anus',
          service:'plumber',
          area:'karimabad'
        },
        {
          name:'usman',
          service:'fridge technician',
          area:'usmanabad'
        },
      ]
    }
    this._openDrawer = this._openDrawer.bind(this);
  }

  static navigationOptions = {
    header: null,
  };
  
  _openDrawer() {
    this.drawer.openDrawer()
  }
  

  _toolbar = () => {
    return(
      <Toolbar
        style={{ 
          container : { backgroundColor:"#036158" }, 
          // rightElement : { alignItems:'flex-end' }, 
          rightElementContainer : { right:0 } 
        }}
        leftElement="menu"
        centerElement="Cogent"
        searchable={{
          autoFocus: true,
          placeholder: 'Search',
        }}
        onLeftElementPress={this._openDrawer}
        rightElement="tune"
        onRightElementPress={() => this.props.navigation.navigate('Filter')}
      />
    );
  }

  _cardsHeader = (params) => {
    return(
      <CardItem header>
        <Left>
          <Thumbnail source={ require('../../images/img_forest.jpg') } />
          <Body>
            <NativeBaseText>{params.name}</NativeBaseText>
            <NativeBaseText note>{params.service}</NativeBaseText>
          </Body>
        </Left>
        <Right>
          <NativeBaseButton transparent>
            <NativeBaseIcon type="MaterialCommunityIcons" style={{ fontSize:27, color:'#000', fontWeight:'lighter' }} name="heart-outline"/>
          </NativeBaseButton>
        </Right>
      </CardItem>
    )
  }

  _cardsBottom = (params) => {
    return(
      <CardItem> 
        <Left>
          <View style={{ flexDirection:'row', width:'100%'}}>
            <NativeBaseIcon type="MaterialIcons" style={{ fontSize:25, color:'#000', fontWeight:'lighter' }} name="location-on"/>
            <NativeBaseText style={{ marginLeft:10, fontSize:15 }}>{params.area}</NativeBaseText>
          </View>
        </Left>
        <Right>
          <View style={{ flexDirection:'row', justifyContent:'flex-end', width:'100%'}}>
            <NativeBaseText style={{ marginRight:10, fontSize:16, fontWeight:'300' }}>{this.state.generalStarCount}</NativeBaseText>
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
    return(
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
            onPress={() => console.log('Press')}
        >
          {this._renderCards(item)}
        </TouchableOpacity>
    );
  };

  _flatList = () => {
    return(
      <FlatList
        refreshing={true}
        extraData={this.state.list}
        data={this.state.list}
        renderItem={this.renderItem}
      />
    )
  }

  render() {

    var navigationView = (
      <Drawer>
        <Drawer.Header 
          style={{ contentContainer : styles.drawercontentContainer, contentContainer: { height:220 } }}
          image={
            <Image source={ require('../../images/img_forest.jpg') } />
          }
        >
        <Drawer.Header.Account
          avatar={<Avatar text="A" />}
          accounts={[
            { avatar: <Avatar icon="history" /> },
            { avatar: <Avatar text="C" /> },
          ]}
          footer={{
            style:{
              primaryText: { color : '#fff' },
              primaryTextContainer: { color : '#fff' },
              centerElementContainer: { textAlign: 'center', color : '#fff' }
            },
            dense: true,
            centerElement: {
              primaryText: 'Reservio',
            },
          }}
        />
        </Drawer.Header>
        <Drawer.Section
          divider
          items={[
            { icon: 'bookmark-border', value: 'Notifications' },
            { icon: 'today', value: 'Calendar', active: true },
            { icon: 'people', value: 'Clients' },
          ]}
        />
        <Drawer.Section
          title="Personal"
          items={[
            { icon: 'info', value: 'Info' },
            { icon: 'settings', value: 'Settings' },
          ]}
        />
      </Drawer>
    );

    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        statusBarBackgroundColor="#009588"
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
    color:"#fff",
  },
  drawercontentContainer: {
    marginTop: StatusBar.currentHeight,
    color:"#fff",
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
  toolbar:{
    marginBottom:15,
  }
})

export default Home;