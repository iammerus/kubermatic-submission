import { TextField, MenuItem, Box, Typography } from '@mui/material';
import type { ClusterFormData, Region, Version } from '../../types';

interface Step1BasicsProps {
  formData: ClusterFormData;
  regions: Region[];
  versions: Version[];
  onChange: (updates: Partial<ClusterFormData>) => void;
}

export function Step1Basics({ formData, regions, versions, onChange }: Step1BasicsProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Basic Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Configure the basic settings for your cluster
      </Typography>

      <TextField
        fullWidth
        label="Cluster Name"
        value={formData.name}
        onChange={(e) => onChange({ name: e.target.value })}
        margin="normal"
        required
        helperText="Enter a unique name for your cluster"
      />

      <TextField
        fullWidth
        select
        label="Region"
        value={formData.region}
        onChange={(e) => onChange({ region: e.target.value })}
        margin="normal"
        required
        helperText="Select the region where your cluster will be deployed"
      >
        {regions.map((region) => (
          <MenuItem key={region.id} value={region.code}>
            {region.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        select
        label="Kubernetes Version"
        value={formData.version}
        onChange={(e) => onChange({ version: e.target.value })}
        margin="normal"
        required
        helperText="Select the Kubernetes version for your cluster"
      >
        {versions.map((version) => (
          <MenuItem key={version.version} value={version.version}>
            {version.version} {version.isDefault && '(Default)'}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
