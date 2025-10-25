import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Cluster, Version } from '../types';

interface EditClusterDialogProps {
  open: boolean;
  cluster: Cluster | null;
  versions: Version[];
  onClose: () => void;
  onSave: (clusterId: string, updates: Partial<Cluster>) => Promise<void>;
}

export function EditClusterDialog({
  open,
  cluster,
  versions,
  onClose,
  onSave,
}: EditClusterDialogProps) {
  const [version, setVersion] = useState('');
  const [nodeCount, setNodeCount] = useState(3);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [labelKey, setLabelKey] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [labelError, setLabelError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cluster) {
      setVersion(cluster.version);
      setNodeCount(cluster.nodeCount);
      setLabels(cluster.labels || {});
    }
  }, [cluster]);

  const handleAddLabel = () => {
    setLabelError('');

    if (!labelKey.trim()) {
      setLabelError('Label key is required');
      return;
    }

    if (labelKey in labels) {
      setLabelError('Label key already exists');
      return;
    }

    setLabels({ ...labels, [labelKey]: labelValue });
    setLabelKey('');
    setLabelValue('');
  };

  const handleRemoveLabel = (key: string) => {
    const newLabels = { ...labels };
    delete newLabels[key];
    setLabels(newLabels);
  };

  const handleSave = async () => {
    if (!cluster) return;

    setLoading(true);
    try {
      await onSave(cluster.id, {
        version,
        nodeCount,
        labels,
      });
      onClose();
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setLoading(false);
    }
  };

  if (!cluster) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Cluster: {cluster.name}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            select
            label="Kubernetes Version"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            margin="normal"
          >
            {versions.map((v) => (
              <MenuItem key={v.version} value={v.version}>
                {v.version} {v.isDefault && '(Default)'}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            type="number"
            label="Node Count"
            value={nodeCount}
            onChange={(e) => setNodeCount(Number(e.target.value))}
            margin="normal"
            inputProps={{ min: 1, max: 100 }}
            helperText="Must be between 1 and 100"
          />

          <Box mt={3}>
            <Typography variant="subtitle2" gutterBottom>
              Labels
            </Typography>

            {labelError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {labelError}
              </Alert>
            )}

            <Grid container spacing={2} alignItems="center" mb={2}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Key"
                  value={labelKey}
                  onChange={(e) => setLabelKey(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Value"
                  value={labelValue}
                  onChange={(e) => setLabelValue(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleAddLabel}
                  size="small"
                >
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>

            {Object.keys(labels).length > 0 && (
              <Paper variant="outlined" sx={{ p: 2 }}>
                {Object.entries(labels).map(([key, value]) => (
                  <Box
                    key={key}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography variant="body2">
                      <strong>{key}:</strong> {value}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveLabel(key)}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Paper>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={loading || nodeCount < 1 || nodeCount > 100}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
