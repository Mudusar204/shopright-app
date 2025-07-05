import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second

  // Socket event listeners
  private locationListeners: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.initializeSocket();
  }

  private initializeSocket() {
    try {
      // Replace with your actual socket server URL
      const socketUrl =
        process.env.EXPO_PUBLIC_SOCKET_URL || "ws://192.168.100.189:3010";

      this.socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
        timeout: 20000,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
      }
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    // Listen for rider location updates
    this.socket.on("rider-location-update", (data) => {
      console.log("rider-location-update", data);
      const { riderId, latitude, longitude, timestamp } = data;
      // Notify all listeners (admin or single rider)
      this.locationListeners.forEach((listener, key) => {
        // If key is 'admin', always notify
        // If key is a riderId, only notify if matches
        if (key === "admin" || key === riderId) {
          listener({ riderId, latitude, longitude, timestamp });
        }
      });
    });
  }

  // Subscribe to all rider location updates (admin dashboard)
  public subscribeToAllRiderLocations(callback: (data: any) => void) {
    console.log("subscribeToAllRiderLocations called");
    this.locationListeners.set("admin", callback);
    this.socket?.emit("join-admin-rider-tracking");
    // No need to add a new event listener, already handled globally
    return () => {
      this.locationListeners.delete("admin");
      this.socket?.emit("leave-admin-rider-tracking");
    };
  }

  // Subscribe to a single rider's location updates
  public subscribeToRiderLocation(
    riderId: string,
    callback: (data: any) => void
  ) {
    this.locationListeners.set(riderId, callback);
    this.socket?.emit("join-rider-tracking", riderId);
    // No need to add a new event listener, already handled globally
    return () => {
      this.locationListeners.delete(riderId);
      this.socket?.emit("leave-rider-tracking", riderId);
    };
  }

  // Get connection status
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Manually connect
  public connect() {
    this.socket?.connect();
  }

  // Manually disconnect
  public disconnect() {
    this.socket?.disconnect();
  }

  // Emit custom events
  public emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }

  // Clean up all listeners
  public cleanup() {
    this.locationListeners.clear();
    this.socket?.disconnect();
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService;
