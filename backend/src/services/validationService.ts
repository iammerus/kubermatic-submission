import { Cluster } from '../types/index.js';
import { dataService } from './dataService.js';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationService {
  validateCluster(
    clusterData: Partial<Cluster>,
    projectId: string,
    isUpdate: boolean = false
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!clusterData.name || clusterData.name.trim() === '') {
      errors.push({ field: 'name', message: 'Cluster name is required' });
    } else if (!isUpdate || clusterData.name) {
      if (dataService.clusterNameExists(projectId, clusterData.name, clusterData.id)) {
        errors.push({ 
          field: 'name', 
          message: 'Cluster name already exists in this project' 
        });
      }
    }

    // Region validation
    if (!isUpdate && (!clusterData.region || clusterData.region.trim() === '')) {
      errors.push({ field: 'region', message: 'Region is required' });
    } else if (clusterData.region && !dataService.isValidRegion(clusterData.region)) {
      errors.push({ field: 'region', message: 'Invalid region' });
    }

    // Version validation
    if (!isUpdate && (!clusterData.version || clusterData.version.trim() === '')) {
      errors.push({ field: 'version', message: 'Version is required' });
    } else if (clusterData.version && !dataService.isValidVersion(clusterData.version)) {
      errors.push({ field: 'version', message: 'Invalid version' });
    }

    // Node count validation
    if (!isUpdate && clusterData.nodeCount === undefined) {
      errors.push({ field: 'nodeCount', message: 'Node count is required' });
    } else if (clusterData.nodeCount !== undefined) {
      if (clusterData.nodeCount < 1 || clusterData.nodeCount > 100) {
        errors.push({ 
          field: 'nodeCount', 
          message: 'Node count must be between 1 and 100' 
        });
      }
    }

    return errors;
  }
}

export const validationService = new ValidationService();
