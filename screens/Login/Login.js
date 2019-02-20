import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Image, ImageBackground } from "react-native";
import { GoogleSignIn } from 'expo-google-sign-in';
import { Button as NativeBaseButton, Text as NativeBaseText, Icon as NativeBaseIcon } from 'native-base';
import { FIREBASE_DATABASE } from '../../constants/Firebase';
import { RESET_ROUTE } from '../../constants/Functions';
import { connect } from 'react-redux';
import { updateUser, isLogin, getUserDetails } from '../../redux/actions/actions';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogin : this.props.isLogin,
      isAccountCreate : this.props.isAccountCreate,
      navIndex: 0,
    }
  }

  static getDerivedStateFromProps(nextProps){
    return { 
      isLogin:nextProps.isLogin, 
      isAccountCreate:nextProps.isAccountCreate 
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount(){
    const { isLogin, isAccountCreate } = this.state;
    if(isLogin){
      isAccountCreate ? 
       this.props.navigation.dispatch(RESET_ROUTE('Home')) :
       this.props.navigation.dispatch(RESET_ROUTE('AfterLogin'));
    }
  }

  _googleSignIn = async () => {
    try {
      await GoogleSignIn.askForPlayServicesAsync();
      const { type, user } = await GoogleSignIn.signInAsync();
      if (type === 'success') {
        console.log(user);
      }
    } catch ({ message }) {
      console.log(message);
    }
  };

  _facebookSignIn = async () => {
    try {
      const {
        type,
        token,
      } = await Expo.Facebook.logInWithReadPermissionsAsync('2275771042704097', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        const data = await response.json();
        await this._authenticate(data, 'facebook');
      } else {
        console.log(type);
      }
    } catch ({ message }) {
      console.log(message);
    }
  };

  _authenticate = (data, signInType) => {
    
    FIREBASE_DATABASE.ref('users').child(data.id).once('value', snap => {
      if(snap.exists()){
        var getData = snap.val();
        this._saveDetails(getData, getData.isAccountCreate, signInType)
      }
      else{
        this._saveDetails(data, false, signInType)
      }
    })

  }

  _saveDetails = (data, flag, signInType) => {

    FIREBASE_DATABASE.ref('users').child(data.id).update({
      id:data.id,
      signInType,
      name:data.name,
      isAccountCreate:flag 
    }).then(() => {
      this.setState({ loading:false })
      this.props.onDispatchIsLogin(true)
      flag && this.props.onDispatchUpdateUser(data.id);
      !flag && this.props.onDispatchGetUserDetails(data);

    }).then(() => {
      flag ? 
       this.props.navigation.dispatch(RESET_ROUTE('Home')) :
       this.props.navigation.dispatch(RESET_ROUTE('AfterLogin'));

    }).catch(err => console.log(err.message))

  }

  _Loader = () => {
    return(
      <View style={styles.wrapper}>
        <Image style={styles.logo} source={require('../../images/reload.gif')}/>        
      </View>
    );
  }

  _Button = () => {
    return(
      <View style={styles.subInnerWrapper}>
        <View style={styles.btnWrapper}>
          <NativeBaseButton style={{ width:250 }} iconLeft block bordered light onPress={this._facebookSignIn}>
            <NativeBaseIcon name="logo-facebook"/>
            <NativeBaseText>Login with facebook</NativeBaseText>
          </NativeBaseButton>
        </View>
        
        <View style={styles.btnWrapper}>
          <NativeBaseButton style={{ width:250 }} iconLeft block bordered light onPress={this._googleSignIn}>
            <NativeBaseIcon  name="logo-google"/>
            <NativeBaseText>Login with Google</NativeBaseText>
          </NativeBaseButton>
        </View>
      </View>
    );
  }

  _Wrapper = () => {
    return(
      <View style={styles.wrapper}>
        <View style={styles.innerWrapper}>
          <View style={styles.subInnerWrapper}>
            <Image style={styles.logo} source={require('../../images/logo.png')}/>
          </View>
        </View>

        <View style={styles.innerWrapper}>
          <ImageBackground source={{uri:'http://papers.co/wallpaper/papers.co-sb08-wallpaper-pastel-music-green-blur-23-wallpaper.jpg'}} style={{ width: '100%', height: '100%' }}>
            {
              this._Button()
            }
          </ImageBackground>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { 
          this._Wrapper()
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerWrapper:{
    width:'100%',
    height:'50%',
  },
  subInnerWrapper:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWrapper:{
    paddingTop:10,
    paddingBottom:10,
  },
  logo:{
    width:130,
    height:130,
  },
})


const mapStateToProps = (state) => {
  return {
      isLogin: state.AuthReducer.isLogin,
      isAccountCreate: state.AuthReducer.isAccountCreate,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
      onDispatchIsLogin: (flag) => dispatch(isLogin(flag)),
      onDispatchGetUserDetails: (data) => dispatch(getUserDetails(data)),
      onDispatchUpdateUser: (id) => dispatch(updateUser(id)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
