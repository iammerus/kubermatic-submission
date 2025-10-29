import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Cluster } from '../types';

interface WebSocketEvents {
  onClusterCreated?: (cluster: Cluster) => void;
  onClusterUpdated?: (cluster: Cluster) => void;
  onClusterDeleted?: (clusterId: string) => void;
  onClusterStatus?: (data: { clusterId: string; status: Cluster['status'] }) => void;
}

export const useWebSocket = (events: WebSocketEvents) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    if (events.onClusterCreated) {
      socket.on('cluster:created', events.onClusterCreated);
    }

    if (events.onClusterUpdated) {
      socket.on('cluster:updated', events.onClusterUpdated);
    }

    if (events.onClusterDeleted) {
      socket.on('cluster:deleted', events.onClusterDeleted);
    }

    if (events.onClusterStatus) {
      socket.on('cluster:status', events.onClusterStatus);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return socketRef.current;
};
