import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  TableSortLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cluster } from '../types';
import { StatusIcon } from './StatusIcon';

interface ClusterTableProps {
  clusters: Cluster[];
  onEdit: (cluster: Cluster) => void;
  onDelete: (cluster: Cluster) => void;
}

type SortOrder = 'asc' | 'desc';

export const ClusterTable = ({ clusters, onEdit, onDelete }: ClusterTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const filteredAndSortedClusters = useMemo(() => {
    let filtered = clusters;

    if (searchTerm) {
      filtered = clusters.filter(
        (cluster) =>
          cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cluster.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [clusters, searchTerm, sortOrder]);

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Search by name or region"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel
                  active
                  direction={sortOrder}
                  onClick={handleSortToggle}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Node Count</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedClusters.map((cluster) => (
              <TableRow key={cluster.id}>
                <TableCell>
                  <StatusIcon status={cluster.status} />
                </TableCell>
                <TableCell>{cluster.name}</TableCell>
                <TableCell>{cluster.region}</TableCell>
                <TableCell>{cluster.version}</TableCell>
                <TableCell>{cluster.nodeCount}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEdit(cluster)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(cluster)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAndSortedClusters.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          No clusters found
        </Box>
      )}
    </Box>
  );
};
