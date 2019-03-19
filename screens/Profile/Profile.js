import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Image, KeyboardAvoidingView, TouchableOpacity, Text, ToastAndroid, ScrollView } from "react-native";
import { Button as NativeBaseButton, Text as NativeBaseText, Icon as NativeBaseIcon, Item, Input as NativeBaseInput } from 'native-base';
import { PICK_IMAGE, UPLOAD_IMAGE, RESET_ROUTE, CAPITALIZE_FIRST_LETTER } from '../../constants/Functions';
import { FIREBASE_DATABASE } from '../../constants/Firebase';
import { ListItem, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { updateUser, isAccountCreate, services } from '../../redux/actions/actions';
import { StackActions, NavigationActions } from 'react-navigation';


class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            getLocation: false,
            isLoading: false,
            userData: this.props.userData,
            image: '',
            phoneNumber: "",
            visible: false,
            services: undefined,
            location: undefined,
            data:undefined,
        };
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            userData: nextProps.userData,
            data:nextProps.navigation.state.params,
            services: nextProps.services
        };
    };

    static navigationOptions = {
        title: 'Details',
    };

    _profile = () => {
        const { data } = this.state;
        return(
            <View style={styles.logoWrapper}>
                <Image source={{ uri : data.image.path }} style={styles.logo} />
                <Text style={{ fontSize:18, marginTop:15, fontWeight:'400' }}>{ CAPITALIZE_FIRST_LETTER(data.name) }</Text>
            </View>
        );
    }

    _service = () => {
        const { data } = this.state;
        return (
            <View>
                <Item></Item>
                <ListItem
                    title={"Service"}
                    titleStyle={{
                        fontSize: 15,
                        fontWeight:'400',
                    }}
                    containerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    rightTitle={ data.service }
                    rightTitleStyle={{
                        color: '#262726',
                    }}
                />
            </View>
        );
    };

    _phoneNumber = () => {
        const { data } = this.state;
        return(
            <View>
                <Item></Item>
                <ListItem
                    title={"Cell No."}
                    titleStyle={{
                        fontSize: 15,
                    }}
                    containerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    rightTitle={data.phoneNumber}
                    rightTitleStyle={{
                        color: '#262726',
                        width:100
                    }}
                />
            </View>
        )
    }

    _city = () => {
        const { data } = this.state;
        return(
            <View>
                 <Item></Item>
                <ListItem
                    title={"City"}
                    titleStyle={{
                        fontSize: 15,
                    }}
                    containerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    rightTitle={ data.location.data[0].city }
                    rightTitleStyle={{
                        color: '#262726',
                    }}
                />
            </View>
        )
    }

    _location = () => {
        const { data, userData } = this.state;
        let coordinates = [
            {
                latitude:data.location.coords.latitude,
                longitude:data.location.coords.longitude,
            },
            {
                latitude:userData.location.coords.latitude,
                longitude:userData.location.coords.longitude,
            }
        ];
        let name = data.name;
        return(
            <View>
                <Item></Item>
                <ListItem
                    title={"Location"}
                    titleStyle={{
                        fontSize: 15,
                    }}
                    containerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    rightIcon={
                        <Icon name='my-location'
                            type='material-icons'
                            color='#262726'
                            size={28}
                            onPress={() => this.props.navigation.navigate('MapView', { coordinates, name })}
                        />
                    }
                />
            </View>
        )
    }

    _message = () => {
        const { data, userData } = this.state;
        return(
            <View>
                <Item></Item>
                <ListItem
                    title={"Message"}
                    titleStyle={{
                        fontSize: 15,
                    }}
                    containerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    rightIcon={
                        <Icon name='message-text'
                            type='material-community'
                            color='#262726'
                            size={28}
                            

                            onPress={() => {
                                this.props.navigation.navigate('ChatList', {data, userData, sub:true})
                            }}
                        />
                    }
                />
                <Item></Item>
            </View>
        )
    }

    
    _hireMe = () => {
        const { data, userData } = this.state;
        return(
            <View>
                <Item></Item>
                <ListItem
                    title={"Hire"}
                    titleStyle={{
                        fontSize: 15,
                    }}
                    containerStyle={{
                        borderBottomColor: 'transparent',
                    }}
                    rightIcon={
                        <Icon name='handshake-o'
                            type='font-awesome'
                            color='#262726'
                            size={28}
                            onPress={() => this.props.navigation.navigate('Hire', { data }) }
                        />
                    }
                />
                <Item></Item>
            </View>
        )
    }

    _Wrapper = () => {
        return (
            <ScrollView style={styles.wrapper}>
                { this._profile() }
                
                <View style={styles.innerWrapper}>
                    { this._service() }
                    { this._phoneNumber() }
                    { this._city() }
                    { this._location() }
                    { this._message() }
                    { this._hireMe() }
                </View>

            </ScrollView>
        );
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} keyboardVerticalOffset={100} behavior="padding" enabled>
                {
                    this._Wrapper()
                }
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    wrapper: {
        flex: 1,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    logo: {
        width: 120,
        borderRadius: 100,
        height: 120,
    },
    logoWrapper: {
        marginTop:20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center',
    },
    innerWrapper: {
        marginTop: 25,
    }
})



const mapStateToProps = (state) => {
    return {
        userData: state.AuthReducer.user,
        isLogin: state.AuthReducer.isLogin,
        isAccountCreate: state.AuthReducer.isAccountCreate,
        services: state.AuthReducer.services,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDispatchUpdateUser: (id) => dispatch(updateUser(id)),
        onDispatchServices: (data) => dispatch(services(data)),
        onDispatchIsAccountCreate: (flag) => dispatch(isAccountCreate(flag)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);