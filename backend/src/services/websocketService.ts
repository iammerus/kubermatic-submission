import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Cluster } from '../types/index.js';

class WebSocketService {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      },
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  broadcastClusterUpdate(cluster: Cluster) {
    if (this.io) {
      this.io.emit('cluster:updated', cluster);
    }
  }

  broadcastClusterCreated(cluster: Cluster) {
    if (this.io) {
      this.io.emit('cluster:created', cluster);
    }
  }

  broadcastClusterDeleted(clusterId: string) {
    if (this.io) {
      this.io.emit('cluster:deleted', clusterId);
    }
  }

  broadcastClusterStatusChange(clusterId: string, status: Cluster['status']) {
    if (this.io) {
      this.io.emit('cluster:status', { clusterId, status });
    }
  }
}

export const websocketService = new WebSocketService();
