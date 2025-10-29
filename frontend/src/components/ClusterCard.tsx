import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cluster } from '../types';
import { StatusIcon } from './StatusIcon';

interface ClusterCardProps {
  cluster: Cluster;
  onEdit: (cluster: Cluster) => void;
  onDelete: (cluster: Cluster) => void;
}

export const ClusterCard = ({ cluster, onEdit, onDelete }: ClusterCardProps) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <StatusIcon status={cluster.status} />
            <Typography variant="h6" component="div">
              {cluster.name}
            </Typography>
          </Box>
          <Box>
            <IconButton
              size="small"
              onClick={() => onEdit(cluster)}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(cluster)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Region:
            </Typography>
            <Typography variant="body2">
              {cluster.region}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Version:
            </Typography>
            <Chip label={cluster.version} size="small" />
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              Nodes:
            </Typography>
            <Typography variant="body2">
              {cluster.nodeCount}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
