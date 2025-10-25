import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Slider,
  Button,
  IconButton,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { ClusterFormData } from '../../types';

interface Step2CapacityProps {
  formData: ClusterFormData;
  onChange: (updates: Partial<ClusterFormData>) => void;
}

export function Step2Capacity({ formData, onChange }: Step2CapacityProps) {
  const [labelKey, setLabelKey] = useState('');
  const [labelValue, setLabelValue] = useState('');
  const [labelError, setLabelError] = useState('');

  const handleNodeCountChange = (value: number) => {
    onChange({ nodeCount: value });
  };

  const handleAddLabel = () => {
    setLabelError('');

    if (!labelKey.trim()) {
      setLabelError('Label key is required');
      return;
    }

    if (formData.labels && labelKey in formData.labels) {
      setLabelError('Label key already exists');
      return;
    }

    onChange({
      labels: {
        ...formData.labels,
        [labelKey]: labelValue,
      },
    });

    setLabelKey('');
    setLabelValue('');
  };

  const handleRemoveLabel = (key: string) => {
    const newLabels = { ...formData.labels };
    delete newLabels[key];
    onChange({ labels: newLabels });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Capacity Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the capacity and labels for your cluster
      </Typography>

      <Box mb={4}>
        <Typography gutterBottom>
          Node Count: {formData.nodeCount}
        </Typography>
        <Slider
          value={formData.nodeCount}
          onChange={(_, value) => handleNodeCountChange(value as number)}
          min={1}
          max={100}
          marks={[
            { value: 1, label: '1' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 75, label: '75' },
            { value: 100, label: '100' },
          ]}
          valueLabelDisplay="auto"
        />
        <TextField
          type="number"
          value={formData.nodeCount}
          onChange={(e) => handleNodeCountChange(Number(e.target.value))}
          inputProps={{ min: 1, max: 100 }}
          size="small"
          sx={{ mt: 1, width: 100 }}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Labels (Optional)
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Add key-value pairs to label your cluster
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
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Grid>
        </Grid>

        {formData.labels && Object.keys(formData.labels).length > 0 && (
          <Paper variant="outlined" sx={{ p: 2 }}>
            {Object.entries(formData.labels).map(([key, value]) => (
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
  );
}
