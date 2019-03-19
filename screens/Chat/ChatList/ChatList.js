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
            personsList: [],
            persons: [],
            isPersonFetchLoading: false,
            isPersonLoading: true,
            activeChat: undefined,
            messages: [],
            isMessagesFetchLoading: true,
            msgTxt: '',
            id: '',
            locationState: undefined,
            result: [],
            search: '',
        }
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            user: nextProps.user,
        }
    }

    static navigationOptions = {
        header:null
    }

    async componentDidMount() {
        const { locationState } = this.state;
        console.log(this.props.navigation.state);
        this.setState({
            isMessagesFetchLoading: locationState ? false : true,
            activeChat: locationState ? locationState : undefined,
        })
        await this._fetchPersonsList();
    }

    componentDidUpdate() {
        let { personsList, isPersonFetchLoading } = this.state;
        if (isPersonFetchLoading) {
            this._fetchPersons(personsList);
            this.setState({ isPersonFetchLoading: false })
        }
    }

    _fetchPersons = async (personsList) => {
        let { persons } = this.state;
        persons = [];
        var length = personsList.length;
        if (length) {
            personsList.map((v, i) => {
                FIREBASE_DATABASE.ref('users').child(v).once('value', snap => {
                    persons.push(snap.val());
                }).then(() => {
                    this.setState({ persons, isPersonLoading: length === i + 1 ? false : true })
                })
                return "";
            })
        }
    }

    _fetchPersonsList = () => {
        let { personsList, user } = this.state;
        FIREBASE_DATABASE.ref('users').child(user.id).child('chatPersons').on('value', snap => {
            personsList = [];
            snap.forEach(snapshot => {
                personsList.push(snapshot.val().id)
            })
            this.setState({ personsList, isPersonFetchLoading: true });
        })
    }

    _renderItems = () => {
        const { isPersonLoading, persons, user } = this.state;
        return (
            isPersonLoading ?
                <View style={styles.textMessageWrapper}>
                    <ActivityIndicator size="large" color="#262726" />
                </View>
                :
                !persons.length ?
                    <View style={styles.textMessageWrapper}>
                        <Text style={styles.textMessage}> NO MESSAGES YET</Text>
                    </View>
                    :
                    persons.map((v, i) => {
                        return (
                            <ListItem
                                divider
                                key={"Messages-Chat-List-" + i}
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
                                    <Image source={{ uri: v.image.path }} style={{ height: 50, width: 50, borderRadius: 100 }} />
                                }
                                centerElement={{
                                    primaryText: v.name,
                                }}
                                onPress={() => this.props.navigation.navigate('Chats', { data:v, userData:user })}
                            />
                        )
                    })
        )
    }

    render() {
        const { persons } = this.state;
        return (
            !persons.length ?
                <View style={styles.container}>
                    { this._renderItems() }
                </View>
                :
                <ScrollView style={styles.container}>
                    { this._renderItems() }
                </ScrollView>
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
