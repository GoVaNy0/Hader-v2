/**
 * Geolocation & Geofencing Utilities
 * Official University Coordinates (Helwan University / Dokki Campus - Faculty of Specific Education)
 */

export const CAMPUS_COORDINATES = {
  latitude: 30.0384,
  longitude: 31.2125,
  name: "كلية التربية النوعية - قسم تكنولوجيا التعليم (مجمع الدقي)",
  allowedRadiusMeters: 150
};

/**
 * Haversine formula to compute exact distance in meters between two GPS coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // Distance in meters
}

/**
 * Verify whether given coordinates fall within university campus geofence
 */
export function verifyGeofence(userLat, userLng, maxRadius = CAMPUS_COORDINATES.allowedRadiusMeters) {
  const distance = calculateHaversineDistance(
    userLat,
    userLng,
    CAMPUS_COORDINATES.latitude,
    CAMPUS_COORDINATES.longitude
  );

  return {
    isInside: distance <= maxRadius,
    distanceMeters: distance,
    allowedRadius: maxRadius,
    campusName: CAMPUS_COORDINATES.name
  };
}
