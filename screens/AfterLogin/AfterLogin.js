import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Image, KeyboardAvoidingView, TouchableOpacity, Text, ToastAndroid, ScrollView } from "react-native";
import { Button as NativeBaseButton, Text as NativeBaseText, Icon as NativeBaseIcon, Item, Input as NativeBaseInput } from 'native-base';
import { PICK_IMAGE, UPLOAD_IMAGE, RESET_ROUTE } from '../../constants/Functions';
import { FIREBASE_DATABASE } from '../../constants/Firebase';
import { ListItem, Icon } from 'react-native-elements';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { connect } from 'react-redux';
import { updateUser, isAccountCreate } from '../../redux/actions/actions';
import { Location, Permissions } from 'expo';

class AfterLogin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            getLocation: false,
            isLoading: false,
            isLogin: this.props.isLogin,
            userData: this.propsuserData,
            isAccountCreate: this.props.isAccountCreate,
            image: '',
            phoneNumber: "",
            visible: false,
            selectedItem: {
                label: "None",
                selected: true,
                value: "None",
            },
            services: [{
                serviceName: 'None'
            }],
            location: undefined
        };
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            isLogin: nextProps.isLogin,
            userData: nextProps.userData,
            isAccountCreate: nextProps.isAccountCreate
        };
    };

    static navigationOptions = {
        title: 'Cogent',
    };

    componentDidMount() {
        this._fetchServices();
    };


    _getLocationAsync = async () => {
        this.setState({
            isLoading: true,
        })

        let check = await Location.hasServicesEnabledAsync();
        if (!check) {
            ToastAndroid.show('Please enable location service', ToastAndroid.SHORT);
            return;
        }

        ToastAndroid.show('Getting location...', ToastAndroid.SHORT);

        let { status } = await Permissions.askAsync(Permissions.LOCATION);

        if (status !== 'granted') {
            this.setState({
                isLoading: false,
                getLocation: false,
            })
            ToastAndroid.show('Permission denied, Try again !', ToastAndroid.SHORT);
        }

        let location = await Location.getCurrentPositionAsync({});
        let getData = await Location.reverseGeocodeAsync(location.coords);

        this.setState({
            location: {
                coords: location.coords,
                data: getData,
            },
            isLoading: false,
            getLocation: true,
        })
    };

    _fetchServices = () => {
        let { services } = this.state;

        FIREBASE_DATABASE.ref('services').on('value', snap => {
            services = [{ serviceName: 'None' }];
            snap.forEach(snapshot => {
                services.push(snapshot.val())
            })
            this.setState({ services })
        })
    };


    _saveInDatabase = (image, phoneNumber, service) => {
        const { userData, location } = this.state;
        FIREBASE_DATABASE.ref('users').child(userData.id).update({
            phoneNumber,
            image,
            service,
            isAccountCreate: true,
            location
        }).then(() => {
            this.props.onDispatchIsAccountCreate(true)
            this.props.onDispatchUpdateUser(userData.id);

        }).catch(err => console.log(err.message))
    };

    _saveDetails = () => {
        const { selectedItem, phoneNumber, image } = this.state;
        if (!image.uri || !phoneNumber) {
            ToastAndroid.show('All fields are required so please fill these', ToastAndroid.SHORT)
            return;
        }
        
        ToastAndroid.show('Saving...', ToastAndroid.SHORT);        
        this.setState({
            isLoading: true,
        })

        UPLOAD_IMAGE(image.uri, 'users').then((res) => {
            this._saveInDatabase(res, phoneNumber, selectedItem.value)
        }).then(() => {
            this.props.navigation.dispatch(RESET_ROUTE('Home'))
        }).catch(err => console.log(err.message))
    };

    _pickImage = () => {
        PICK_IMAGE().then((res) => this.setState({
            image: res
        }))
            .catch((err) => console.log(err.message));
    };


    _addPhoneNumber = (e) => {
        const re = /^[0-9\b]+$/;
        if (e === '' || re.test(e)) {
            this.setState({ phoneNumber: e })
        }
    };

    _Loader = () => {
        return (
            <View style={styles.wrapper}>
                <Image style={styles.logo} source={require('../../images/reload.gif')} />
            </View>
        );
    };

    _Dialog = () => {
        const { services } = this.state;
        return (
            <SinglePickerMaterialDialog
                title={'Choose Service'}
                items={services.map((row, index) => ({ value: row.serviceName, label: row.serviceName }))}
                visible={this.state.visible}
                scrolled
                colorAccent="#009588"
                selectedItem={this.state.selectedItem}
                onCancel={() => this.setState({ visible: false })}
                onOk={result => {
                    this.setState({ visible: false });
                    this.setState({ selectedItem: result.selectedItem })
                }}
            />
        )
    };

    _addServiceRender = () => {
        const { selectedItem, services } = this.state;
        return (
            <View>
                <Text style={{ color: '#005068', fontSize: 15, paddingTop: 10, paddingBottom: 13 }}>
                    Choose service what you want to do through this app <Text style={{ fontSize: 16, color: '#2E8B57' }} > *</Text>
                </Text>
                <Item></Item>
                <TouchableOpacity
                >
                    <ListItem
                        title={selectedItem ? selectedItem.value : services[0].serviceName}
                        titleStyle={{
                            fontSize: 15,
                        }}
                        containerStyle={{
                            borderBottomColor: 'transparent',
                        }}
                        onPress={() => this.setState({ visible: true })}
                        rightIcon={
                            <Icon name='plus'
                                type='material-community'
                                color='transparent'
                                size={28}
                            />
                        }
                    />
                </TouchableOpacity>
                <Item></Item>
            </View>
        );
    };

    _addPhoneNumberRender = () => {
        const { phoneNumber } = this.state;
        return (
            <View>
                <Text style={{ color: '#005068', fontSize: 15, paddingTop: 10, paddingBottom: 13 }}>Phone Number <Text style={{ fontSize: 16, color: '#2E8B57' }} > *</Text></Text>

                <Item></Item>

                <Item>
                    <NativeBaseInput
                        keyboardType="phone-pad"
                        style={styles.label}
                        value={phoneNumber}
                        onChangeText={(e) => this._addPhoneNumber(e)}
                        placeholder="Enter Phone Number"
                    />
                </Item>
            </View>
        );
    };

    _addDisplayPictureRender = () => {

        const {
            image,
        } = this.state;

        let img = image ? { uri: image.uri } : require('../../images/imageUploader.png');

        return (
            <View>

                <Text style={{ color: '#005068', fontSize: 15 }}>
                    Display Picture <Text style={{ fontSize: 16, color: '#2E8B57' }} > *</Text></Text>

                <TouchableOpacity style={{ width: 100, height: 100, marginTop: 15 }} onPress={this._pickImage}>
                    <Image source={img} style={{ width: 100, height: 100 }} />
                </TouchableOpacity>
            </View>
        )
    };

    _getLocationRender = () => {
        const { isLoading } = this.state;
        return (
            <View style={styles.btnWrapper}>
                <NativeBaseButton disabled={isLoading} style={{ width: 250, backgroundColor: '#02153e' }} iconLeft block bordered light onPress={this._getLocationAsync}>
                    <NativeBaseIcon name="md-locate" />
                    <NativeBaseText>Take Location</NativeBaseText>
                </NativeBaseButton>
            </View>
        )
    };

    _saveDetailsRender = () => {
        const { isLoading } = this.state;
        return (
            <View style={styles.btnWrapper}>
                <NativeBaseButton disabled={isLoading} style={{ width: 250, backgroundColor: '#009588' }} iconLeft block primary onPress={this._saveDetails}>
                    <NativeBaseIcon name="md-bookmark" />
                    <NativeBaseText>Save Details</NativeBaseText>
                </NativeBaseButton>
            </View>
        )
    };

    _Wrapper = () => {
        const { getLocation } = this.state;
        return (
            <ScrollView style={styles.wrapper}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.heading}>Add Account Details</Text>
                </View>

                <View style={styles.inputWrapper}>
                    {this._addDisplayPictureRender()}
                </View>

                <View style={styles.inputWrapper}>
                    {this._addPhoneNumberRender()}
                </View>

                <View style={styles.inputWrapper}>
                    {this._addServiceRender()}
                </View>

                <View style={styles.logoWrapper}>
                    {
                        getLocation ?
                            this._saveDetailsRender() :
                            this._getLocationRender()
                    }
                </View>

                {this._Dialog()}
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
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 15,
        marginRight: 15,
        flex: 1,
    },
    logo: {
        width: 120,
        borderRadius: 100,
        height: 120,
    },
    logoWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    inputWrapper: {
        marginTop: 15,
    },
    label: {
        fontSize: 15
    },
    btnWrapper: {
        paddingTop: 25,
        paddingBottom: 10,
    },
    heading: {
        marginBottom: 5,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    }
})



const mapStateToProps = (state) => {
    return {
        userData: state.AuthReducer.user,
        isLogin: state.AuthReducer.isLogin,
        isAccountCreate: state.AuthReducer.isAccountCreate,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDispatchUpdateUser: (id) => dispatch(updateUser(id)),
        onDispatchIsAccountCreate: (flag) => dispatch(isAccountCreate(flag)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AfterLogin);