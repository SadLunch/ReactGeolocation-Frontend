import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import { throttle } from 'lodash';
//import FeedbackForm from '../components/FeedbackForm';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from 'react-router-dom';

const socket = io.connect('https://reactgeolocation-backend.onrender.com'); // Replace with your backend URL

// const hardcodedExperiences = [
//   { id: 1, location: { lat: 38.710, lng: -9.140 }, name: 'Test Experience', nUsersIn: 5 }
// ];

// Set up the default icon for markers
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  const [position, setPosition] = useState([38.710, -9.142]); // User's position
  let [experienceLocations, setExperienceLocations] = useState([]);   // Other users' locations

  // Throttle the send-location function to reduce frequency of emissions (e.g., every 5 seconds)
  const emitLocation = throttle((lat, lng, uuid, currentExperience) => {
    socket.emit('send-location', { lat, lng }, uuid, currentExperience);
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
        <Popup>
          <div>
            <img src='../images/peacock.png' alt='peacock'></img>
            <span></span>
          </div>
          </Popup>
      </Marker>
    );
  }

  useEffect(() => {
    socket.on('locations', (experiences) => {
      console.log("Received experiences:", experiences);
      setExperienceLocations([...experiences]);  // Update the state with received experience locations
    });

    return () => {
      socket.off('locations');
    };
  }, []);
  

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

      // Watch the user's geolocation and send it via the WebSocket
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        // Emit user's position to the backend via WebSocket
        emitLocation(latitude, longitude , uuid, localStorage.getItem('currentExperience') || 0);
      }, null, {enableHighAccuracy: true});
    }

    // Listen for other users' location updates
    // socket.on('user-location', (data, expName, nUsersNear) => {
    //   if (user !== localStorage.getItem('uuid')) {
    //     console.log(`${user}'s location: `, data);

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

  const navigate = useNavigate();

  // Function to handle clicking on the popup text
  const handleClick = (text) => {
    // Navigate to the target page, passing the text as state
    navigate('/experience', { state: { expName: text } });
  };

  return (
    <div>
      <h1>Map Page</h1>
      <MapContainer id='map' center={position} zoom={13} style={{ height: '600px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Marker for user's current location */}
        <LocationMarker />

        {/* Markers for other users' locations */}
        {experienceLocations.map((expLoc) => {
          const { lat, lng } = expLoc.location;
          return (
            <Marker key={expLoc.id} position={[lat, lng]}>
              <Popup>
                <span onClick={() => handleClick(expLoc.name)} style={{ cursor: 'pointer' }}>
                  {expLoc.name}
                </span> <br /> {expLoc.nUsersIn} people here!
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {/* <FeedbackForm /> */}
    </div>
  );
};

export default MapPage;
