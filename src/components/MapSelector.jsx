import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278
};

// For 100 square meters, we'll use approximately 0.0001 degrees
// This is because at the equator, 0.0001 degrees is roughly 11 meters
// So 0.0001 * 0.0001 ≈ 100 square meters
const DEFAULT_RECTANGLE_SIZE = 0.0001;

const libraries = ['geometry', 'places'];

const MapSelector = ({ onAreaSelect, onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [isSelected, setIsSelected] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  const mapRef = useRef(null);
  const rectangleRef = useRef(null);
  const rotationMarkerRef = useRef(null);
  const creationInProgress = useRef(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  });

  const cleanup = useCallback(() => {
    if (rectangleRef.current) {
      rectangleRef.current.setMap(null);
      rectangleRef.current = null;
    }
    if (rotationMarkerRef.current) {
      rotationMarkerRef.current.setMap(null);
      rotationMarkerRef.current = null;
    }
    setIsSelected(false);
    setRotation(0);
  }, []);

  const calculateArea = useCallback((bounds) => {
    if (!bounds || !window.google || !window.google.maps || !window.google.maps.geometry) {
      console.warn('Required Google Maps components not loaded');
      return;
    }

    try {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      
      if (!ne || !sw) {
        console.warn('Invalid bounds');
        return;
      }

      const path = [
        { lat: ne.lat(), lng: sw.lng() },
        { lat: ne.lat(), lng: ne.lng() },
        { lat: sw.lat(), lng: ne.lng() },
        { lat: sw.lat(), lng: sw.lng() }
      ];

      const area = window.google.maps.geometry.spherical.computeArea(path);
      onAreaSelect(area);

      const centerLat = (ne.lat() + sw.lat()) / 2;
      const centerLng = (ne.lng() + sw.lng()) / 2;
      
      getAddressFromLatLng(centerLat, centerLng);
    } catch (error) {
      console.error('Error calculating area:', error);
      onAreaSelect(0);
    }
  }, [onAreaSelect]);

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({
        location: { lat, lng }
      });

      if (response.results[0]) {
        const addressComponents = response.results[0].address_components;
        const postalCode = addressComponents.find(
          component => component.types.includes('postal_code')
        );
        
        if (postalCode) {
          onLocationSelect(postalCode.long_name);
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const createRectangle = useCallback(() => {
    if (creationInProgress.current || !mapRef.current) return;
    
    cleanup();
    creationInProgress.current = true;

    try {
      const center = mapRef.current.getCenter();
      const bounds = new window.google.maps.LatLngBounds(
        new window.google.maps.LatLng(
          center.lat() - DEFAULT_RECTANGLE_SIZE,
          center.lng() - DEFAULT_RECTANGLE_SIZE
        ),
        new window.google.maps.LatLng(
          center.lat() + DEFAULT_RECTANGLE_SIZE,
          center.lng() + DEFAULT_RECTANGLE_SIZE
        )
      );

      const rectangle = new window.google.maps.Rectangle({
        bounds: bounds,
        editable: true,
        draggable: true,
        fillColor: '#4CAF50',
        fillOpacity: 0.35,
        strokeColor: '#4CAF50',
        strokeOpacity: 0.8,
        map: mapRef.current
      });

      // Add rotation control
      const rotationMarker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          center.lat() + DEFAULT_RECTANGLE_SIZE * 1.2,
          center.lng()
        ),
        map: mapRef.current,
        draggable: true,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 7,
          fillColor: '#4CAF50',
          fillOpacity: 1,
          strokeColor: '#4CAF50',
          strokeWeight: 2
        }
      });

      rotationMarker.addListener('drag', () => {
        const markerPosition = rotationMarker.getPosition();
        const rectCenter = rectangle.getBounds().getCenter();
        
        // Calculate rotation angle
        const angle = Math.atan2(
          markerPosition.lng() - rectCenter.lng(),
          markerPosition.lat() - rectCenter.lat()
        ) * (180 / Math.PI);
        
        setRotation(angle);
      });

      rectangle.addListener('bounds_changed', () => {
        calculateArea(rectangle.getBounds());
      });

      rectangle.addListener('click', () => {
        setIsSelected(true);
      });

      rectangle.addListener('rightclick', (e) => {
        e.domEvent.preventDefault();
        cleanup();
        onAreaSelect(0);
        onLocationSelect('');
      });

      rectangleRef.current = rectangle;
      rotationMarkerRef.current = rotationMarker;
      calculateArea(bounds);
    } finally {
      creationInProgress.current = false;
    }
  }, [cleanup, calculateArea, onAreaSelect, onLocationSelect]);

  const handleCreateClick = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    createRectangle();
  }, [createRectangle]);

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Delete' && isSelected) {
      cleanup();
      onAreaSelect(0);
      onLocationSelect('');
    }
  }, [isSelected, cleanup, onAreaSelect, onLocationSelect]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
    cleanup();
  }, [cleanup]);

  const onUnmount = useCallback(() => {
    cleanup();
    mapRef.current = null;
    setMap(null);
  }, [cleanup]);

  return isLoaded ? (
    <div className="w-full">
      <div className="mb-4">
        <button
          onClick={handleCreateClick}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={creationInProgress.current}
        >
          Solarpanel-Bereich erstellen
        </button>
      </div>
      
      <div className="h-[400px] rounded-lg overflow-hidden shadow-md">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={18}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeId: 'satellite',
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: true,
            tilt: 0,
            heading: 0,
            gestureHandling: 'greedy'
          }}
        />
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        {rectangleRef.current 
          ? "Ziehen Sie den grünen Bereich, um ihn zu verschieben. Ziehen Sie die Ecken, um die Größe anzupassen. Ziehen Sie den grünen Punkt, um zu rotieren. Rechtsklick oder Delete-Taste zum Entfernen." 
          : "Klicken Sie auf den Button oben, um einen Bereich für die Solarpanels zu erstellen"}
      </div>
    </div>
  ) : (
    <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
      Karte wird geladen...
    </div>
  );
};

export default MapSelector; 