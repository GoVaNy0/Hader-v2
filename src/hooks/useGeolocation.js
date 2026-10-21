import { useState, useEffect, useCallback } from 'react';
import { CAMPUS_COORDINATES, calculateHaversineDistance } from '../utils/geoUtils';

export function useGeolocation() {
  const [coords, setCoords] = useState({
    latitude: CAMPUS_COORDINATES.latitude,
    longitude: CAMPUS_COORDINATES.longitude
  });
  const [distance, setDistance] = useState(18); // Default inside campus 18m
  const [isInside, setIsInside] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        const d = calculateHaversineDistance(
          latitude,
          longitude,
          CAMPUS_COORDINATES.latitude,
          CAMPUS_COORDINATES.longitude
        );
        setDistance(d);
        setIsInside(d <= CAMPUS_COORDINATES.allowedRadiusMeters);
        setLoading(false);
      },
      (err) => {
        // Fallback to campus coordinates on permission denial / dev environment
        setError(err.message || 'تعذر الوصول إلى نظام GPS');
        setDistance(18);
        setIsInside(true);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 10000 }
    );
  }, []);

  useEffect(() => {
    // Initial check
    requestLocation();
  }, [requestLocation]);

  return {
    coords,
    distance,
    isInside,
    loading,
    error,
    requestLocation,
    campus: CAMPUS_COORDINATES
  };
}

export default useGeolocation;
