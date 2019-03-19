import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import Home from '../screens/Home/Home';
import Login from '../screens/Login/Login';
import AfterLogin from '../screens/AfterLogin/AfterLogin';
import Filter from '../screens/Filter/Filter';
import Profile from '../screens/Profile/Profile';
import MapView from '../screens/Location/MapView';
import Chat from '../screens/Chat';
import Chats from '../screens/Chat/Chats/Chats';
import AdminMessages from '../screens/Chat/ChatWithAdmins/ChatWithAdmins';
import Warnings from '../screens/Chat/Warnings/Warnings';
import ChatList from '../screens/Chat/ChatList/ChatList';
import ChatWithAdminsList from '../screens/Chat/ChatWithAdminsList/ChatWithAdminsList';
import ChatWithAdmins from '../screens/Chat/ChatWithAdmins/ChatWithAdmins';
import Hire from '../screens/Hire/Hire';

const Stack = createStackNavigator({
  Home: {
    screen: Home
  },
  Login: {
    screen: Login
  },
  AfterLogin: {
    screen: AfterLogin
  },
  Filter: {
    screen: Filter
  },
  Profile: {
    screen: Profile
  },
  MapView: {
    screen: MapView
  },
  Chat: {
    screen: Chat
  },
  Hire:{
    screen:Hire
  }
}, 
{
    initialRouteName: "Login"
});

const CutomerChatsStack = createStackNavigator({
  ChatList: {
    screen: ChatList
  },
  Chats: {
    screen: Chats,
  }
}, 
{
    initialRouteName: "ChatList"
});


CutomerChatsStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
    swipeEnabled: navigation.state.index === 0,
  };
};

const AdminsChatStack = createStackNavigator({
  ChatWithAdminsList: {
    screen: ChatWithAdminsList
  },
  ChatWithAdmins: {
    screen: ChatWithAdmins,
  }
}, 
{
    initialRouteName: "ChatWithAdminsList"
});


AdminsChatStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
    swipeEnabled: navigation.state.index === 0,
  };
};

const Tab = createMaterialTopTabNavigator({
  Messages: {
    screen: CutomerChatsStack,
  },
  AdminMessages: {
    screen: AdminsChatStack,
    navigationOptions: () => ({
      tabBarLabel: "Admin's Messages",
    })
  },
  Warnings: {
    screen: Warnings
  },
},
  {
    tabBarOptions: {
      labelStyle: {
        color: '#262726'
      },
      style: {
        backgroundColor: '#fff',
        borderColor: '#262726'
      },
      indicatorStyle: {
        backgroundColor: 'red',
      },
    }
  },
);

const AppStackNavigator = createAppContainer(Stack);
const AppTabNavigator = createAppContainer(Tab);

export {
  AppStackNavigator,
  AppTabNavigator
};