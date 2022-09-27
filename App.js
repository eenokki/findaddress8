import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Alert } from 'react-native';
import MapView, { Marker } from'react-native-maps';
import * as Location from'expo-location';
import { API_TOKEN } from'@env';

export default function App() {
  const [location, setLocation] = useState(null); 
  const [address, setAddress]= useState('');
  const [coordinates, setCoordinates]= useState({lat:60.201373, lng:24.934041});

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location')
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setCoordinates({ lat: location.coords.latitude, lng: location.coords.longitude })
    })();
  },
    []);

  const locate = () => {
    fetch("http://www.mapquestapi.com/geocoding/v1/address?key="+ API_TOKEN +"&location=" + address + ",%2C+FI") //Finland is the default location
      .then(response => response.json())
      .then(data =>{ 
        console.log(data.results[0].locations[0].latLng), 
        setCoordinates({
          ...coordinates,
        lat: data.results[0].locations[0].latLng.lat,
        lng: data.results[0].locations[0].latLng.lng
      }) }  
      )
      .catch(error => {
        Alert.alert('Error:', error.message);
      });
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}
        region={{
          latitude: coordinates.lat,
          longitude: coordinates.lng,
          latitudeDelta: 0.0322,
          longitudeDelta: 0.0221
        }}
      >
        <Marker
          coordinate={{
            latitude: coordinates.lat,
            longitude: coordinates.lng,
          }}
        />
      </MapView>

      <TextInput
        style={styles.input}
        placeholder='Find street address'
        onChangeText={address => setAddress(address)}
        value={address}
      />
      <Button title="Show" onPress={locate} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: "100%",
    height: "80%"
  },
  input: {
    width: "100%",
  }
});