import Geolocation from 'react-native-geolocation-service';
import { useDispatch } from 'react-redux';

import { setLocation } from '../Store/Slices/LocationSlice';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import axios from 'axios';



export const requestLocationPermission = async () => {
    const result = await request(
        Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );
    return result === RESULTS.GRANTED;
};



const retrieveareafromcoordinates = async (latitude : Number, longitude : Number) => {
    try {
        
        
        const response = await axios.get(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=15e97068706147738f39412d5df9f416`
        );

        if (response.data && response.data.results.length > 0) {
            return response.data.results[0].formatted;
        } else {
            console.log("No results found");
        }
    } catch (error) {
        // Log the error message for debugging
        console.error("Error retrieving area from coordinates:", error.message);
    }

}

export const getUserLocation = () : Promise<string> => {
   

    try {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(latitude, longitude, "Coordinates fetched");
                    const location = retrieveareafromcoordinates(latitude , longitude  );
                    resolve(location); // Resolve with coordinates
                },
                (error) => {
                    console.error(error);
                    reject(new Error("Failed to get location")); // Reject with an error
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    } catch (error) {
        console.log(error);
        throw new Error("Issue in getting location co-ordinates");


    }

};
