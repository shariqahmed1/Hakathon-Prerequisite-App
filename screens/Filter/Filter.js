import React from 'react';
import { View, StatusBar, StyleSheet, DrawerLayoutAndroid, Image, FlatList, TouchableOpacity } from 'react-native';
import { Rating } from "react-native-elements";
import { Avatar, Drawer, Toolbar } from 'react-native-material-ui';
import { Card, CardItem, Thumbnail, Text as NativeBaseText, Icon as NativeBaseIcon, Left, Body, Button as NativeBaseButton, Right } from 'native-base';

class Filter extends React.Component {
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
  }

  static navigationOptions = {
    title: "Filter",
  };
  

  render() {

    return (
        <View style={styles.container}>
          <View style={styles.toolbar}>
            {/* {this._toolbar()} */}
          </View>

            {/* {this._flatList()} */}
        </View>
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
  }
})

export default Filter;