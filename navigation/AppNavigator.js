import { createAppContainer, createStackNavigator } from 'react-navigation';
import Home from '../screens/Home/Home';
import Login from '../screens/Login/Login';
import AfterLogin from '../screens/AfterLogin/AfterLogin.js';
import Filter from '../screens/Filter/Filter.js';

const AppNavigator = createStackNavigator({
    Home: {
      screen : Home
    },
    Login: {
        screen : Login
    },
    AfterLogin:{
      screen : AfterLogin
    },
    Filter:{
      screen : Filter
    }
  },{
    initialRouteName:"Login"
});

export default createAppContainer(AppNavigator);