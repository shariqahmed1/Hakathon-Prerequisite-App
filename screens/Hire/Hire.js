import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Image, KeyboardAvoidingView, TouchableOpacity, Text, ToastAndroid, ScrollView } from "react-native";
import { Button as NativeBaseButton, Text as NativeBaseText, Icon as NativeBaseIcon, Item, Input as NativeBaseInput } from 'native-base';
import { PICK_IMAGE, UPLOAD_IMAGE, RESET_ROUTE } from '../../constants/Functions';
import { FIREBASE_DATABASE } from '../../constants/Firebase';
import { ListItem, Icon } from 'react-native-elements';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { connect } from 'react-redux';
import { updateUser, isAccountCreate, services } from '../../redux/actions/actions';
import { Location, Permissions } from 'expo';

class Hire extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            userData: this.props.userData,
            data:undefined,
            phoneNumber: "",
        };
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            userData: nextProps.userData,
            data: nextProps.navigation.state.params.data,
        };
    };

    static navigationOptions = {
        title: 'Hire',
    };


    _detailsRender = () => {
        const { phoneNumber } = this.state;
        return (
            <View>
                <Text style={{ color: '#005068', fontSize: 15, paddingTop: 10, paddingBottom: 13 }}>Details <Text style={{ fontSize: 16, color: '#2E8B57' }} > *</Text></Text>

                <Item></Item>
                <Item>
                    <NativeBaseInput
                        style={styles.label}
                        value={phoneNumber}
                        onChangeText={(e) => console.log(e)}
                        placeholder="Enter Details"
                    />
                </Item>
            </View>
        );
    };

    
    _budegtRender = () => {
        const { phoneNumber } = this.state;
        return (
            <View>
                <Text style={{ color: '#005068', fontSize: 15, paddingTop: 10, paddingBottom: 13 }}>Budget <Text style={{ fontSize: 16, color: '#2E8B57' }} > *</Text></Text>

                <Item></Item>
                <Item>
                    <NativeBaseInput
                        style={styles.label}
                        value={phoneNumber}
                        onChangeText={(e) => console.log(e)}
                        placeholder="Enter Budget"
                    />
                </Item>
            </View>
        );
    };


    _saveDetailsRender = () => {
        const { isLoading } = this.state;
        return (
            <View style={styles.btnWrapper}>
                <NativeBaseButton disabled={isLoading} style={{ width: 250, backgroundColor: '#009588' }} iconLeft block primary onPress={this._saveDetails}>
                    <NativeBaseIcon name="md-bookmark" />
                    <NativeBaseText>Hire</NativeBaseText>
                </NativeBaseButton>
            </View>
        )
    };

    _Wrapper = () => {
        return (
            <View style={styles.wrapper}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.heading}>Hire</Text>
                </View>
                <View style={styles.inputWrapper}>
                    {this._detailsRender()}
                </View>
                <View style={styles.inputWrapper}>
                    {this._budegtRender()}
                </View>
                <View style={styles.logoWrapper}>
                    {
                            this._saveDetailsRender()
                    }
                </View>

            </View>
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
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Hire);