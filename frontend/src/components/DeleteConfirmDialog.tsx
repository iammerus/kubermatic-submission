import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import type { Cluster } from '../types';

interface DeleteConfirmDialogProps {
  open: boolean;
  cluster: Cluster | null;
  onClose: () => void;
  onConfirm: (clusterId: string) => Promise<void>;
}

export function DeleteConfirmDialog({
  open,
  cluster,
  onClose,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!cluster) return;

    setLoading(true);
    try {
      await onConfirm(cluster.id);
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
      <DialogTitle>Delete Cluster</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete the cluster <strong>{cluster.name}</strong>?
        </Typography>
        <Typography color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
