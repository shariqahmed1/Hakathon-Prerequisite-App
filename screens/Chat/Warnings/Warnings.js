import React from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ListItem, Avatar } from 'react-native-material-ui'
import { connect } from 'react-redux';
import { FIREBASE_DATABASE } from '../../../constants/Firebase';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import { MaterialDialog  } from 'react-native-material-dialog';

class Warnings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isWarning: false,
      isWarningLoading: true,
      warnings:[],
      visible:false,
      index:0,
    }
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      user: nextProps.user,
    }
  }

  static navigationOptions = {
    header: null,
  }

  componentDidMount() {
    this._fetchWarningsList();
  }

  _fetchWarningsList = () => {
    let { user, warnings } = this.state;
    FIREBASE_DATABASE.ref('users').child(user.id).child('warnings').on('value', snap => {
      warnings = [];

      if (snap.exists()) {
        snap.forEach(snapshot => {
          if(!snapshot.val().seen){
            var obj = {
              key : snapshot.key,
              data : snapshot.val(),
            };
            warnings.push(obj);
          }
        })
      }
      else {
        this.setState({
          isWarning: false,
          isWarningLoading: snap.exists()
        });
      }
      this.setState({ warnings, isWarningLoading: false, isWarning:true })
    })
  }
  
  _makeMsgSeen = (i) => {
    const { warnings, user } = this.state;
    FIREBASE_DATABASE.ref('users').child(user.id).child('warnings').child(warnings[i].key).update({
        seen:true
    })
  }

  _renderItems = () => {
    const { isWarningLoading, warnings, isWarning } = this.state;
    return (
      isWarningLoading ?
        <View style={styles.textMessageWrapper}>
          <ActivityIndicator size="large" color="#262726" />
        </View>
        :
        !isWarning ?
          <View style={styles.textMessageWrapper}>
            <Text style={styles.textMessage}> NO WARNINGS YET</Text>
          </View>
          :
          warnings.map((v, i) => {
            var sp = v.data.time.split(',');
            var conv = moment(sp[1], 'HH:mm').format('hh:mm a')
            return(
              <ListItem
                divider
                key={"warnings-"+i}
                style={{
                  container: {
                    marginTop: 10,
                    marginBottom: 10
                  },
                  centerElementContainer: {
                    marginLeft: 10,
                    marginRight: 10,
                    color: '#404240'
                  }
                }}
                rightElement={
                  <View style={styles.time}>
                    <Text>{conv}</Text>
                    <Text>{sp[0]}</Text>
                  </View>
                }
                leftElement={
                  <Icon 
                    name="alert"
                    color="#ffae42"
                    type="material-community"
                  />
                }
                centerElement={{
                  primaryText: v.data.message,
                }}
                onPress={() => {
                  this.setState({ visible:true, index:i });
                }}
              />
            )
          })
    )
  }

  _Dialog = () => {
    const { warnings, index } = this.state;
    return(
      <MaterialDialog
        title="Warning"
        visible={this.state.visible}
        onOk={() => {
          this.setState({ visible: false })
          this._makeMsgSeen(index)
        }}
        onCancel={() => {
          this.setState({ visible: false })
          this._makeMsgSeen(index)          
        }}
        colorAccent="#262726"
        titleColor="#ffae42"
        >
        <Text style={styles.dialogText}>
          {
            warnings.length && warnings[index].data.message
          }
        </Text>
      </MaterialDialog>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderItems()}
        { this._Dialog() }
      </View>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textMessageWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textMessage: {
    fontSize: 16,
    color: '#404240'
  },
  time:{
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center',
  }
});


const mapStateToProps = (state) => {
  return {
    user: state.AuthReducer.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Warnings);
