# Real-Time Rider Tracking Implementation

This implementation provides real-time rider location tracking for the order details screen in the React Native app.

## Features

- Real-time rider location updates via WebSocket
- Live tracking map with rider and delivery location markers
- Connection status indicator
- Route visualization between rider and delivery location
- Automatic reconnection handling

## Components

### 1. Socket Service (`services/socket.service.ts`)

- Handles WebSocket connections to the tracking server
- Manages connection state and reconnection logic
- Provides methods to subscribe to rider location updates

### 2. Real-Time Rider Hook (`customHooks/riders/useRealTimeRider.ts`)

- Custom React hook for managing rider tracking state
- Handles socket subscriptions and location updates
- Provides connection status and tracking state

### 3. Rider Tracking Map (`components/RiderTrackingMap.tsx`)

- React Native map component showing rider and delivery locations
- Real-time marker updates
- Route line between rider and delivery location
- Connection status indicator

## Setup

### 1. Environment Configuration

Create a `.env` file in the root directory with:

```env
EXPO_PUBLIC_SOCKET_URL=ws://your-socket-server-url:port
```

### 2. Socket Server Requirements

The socket server should emit the following events:

- `rider-location-update`: Emitted when rider location changes
  ```javascript
  {
    riderId: "app_rider_id",
    latitude: 23.723081,
    longitude: 90.4087,
    timestamp: "2024-01-01T12:00:00Z"
  }
  ```

### 3. Socket Server Events to Handle

- `join-rider-tracking`: When client subscribes to a specific rider
- `leave-rider-tracking`: When client unsubscribes from a rider
- `join-admin-rider-tracking`: When admin subscribes to all riders
- `leave-admin-rider-tracking`: When admin unsubscribes from all riders

## Usage

### In Order Details Screen

The real-time tracking is automatically integrated into the order details screen when a rider is assigned to the order.

```typescript
// The hook is automatically used in OrderDetails component
const { riderLocation, socketConnected, isTracking } = useRealTimeRider({
  riderId: order?.records[0]?.app_rider_id?.id,
  onLocationUpdate: (location) => {
    console.log("Rider location updated:", location);
  },
});
```

### Rider Tracking Map Component

```typescript
<RiderTrackingMap
  riderLocation={
    riderLocation
      ? {
          latitude: riderLocation.latitude,
          longitude: riderLocation.longitude,
        }
      : null
  }
  deliveryLocation={{
    latitude: deliveryLatitude,
    longitude: deliveryLongitude,
  }}
  riderName="Rider Name"
  isConnected={socketConnected}
  height={250}
/>
```

## Features

### 1. Real-Time Updates

- Rider location updates in real-time
- Smooth marker animations
- Automatic map region updates

### 2. Connection Management

- Automatic reconnection on connection loss
- Connection status indicators
- Offline state handling

### 3. Map Features

- Delivery location marker (red pin)
- Rider location marker (bicycle icon)
- Route line between rider and delivery location
- Live/Offline status indicator

### 4. Error Handling

- Graceful connection error handling
- Reconnection attempts with exponential backoff
- Offline state messaging

## Customization

### Styling

All components use the app's theme system and can be customized by modifying the style objects in each component.

### Socket Configuration

Modify `services/socket.service.ts` to change:

- Reconnection attempts
- Reconnection delay
- Connection timeout
- Transport methods

### Map Configuration

Modify `components/RiderTrackingMap.tsx` to change:

- Marker styles
- Map region behavior
- Route line appearance
- Status indicator styling

## Troubleshooting

### Connection Issues

1. Check if the socket server is running
2. Verify the `EXPO_PUBLIC_SOCKET_URL` environment variable
3. Check network connectivity
4. Review socket server logs

### Map Issues

1. Ensure `react-native-maps` is properly configured
2. Check if location permissions are granted
3. Verify coordinate data format

### Performance Issues

1. Monitor socket connection frequency
2. Check for memory leaks in location listeners
3. Optimize map re-renders

## Dependencies

- `socket.io-client`: WebSocket client for real-time communication
- `react-native-maps`: Map component for location display
- `@expo/vector-icons`: Icons for UI elements

## Future Enhancements

1. **Route Optimization**: Integrate with mapping APIs for optimal routes
2. **ETA Calculation**: Calculate estimated time of arrival
3. **Push Notifications**: Notify users of rider status changes
4. **Chat Integration**: In-app messaging with rider
5. **Analytics**: Track delivery performance metrics
