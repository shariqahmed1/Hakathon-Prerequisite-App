import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  TextInput,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { FIREBASE_DATABASE } from '../../../constants/Firebase';
import moment from 'moment';
import _ from 'lodash';

const makeHeight = StatusBar.currentHeight * 2;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      data: undefined,
      userData: undefined,
      isMessagesFetching:true,
      messages:[],
      avoid: false,
      msgTxt: '',
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      data: nextProps.navigation.state.params.data,
      userData: nextProps.navigation.state.params.userData,
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.state.params.title,
      headerStyle: {
        marginTop: StatusBar.currentHeight - makeHeight
      },
    }
  }


  componentDidMount() {
    const { data } = this.state;
    this.props.navigation.setParams({ title: data.name });
    this._fetchMessages();
  }

  _fetchMessages = () => {
    let { userData, data, messages } = this.state;
    FIREBASE_DATABASE.ref('users').child(userData.id).child('messages').child(data.id).on('value', snap => {
      messages = [];
      snap.forEach(snapshot => {
        messages.push(snapshot.val())
      })
      this.setState({ messages: _.sortBy(messages, [function(o) { return o.timeStamp; }]), isMessagesFetching : false })
    })
  }

  _addInChatPerson = (myId, receiverId) => {
    FIREBASE_DATABASE.ref('users').child(myId).child('chatPersons').child(receiverId).update({
      id:receiverId
    })
    FIREBASE_DATABASE.ref('users').child(receiverId).child('chatPersons').child(myId).update({
      id:myId
    })
  }


  _msgSend = () => {
    const { data, userData, msgTxt, messages } = this.state;
    let myId = userData.id;
    let receiverId = data.id;
    var date = new Date(); 
    var myDate= date - new Date(0);
    var time = new Date().getTime();
    var cal = myDate + time;

    if (msgTxt) {

      FIREBASE_DATABASE.ref('users').child(myId).child('messages').child(receiverId).push({
        time: moment().format('LT'),
        createdAt: new Date().toLocaleDateString(),
        message: msgTxt,
        id: myId,
        timeStamp: cal

      }).then(() => {
        FIREBASE_DATABASE.ref('users').child(receiverId).child('messages').child(myId).push({
          time: moment().format('LT'),
          createdAt: new Date().toLocaleDateString(),
          message: msgTxt,
          id: receiverId,
          timeStamp: cal
        })
        !messages.length && this._addInChatPerson(myId, receiverId);
        
      }).then(() => {
        this.setState({ msgTxt: '' })

      }).catch((err) => console.log(err.message))

    }
  }


  renderDate = (date) => {
    return (
      <Text style={styles.time}>
        {date}
      </Text>
    );
  }

  _renderItems = ({ item }) => {
    const { userData } = this.state;
    let inMessage = item.id === userData.id;
    let itemStyle = inMessage ? styles.itemOut : styles.itemIn;
    return (
      <View style={[styles.item, itemStyle]}>
        <View style={[styles.balloon]}>
          <Text>{item.message}</Text>
          {this.renderDate(item.time)}
        </View>
      </View>
    )
  }

  _renderFlatList = () => {
    return (
      <FlatList style={styles.list}
        data={this.state.messages}
        refreshing
        extraData={this.state.messages}
        keyExtractor={(item, index) => 'messagesKey'+index}
        renderItem={this._renderItems}
      />
    )
  }

  _wrapper = () => {
    return (
      <View style={styles.container}>
        {this._renderFlatList()}
        {this._footer()}
      </View>
    )
  }

  _footer = () => {
    const { msgTxt } = this.state;
    return (
      <View style={styles.footer}>

        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
            placeholder="Write a message..."
            underlineColorAndroid='transparent'
            value={msgTxt}
            onChangeText={(e) => this.setState({ msgTxt: e })}
            onFocus={() => this.setState({ avoid: true })}
          />
        </View>

        <View style={[styles.btnSend, styles.iconAttachment]}>
          <Icon
            name="md-attach"
            type="ionicon"
            size={30}
            color="#404240"
          />
        </View>

        <View style={styles.btnSend}>
          <Icon
            name="md-send"
            type="ionicon"
            size={30}
            color="#00BFFF"
            onPress={this._msgSend}
          />
        </View>

      </View>
    )
  }

  render() {
    const { isMessagesFetching } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={100} behavior="padding" enabled={this.state.avoid}>
        {
          isMessagesFetching ? 
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#404240" />
            </View>
            :
            this._wrapper()            
        }
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    padding: 10,
  },
  btnSend: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconAttachment: {
    marginRight: 10,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
  },
  itemIn: {
    alignSelf: 'flex-start'
  },
  itemOut: {
    alignSelf: 'flex-end'
  },
  time: {
    alignSelf: 'flex-end',
    paddingTop: 5,
    fontSize: 9,
    color: "#808080",
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#eeeeee",
    borderRadius: 5,
    padding: 5,
  },
  loader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
});  
