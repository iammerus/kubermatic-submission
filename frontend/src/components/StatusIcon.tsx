import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error';

interface StatusIconProps {
  status: 'running' | 'pending' | 'error';
}

export function StatusIcon({ status }: StatusIconProps) {
  const statusConfig = {
    running: {
      label: 'Running',
      color: 'success' as const,
      icon: <CheckCircleIcon />,
    },
    pending: {
      label: 'Pending',
      color: 'warning' as const,
      icon: <AccessTimeIcon />,
    },
    error: {
      label: 'Error',
      color: 'error' as const,
      icon: <ErrorIcon />,
    },
  };

  const config = statusConfig[status];

  return <Chip icon={config.icon} label={config.label} color={config.color} size="small" />;
}
