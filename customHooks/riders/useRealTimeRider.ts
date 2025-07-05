import { useEffect, useState, useCallback, useRef } from "react";
import socketService from "@/services/socket.service";

interface Rider {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  currentLatitude: number | null;
  currentLongitude: number | null;
  isOnline: boolean;
  isActive: boolean;
  lastSeenAt: string | null;
  [key: string]: any;
}

interface LocationUpdate {
  riderId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface UseRealTimeRiderProps {
  riderId?: string | number;
  onLocationUpdate?: (location: LocationUpdate) => void;
}

const useRealTimeRider = ({
  riderId,
  onLocationUpdate,
}: UseRealTimeRiderProps) => {
  const [riderLocation, setRiderLocation] = useState<LocationUpdate | null>(
    null
  );
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Check socket connection status
  useEffect(() => {
    const checkConnection = () => {
      setSocketConnected(socketService.getConnectionStatus());
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Subscribe to rider location updates
  useEffect(() => {
    if (!riderId) {
      setIsTracking(false);
      return;
    }

    setIsTracking(true);
    const unsubscribe = socketService.subscribeToRiderLocation(
      riderId.toString(),
      (data: LocationUpdate) => {
        console.log("Rider location update received:", data);
        setRiderLocation(data);
        if (onLocationUpdate) {
          onLocationUpdate(data);
        }
      }
    );

    return () => {
      unsubscribe();
      setIsTracking(false);
    };
  }, [riderId, onLocationUpdate]);

  // Manually connect to socket
  const connectSocket = useCallback(() => {
    socketService.connect();
  }, []);

  // Manually disconnect from socket
  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
  }, []);

  return {
    riderLocation,
    socketConnected,
    isTracking,
    connectSocket,
    disconnectSocket,
  };
};

export default useRealTimeRider;
