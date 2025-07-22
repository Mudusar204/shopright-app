// import { useGetMyOrders } from "@/hooks/queries/orders/orders.query";
// import { io, Socket } from "socket.io-client";

// class SocketService {
//   private socket: Socket | null = null;
//   private isConnected = false;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 1000; // 1 second

//   // Socket event listeners
//   private locationListeners: Map<string, (data: any) => void> = new Map();

//   constructor() {
//     this.initializeSocket();
//   }

//   private initializeSocket() {
//     try {
//       // Replace with your actual socket server URL
//       const socketUrl =
//         process.env.EXPO_PUBLIC_SOCKET_URL || "ws://192.168.100.190:3010";

//       this.socket = io(socketUrl, {
//         transports: ["websocket", "polling"],
//         autoConnect: true,
//         reconnection: true,
//         reconnectionAttempts: this.maxReconnectAttempts,
//         reconnectionDelay: this.reconnectDelay,
//         timeout: 20000,
//       });

//       this.setupEventListeners();
//     } catch (error) {
//       console.error("Failed to initialize socket:", error);
//     }
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("Socket connected:", this.socket?.id);
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       this.isConnected = false;
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("Socket connection error:", error);
//       this.isConnected = false;
//       this.reconnectAttempts++;

//       if (this.reconnectAttempts >= this.maxReconnectAttempts) {
//         console.error("Max reconnection attempts reached");
//       }
//     });

//     this.socket.on("reconnect", (attemptNumber) => {
//       console.log("Socket reconnected after", attemptNumber, "attempts");
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//     });

//     // Listen for rider location updates
//     this.socket.on("rider-location-update", (data) => {
//       console.log("rider-location-update", data);
//       const { riderId, latitude, longitude, timestamp } = data;
//       // Notify all listeners (admin or single rider)
//       this.locationListeners.forEach((listener, key) => {
//         // If key is 'admin', always notify
//         // If key is a riderId, only notify if matches
//         if (key === "admin" || key === riderId) {
//           listener({ riderId, latitude, longitude, timestamp });
//         }
//       });
//     });

//     this.socket?.on("order-status-update", (data) => {
//       console.log("order-placed", data);
//     });
//   }

//   // Subscribe to a single rider's location updates
//   public subscribeToRiderLocation(
//     riderId: string,
//     callback: (data: any) => void
//   ) {
//     this.locationListeners.set(riderId, callback);
//     this.socket?.emit("join-rider-tracking", riderId);
//     // No need to add a new event listener, already handled globally
//     return () => {
//       this.locationListeners.delete(riderId);
//       this.socket?.emit("leave-rider-tracking", riderId);
//     };
//   }

//   public subscribeToOrderStatus(
//     orderId: string,
//     callback: (data: any) => void
//   ) {
//     this.locationListeners.set(orderId, callback);
//     this.socket?.emit("join-order-room", orderId);
//     // No need to add a new event listener, already handled globally
//     return () => {
//       this.locationListeners.delete(orderId);
//       this.socket?.emit("leave-order-room", orderId);
//     };
//   }
//   // Get connection status
//   public getConnectionStatus(): boolean {
//     return this.isConnected;
//   }

//   // Manually connect
//   public connect() {
//     this.socket?.connect();
//   }

//   // Manually disconnect
//   public disconnect() {
//     this.socket?.disconnect();
//   }

//   // Emit custom events
//   public emit(event: string, data: any) {
//     this.socket?.emit(event, data);
//   }

//   public on(event: string, callback: (data: any) => void) {
//     this.socket?.on(event, callback);
//   }

//   // Clean up all listeners
//   public cleanup() {
//     this.locationListeners.clear();
//     this.socket?.disconnect();
//   }
// }

// // Create a singleton instance
// const socketService = new SocketService();

// export default socketService;

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let isConnected = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 1000;

const locationListeners = new Map<string, (data: any) => void>();
const orderStatusListeners = new Map<string, (data: any) => void>();

function initializeSocket() {
  try {
    const socketUrl =
      process.env.EXPO_PUBLIC_SOCKET_URL || "ws://69.62.120.81:5005";
    // "ws://192.168.100.202:5005";

    console.log("Initializing socket with URL:", socketUrl);
    console.log(
      "Environment EXPO_PUBLIC_SOCKET_URL:",
      process.env.EXPO_PUBLIC_SOCKET_URL
    );

    socket = io(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: reconnectDelay,
      timeout: 20000,
    });

    console.log("Socket instance created:", socket ? "success" : "failed");
    setupEventListeners();
  } catch (error) {
    console.error("Failed to initialize socket:", error);
  }
}

function setupEventListeners() {
  if (!socket) {
    console.log("No socket instance available for event listeners");
    return;
  }

  console.log("Setting up socket event listeners");

  socket.on("connect", () => {
    console.log("✅ Socket connected successfully!");
    console.log("Socket ID:", socket?.id);
    console.log("Socket connected:", socket?.connected);
    isConnected = true;
    reconnectAttempts = 0;
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", reason);
    console.log("Socket connected:", socket?.connected);
    isConnected = false;
  });

  socket.on("connect_error", (error) => {
    console.error("🔥 Socket connection error:", error);
    console.log("Error message:", error.message);
    console.log("Error details:", error);
    isConnected = false;
    reconnectAttempts++;

    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
    }
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    isConnected = true;
    reconnectAttempts = 0;
  });

  socket.on("rider-location-update", (data) => {
    console.log("📍 rider-location-update received:", data);
    const { riderId, latitude, longitude, timestamp } = data;

    locationListeners.forEach((listener, key) => {
      if (key === "admin" || key === riderId) {
        listener({ riderId, latitude, longitude, timestamp });
      }
    });
  });

  socket.on("order-status-update", (data) => {
    console.log("📦 order-status-update received:", data);

    orderStatusListeners.forEach((listener) => {
      listener(data);
    });
  });
}

// Public API
export const socketService = {
  subscribeToRiderLocation(riderId: string, callback: (data: any) => void) {
    console.log("subscribeToRiderLocation called with riderId:", riderId);
    console.log("Socket connection status:", isConnected);
    console.log("Socket instance:", socket ? "exists" : "null");

    if (!riderId) {
      console.warn("riderId is empty or undefined, skipping subscription");
      return () => {};
    }

    if (!socket) {
      console.warn("Socket not initialized, attempting to connect...");
      initializeSocket();
      return () => {};
    }

    if (!isConnected) {
      console.warn("Socket not connected, waiting for connection...");
      // Wait for connection before emitting
      const checkConnection = () => {
        if (isConnected) {
          console.log("Socket now connected, emitting join-rider-tracking");
          locationListeners.set(riderId, callback);
          socket?.emit("join-rider-tracking", riderId);
        } else {
          setTimeout(checkConnection, 1000);
        }
      };
      checkConnection();
    } else {
      console.log("Socket connected, emitting join-rider-tracking immediately");
      locationListeners.set(riderId, callback);
      socket?.emit("join-rider-tracking", riderId);
    }

    return () => {
      console.log("Unsubscribing from rider location:", riderId);
      locationListeners.delete(riderId);
      if (socket && isConnected) {
        socket.emit("leave-rider-tracking", riderId);
      }
    };
  },

  subscribeToOrderStatus(orderId: string, callback: (data: any) => void) {
    orderStatusListeners.set(orderId, callback);
    socket?.emit("join-order-room", orderId);
    return () => {
      orderStatusListeners.delete(orderId);
      socket?.emit("leave-order-room", orderId);
    };
  },

  getConnectionStatus(): boolean {
    return isConnected;
  },

  connect() {
    socket?.connect();
  },

  disconnect() {
    socket?.disconnect();
  },

  emit(event: string, data: any) {
    socket?.emit(event, data);
  },

  on(event: string, callback: (data: any) => void) {
    socket?.on(event, callback);
  },

  off(event: string, callback: (data: any) => void) {
    socket?.off(event, callback);
  },

  cleanup() {
    locationListeners.clear();
    socket?.disconnect();
  },

  // Test function for debugging
  testEmitJoinRiderTracking(riderId: string) {
    console.log("🧪 Testing join-rider-tracking emission");
    console.log("Socket connected:", isConnected);
    console.log("Socket instance:", socket ? "exists" : "null");

    if (socket && isConnected) {
      console.log("Emitting test join-rider-tracking event");
      socket.emit("join-rider-tracking", riderId);
    } else {
      console.log("Cannot emit - socket not ready");
    }
  },
};

// 🔌 Connect immediately on app start
initializeSocket();
