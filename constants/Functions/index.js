import { ImagePicker } from 'expo';
import { ToastAndroid } from "react-native";
import { FIREBASE_STORAGE } from '../Firebase';
import { StackActions, NavigationActions } from 'react-navigation';
import _ from 'lodash';

const PICK_IMAGE = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
    });
    if (!result.cancelled) {
        return result;
    }
    ToastAndroid.show(result.cancelled ? 'Canceled' : 'Failed', ToastAndroid.SHORT);
};

const UPLOAD_IMAGE = async (uri, storageRefrenceName) => {
    let randomnmbr = Math.floor(Math.random() * 900000000000000) + 100000000000000;
    const imgName = `${randomnmbr}.jpg`;
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function () {
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });
    const ref = FIREBASE_STORAGE.ref(storageRefrenceName).child(imgName);
    const snapshot = await ref.put(blob);
    const remoteUri = await snapshot.ref.getDownloadURL();
    blob.close();

    return {
        path:remoteUri, 
        name:imgName
    };
}

const RESET_ROUTE = (rtName) => {
    return resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: rtName })],
    });
}

const DISTANCE = (lat1, lon1, lat2, lon2, unit) => {
	if ((lat1 == lat2) && (lon1 == lon2)) {
        // return "No distance found";
    }
    var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	if (dist > 1) {
		dist = 1;
	}
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	return dist;
}

const FILTER_DATA = (fetchList, filter, userData) => {
    let categories = filter ? 
        filter[0].selectedItem.value !== "Any" ?  
        _.filter(fetchList, (param) =>  param.service === filter[0].selectedItem.value ) : 
        _.filter(fetchList, (param) =>  param ) : 
        _.filter(fetchList, (param) =>  param );
    
    let cities = filter ? 
      filter[1].selectedItem.value !== "Any" ?  
      _.filter(categories, (param) =>  param.location.data[0].city === filter[1].selectedItem.value ) : 
      _.filter(categories, (param) =>  param ) : 
      _.filter(categories, (param) =>  param );

    let distance = filter || userData ? 
      filter[2].selectedItem.value !== "All" ?  
      _.filter(cities, (param) => DISTANCE(userData.location.coords.latitude, userData.location.coords.longitude, param.location.coords.latitude, param.location.coords.longitude, 'K') <= filter[2].selectedItem.value ) :
      _.filter(cities, (param) =>  param ) : 
      _.filter(cities, (param) =>  param );
    return distance;
}


const CAPITALIZE_FIRST_LETTER = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export {
    RESET_ROUTE,
    FILTER_DATA,
    DISTANCE,
    PICK_IMAGE,
    UPLOAD_IMAGE,
    CAPITALIZE_FIRST_LETTER,
};
