import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import io from 'socket.io-client';
import FeedbackForm from '../components/FeedbackForm';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const socket = io.connect('https://reactgeolocation-backend.onrender.com'); // Replace with your backend URL

// Set up the default icon for markers
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
  const [position, setPosition] = useState([38.710, -9.142])
  function LocationMarker() {
    const map = useMapEvents({
      click() {
        map.locate()
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })
  
    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }

  useEffect(() => {
    // Request user location and update on the map
    if (navigator.geolocation) {
      let uuid;
      if (localStorage.getItem('uuid')) {
        uuid = JSON.parse(localStorage.getItem('uuid'))
      } else {
        const { v4: uuidv4 } = require('uuid');

        // Generate a random UUID
        uuid = uuidv4();
        const inJSON = JSON.stringify(uuid) 
        localStorage.setItem('uuid', inJSON) 
      }
      navigator.geolocation.watchPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);

        // Emit user's position to the backend via WebSocket
        socket.emit('send-location', { lat: latitude, lng: longitude }, { lat: 38.710, lng: -9.142 }, uuid);
      });
    }
    
    // Listen for updates of other users' locations
    socket.on('user-location', (data, user) => {
      if (user !== localStorage.getItem('uuid')) {
        console.log("Other user's location: ", data);
      }
      // Handle other users' locations (e.g., update markers)
    });
  }, []);

  return (
    <div>
      <h1>Map Page</h1>
      <MapContainer center={position} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker />
      </MapContainer>
      <FeedbackForm />
    </div>
  );
};

export default MapPage;
