import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../components/Layout';
import { ClusterCard } from '../components/ClusterCard';
import { EditClusterDialog } from '../components/EditClusterDialog';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';
import { useWebSocket } from '../hooks/useWebSocket';
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

  const handleClusterCreated = useCallback((cluster: Cluster) => {
    if (cluster.projectId === projectId) {
      setClusters((prev) => [...prev, cluster]);
    }
  }, [projectId]);

  const handleClusterUpdated = useCallback((cluster: Cluster) => {
    if (cluster.projectId === projectId) {
      setClusters((prev) =>
        prev.map((c) => (c.id === cluster.id ? cluster : c))
      );
    }
  }, [projectId]);

  const handleClusterDeleted = useCallback((clusterId: string) => {
    setClusters((prev) => prev.filter((c) => c.id !== clusterId));
  }, []);

  const handleClusterStatusChange = useCallback((data: { clusterId: string; status: Cluster['status'] }) => {
    setClusters((prev) =>
      prev.map((c) => (c.id === data.clusterId ? { ...c, status: data.status } : c))
    );
  }, []);

  useWebSocket({
    onClusterCreated: handleClusterCreated,
    onClusterUpdated: handleClusterUpdated,
    onClusterDeleted: handleClusterDeleted,
    onClusterStatus: handleClusterStatusChange,
  });

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
      setEditDialogOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to update cluster');
      throw err;
    }
  };

  const handleConfirmDelete = async (clusterId: string) => {
    try {
      await clustersApi.delete(clusterId);
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              label="Sort By"
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            >
              <MenuItem value="asc">Name (A-Z)</MenuItem>
              <MenuItem value="desc">Name (Z-A)</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateCluster}
          >
            Create Cluster
          </Button>
        </Box>

        <Grid container spacing={3}>
          {filteredClusters.map((cluster) => (
            <Grid item xs={12} sm={6} md={4} key={cluster.id}>
              <ClusterCard
                cluster={cluster}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Grid>
          ))}
        </Grid>

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
