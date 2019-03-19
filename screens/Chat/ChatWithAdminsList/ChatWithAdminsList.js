import React from 'react';
import { StyleSheet, View, Image, Text, ActivityIndicator, ScrollView } from 'react-native';
import { ListItem } from 'react-native-material-ui'
import { connect } from 'react-redux';
import { FIREBASE_DATABASE } from '../../../constants/Firebase';

class ChatList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isPerson: false,
            isPersonLoading: true,
        }
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            user: nextProps.user,
        }
    }

    static navigationOptions = {
        header:null,
    }

    componentDidMount() {
        this._fetchPersonsList();
    }

    _fetchPersonsList = () => {
        let { user } = this.state;
        FIREBASE_DATABASE.ref('admin').child('chatPersons').child(user.id).on('value', snap => {
            this.setState({ 
                isPersonLoading: false, 
                isPerson: snap.exists() 
            });
        })
    }

    _renderItems = () => {
        const { isPersonLoading, user, isPerson } = this.state;
        return (
            isPersonLoading ?
                <View style={styles.textMessageWrapper}>
                    <ActivityIndicator size="large" color="#262726" />
                </View>
                :
                !isPerson ?
                    <View style={styles.textMessageWrapper}>
                        <Text style={styles.textMessage}> NO MESSAGES YET</Text>
                    </View>
                    :
                    <ListItem
                        divider
                        style={{
                            container: {
                                marginTop: 10,
                                marginBottom: 10
                            },
                            centerElementContainer: {
                                marginLeft: 10,
                                color: '#404240'
                            }
                        }}
                        leftElement={
                            <Image source={require('../../../images/logo.png')} style={{ height: 50, width: 50, borderRadius: 100 }} />
                        }
                        centerElement={{
                            primaryText: "Admin",
                        }}
                        onPress={() => this.props.navigation.navigate('ChatWithAdmins', { title:"Admin",  userData:user })}
                    />
        )
    }

    render() {
        return (
                <View style={styles.container}>
                    { this._renderItems() }
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

export default connect(mapStateToProps, mapDispatchToProps)(ChatList);
