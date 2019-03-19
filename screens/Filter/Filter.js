import React from 'react';
import { StyleSheet } from 'react-native';
import { View, TouchableOpacity, Text, ScrollView } from "react-native";
import { Item } from 'native-base';
import { ListItem, Icon } from 'react-native-elements';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import { filter } from '../../redux/actions/actions';
import { connect } from 'react-redux';
import { Button as NativeBaseButton, Text as NativeBaseText, Icon as NativeBaseIcon } from 'native-base';

class Filter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userData:undefined,
      services:undefined,
      isUpdate:false,
      serviceArr:[
        {
          title:'Category',
          selectedItem:{
            label: "Any",
            selected: true,
            value: "Any",
          },
          options:[
            {
              label: "Any",
              value: "Any",  
            }
          ],
        },
        {
          title:'Location',
          selectedItem:{
            label: "Any",
            selected: true,
            value: "Any",
          },
          options:[
            {
              label: "Any",
              value: "Any",  
            }
          ],
        },
        {
          title:'Nearest inside the radius of',
          selectedItem:{
            label: "10 KM",
            selected: true,
            value: "10",
          },
          options:[
            {
              label: "All",
              value: "All",
            },
            {
              label: "20 KM",
              value: "20",
            },
            {
              label: "10 KM",
              value: "10",
            },
            {
              label: "5 KM",
              value: "5",
            },
          ],
        },
      ],
      index:0,
      visible:false,
      cities:undefined,
      filter:undefined,
    }
  }

  static navigationOptions = {
    title: "Filter",
  };

  static getDerivedStateFromProps(nextProps) {
    return {
        userData: nextProps.userData,
        services: nextProps.services,
        cities: nextProps.cities,
        filter: nextProps.filter,
    };
  };

  componentDidMount(){
    let { serviceArr, userData, services, cities, filter } = this.state;
    filter && this.setState({ serviceArr : filter });
    !filter && this._setCategories(serviceArr, services);
    !filter && this._setMyLocation(serviceArr, userData);
    !filter && this._setCities(serviceArr, cities);
  }

  _setCategories = (serviceArr, services) => {
    serviceArr[0].options = services
    this.setState({
      serviceArr
    })
  }

  _setMyLocation = (serviceArr, userData) => {
    let getOutLocationFromUserData = userData.location ? userData.location.data[0].city : "All";

    serviceArr[1].selectedItem = {
      label: getOutLocationFromUserData,
      selected: true,
      value: getOutLocationFromUserData,
    },

    this.setState({
      serviceArr
    })
  }

  _setCities = (serviceArr, cities) => {
    serviceArr[1].options = cities;
    this.setState({
      serviceArr
    })
  }

  _Dialog = () => {
    let { serviceArr, index } = this.state;
    return (
      <SinglePickerMaterialDialog
        title={serviceArr[index].title}
        items={serviceArr[index].options.map((row, index) => ({ 
          value: row.value, label: row.label 
        }))}
        visible={this.state.visible}
        scrolled
        colorAccent="#009588"
        selectedItem={serviceArr[index].selectedItem}
        onCancel={() => this.setState({ visible: false })}
        onOk={result => {
          serviceArr[index].selectedItem = result.selectedItem;
          this.setState({ serviceArr, visible: false, isUpdate: true })
        }}
      />
    )
  };

  _setFilter = () => {
    this.props.onDispatchFilter(this.state.serviceArr)
  }

  _filterRender = () => {
    const { serviceArr } = this.state;
    return (
     serviceArr.map((item, index) => {
       return(
        <View style={styles.inputWrapper} key={"-makeItemsList"+index}>
          <Text style={{ color: '#000', fontSize: 16, paddingTop: 10, paddingBottom: 13 }}>
            {item.title}
          </Text>
          <Item></Item>
          <TouchableOpacity
          >
            <ListItem
              title={item.selectedItem.label}
              titleStyle={{
                fontSize: 15,
              }}
              containerStyle={{
                borderBottomColor: 'transparent',
              }}
              onPress={() => this.setState({ visible: true, index })}
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
       )
     })
    );
  };
  
  componentWillUnmount(){
    this._setFilter();
  }

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        <View>
          {
            this._filterRender()
          }
        </View>
        {this._Dialog()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    marginBottom: 10,
    marginLeft: 15,
    marginRight: 15,
    flex: 1,
  },
  inputWrapper: {
    marginTop: 15,
  },
})


const mapStateToProps = (state) => {
  return {
      userData: state.AuthReducer.user,
      services: state.AuthReducer.services,
      cities: state.AuthReducer.cities,
      filter: state.AuthReducer.filter,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDispatchFilter: (params) => dispatch(filter(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter);