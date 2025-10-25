import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Layout } from '../components/Layout';
import { Step1Basics } from '../components/wizard/Step1Basics';
import { Step2Capacity } from '../components/wizard/Step2Capacity';
import { Step3Summary } from '../components/wizard/Step3Summary';
import { clustersApi, referenceApi } from '../services/api';
import type { ClusterFormData, Region, Version } from '../types';

const steps = ['Basics', 'Capacity', 'Summary'];

export function ClusterWizard() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ClusterFormData>({
    name: '',
    region: '',
    version: '',
    nodeCount: 3,
    labels: {},
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReferenceData();
  }, []);

  const loadReferenceData = async () => {
    try {
      const [regionsRes, versionsRes] = await Promise.all([
        referenceApi.getRegions(),
        referenceApi.getVersions(),
      ]);
      setRegions(regionsRes.data);
      setVersions(versionsRes.data);
      
      // Set default version
      const defaultVersion = versionsRes.data.find((v) => v.isDefault);
      if (defaultVersion) {
        setFormData((prev) => ({ ...prev, version: defaultVersion.version }));
      }
    } catch (err) {
      setError('Failed to load reference data');
    }
  };

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');

    try {
      await clustersApi.create(projectId!, formData);
      navigate(`/projects/${projectId}/clusters`);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 'Failed to create cluster'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (updates: Partial<ClusterFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Step1Basics
            formData={formData}
            regions={regions}
            versions={versions}
            onChange={updateFormData}
          />
        );
      case 1:
        return (
          <Step2Capacity
            formData={formData}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <Step3Summary
            formData={formData}
            regions={regions}
            versions={versions}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return formData.name && formData.region && formData.version;
      case 1:
        return formData.nodeCount >= 1 && formData.nodeCount <= 100;
      case 2:
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout>
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton
            onClick={() => navigate(`/projects/${projectId}/clusters`)}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4">Create New Cluster</Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 300 }}>{renderStep()}</Box>

          <Box display="flex" justifyContent="space-between" mt={4}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Box>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleCreate}
                  disabled={loading || !isStepValid()}
                >
                  {loading ? 'Creating...' : 'Create Cluster'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}
