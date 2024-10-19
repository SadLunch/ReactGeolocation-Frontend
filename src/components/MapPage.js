import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import { throttle } from 'lodash';
//import FeedbackForm from '../components/FeedbackForm';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const socket = io.connect('https://reactgeolocation-backend.onrender.com'); // Replace with your backend URL
socket.emit('ask-locations', 'please');

// Set up the default icon for markers
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  const [position, setPosition] = useState([38.710, -9.142]); // User's position
  //const [usersLocations, setUsersLocations] = useState([]);   // Other users' locations
  const [experiences, setExperiences] = useState([]);   // Other users' locations


  // Throttle the send-location function to reduce frequency of emissions (e.g., every 5 seconds)
  const emitLocation = throttle((uuid) => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);

      //console.log("user id before: ", uuid);

      // Emit user's position to the backend via WebSocket
      socket.emit('send-location', { lat: latitude, lng: longitude }, uuid);
    });
  }, 5000); // 5000ms = 5 seconds
  
  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    );
  }

  useEffect(() => {
    // Fetch the experiences data from the backend API
    fetch('https://reactgeolocation-backend.onrender.com/api/experiences')
      .then((response) => response.json())
      .then((data) => {
        setExperiences(data);  // Store the experiences in the state
        console.log(experiences);
      })
      .catch((error) => {
        console.error('Error fetching experiences:', error);
      });
  }, [experiences]);  // The empty array ensures this runs only once, when the component mounts

  useEffect(() => {
    // Request user location and update on the map
    if (navigator.geolocation) {
      let uuid;
      if (localStorage.getItem('uuid')) {
        uuid = JSON.parse(localStorage.getItem('uuid'));
      } else {
        const { v4: uuidv4 } = require('uuid');

        // Generate a random UUID
        uuid = uuidv4();
        const inJSON = JSON.stringify(uuid);
        localStorage.setItem('uuid', inJSON);
      }
      // Emit user's position to the backend via WebSocket
      emitLocation(uuid);
    }

    // // Listen for other users' location updates
    // socket.on('user-location', (data, user) => {
    //   if (user !== localStorage.getItem('uuid')) {
    //     //console.log(`${user}'s location: `, data);

    //     // Update the state with the new location data for the other users
    //     setUsersLocations((prevLocations) => {
    //       // Check if the user already exists in the list
    //       const userExists = prevLocations.find(loc => loc.user === user);

    //       if (userExists) {
    //         // Update the existing user's location
    //         return prevLocations.map(loc => loc.user === user ? { user, location: data } : loc);
    //       } else {
    //         // Add new user and their location
    //         return [...prevLocations, { user, location: data }];
    //       }
    //     });
    //   }
    // });

    // // Cleanup WebSocket connection on component unmount
    // return () => {
    //   socket.off('user-location');
    // };
  }, [emitLocation]);

  return (
    <div>
      <h1>Map Page</h1>
      <MapContainer id='map' center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marker for user's current location */}
        <LocationMarker />

        {/* Markers for other users' locations */}
        {experiences.map((exp) => (
          <Marker key={exp.name} position={exp.location}>
            <Popup>{exp.name}'s location</Popup>
          </Marker>
        ))}
      </MapContainer>
      {/* <FeedbackForm /> */}
    </div>
  );
};

export default MapPage;
