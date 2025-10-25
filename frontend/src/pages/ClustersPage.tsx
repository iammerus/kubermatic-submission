import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  TableSortLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../components/Layout';
import { StatusIcon } from '../components/StatusIcon';
import { EditClusterDialog } from '../components/EditClusterDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { clustersApi, projectsApi, referenceApi } from '../services/api';
import type { Cluster, Version } from '../types';

export function ClustersPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [filteredClusters, setFilteredClusters] = useState<Cluster[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [versions, setVersions] = useState<Version[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);

  useEffect(() => {
    if (projectId) {
      loadProject();
      loadClusters();
      loadVersions();
    }
  }, [projectId]);

  useEffect(() => {
    filterAndSortClusters();
  }, [searchTerm, clusters, sortOrder]);

  const loadProject = async () => {
    try {
      const response = await projectsApi.getAll();
      const project = response.data.find((p) => p.id === projectId);
      if (project) {
        setProjectName(project.name);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  };

  const loadClusters = async () => {
    try {
      const response = await clustersApi.getByProject(projectId!);
      setClusters(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to load clusters');
    } finally {
      setLoading(false);
    }
  };

  const loadVersions = async () => {
    try {
      const response = await referenceApi.getVersions();
      setVersions(response.data);
    } catch (err) {
      console.error('Failed to load versions:', err);
    }
  };

  const filterAndSortClusters = () => {
    let filtered = clusters;

    if (searchTerm) {
      filtered = clusters.filter(
        (cluster) =>
          cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cluster.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredClusters(sorted);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleCreateCluster = () => {
    navigate(`/projects/${projectId}/clusters/new`);
  };

  const handleEdit = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setEditDialogOpen(true);
  };

  const handleDelete = (cluster: Cluster) => {
    setSelectedCluster(cluster);
    setDeleteDialogOpen(true);
  };

  const handleSaveEdit = async (clusterId: string, updates: Partial<Cluster>) => {
    try {
      await clustersApi.update(clusterId, updates);
      await loadClusters();
      setEditDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update cluster');
      throw err;
    }
  };

  const handleConfirmDelete = async (clusterId: string) => {
    try {
      await clustersApi.delete(clusterId);
      await loadClusters();
      setDeleteDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to delete cluster');
      throw err;
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton onClick={() => navigate('/projects')} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">
            {projectName} - Clusters
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" gap={2} mb={3}>
          <TextField
            placeholder="Search by name or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCluster}
          >
            Create Cluster
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>
                  <TableSortLabel
                    active
                    direction={sortOrder}
                    onClick={handleSort}
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
              {filteredClusters.map((cluster) => (
                <TableRow key={cluster.id} hover>
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
                      onClick={() => handleEdit(cluster)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(cluster)}
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

        {filteredClusters.length === 0 && !loading && (
          <Box textAlign="center" py={8}>
            <Typography variant="body1" color="text.secondary">
              No clusters found
            </Typography>
          </Box>
        )}

        <EditClusterDialog
          open={editDialogOpen}
          cluster={selectedCluster}
          versions={versions}
          onClose={() => setEditDialogOpen(false)}
          onSave={handleSaveEdit}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          cluster={selectedCluster}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      </Box>
    </Layout>
  );
}
