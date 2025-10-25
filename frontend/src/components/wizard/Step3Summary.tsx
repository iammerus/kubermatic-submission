import { Box, Typography, Paper, Divider, Chip } from '@mui/material';
import type { ClusterFormData, Region, Version } from '../../types';

interface Step3SummaryProps {
  formData: ClusterFormData;
  regions: Region[];
  versions: Version[];
}

export function Step3Summary({ formData, regions, versions }: Step3SummaryProps) {
  const region = regions.find((r) => r.code === formData.region);
  const version = versions.find((v) => v.version === formData.version);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Review Configuration
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Review your cluster configuration before creating
      </Typography>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Cluster Name
          </Typography>
          <Typography variant="body1">{formData.name}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Region
          </Typography>
          <Typography variant="body1">{region?.name || formData.region}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Kubernetes Version
          </Typography>
          <Typography variant="body1">
            {formData.version}
            {version?.isDefault && (
              <Chip label="Default" size="small" sx={{ ml: 1 }} />
            )}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box mb={2}>
          <Typography variant="subtitle2" color="text.secondary">
            Node Count
          </Typography>
          <Typography variant="body1">{formData.nodeCount}</Typography>
        </Box>

        {formData.labels && Object.keys(formData.labels).length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Labels
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Object.entries(formData.labels).map(([key, value]) => (
                  <Chip
                    key={key}
                    label={`${key}: ${value}`}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
