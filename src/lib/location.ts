export interface GeoLocationResult {
  latitude: number;
  longitude: number;
  accuracy: number;
  mapsUrl: string;
  timestamp: number;
}

export function getCurrentCoordinates(): Promise<GeoLocationResult> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("خدمة تحديد الموقع الجغرافي غير مدعومة في متصفحك."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        resolve({
          latitude,
          longitude,
          accuracy: Math.round(accuracy),
          mapsUrl,
          timestamp: position.timestamp,
        });
      },
      (err) => {
        let msg = "تعذر الحصول على الموقع.";
        if (err.code === 1) {
          msg = "تم رفض إذن الوصول إلى الموقع.";
        } else if (err.code === 2) {
          msg = "موقع الجهاز غير متاح حالياً.";
        } else if (err.code === 3) {
          msg = "انتهت مهلة طلب الموقع.";
        }
        reject(new Error(msg));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}
