import React from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { AppTabNavigator } from '../../navigation/AppNavigator';

export default class App extends React.Component {

  static navigationOptions = {
    header:null
  }

  render() {
      return (
        <View style={styles.container}>
            <AppTabNavigator />
        </View>
      );

    }    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop:StatusBar.currentHeight,
  }
});
