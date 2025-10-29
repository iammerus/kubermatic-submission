import { validationService } from '../services/validationService.js';

describe('ValidationService', () => {
  describe('validateCluster', () => {
    it('should reject empty cluster name', () => {
      const errors = validationService.validateCluster(
        { name: '', region: 'us-east-1', version: '1.28.0', nodeCount: 3 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Cluster name is required',
      });
    });

    it('should reject missing region', () => {
      const errors = validationService.validateCluster(
        { name: 'test-cluster', version: '1.28.0', nodeCount: 3 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'region',
        message: 'Region is required',
      });
    });

    it('should reject missing version', () => {
      const errors = validationService.validateCluster(
        { name: 'test-cluster', region: 'us-east-1', nodeCount: 3 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'version',
        message: 'Version is required',
      });
    });

    it('should reject node count below minimum', () => {
      const errors = validationService.validateCluster(
        { name: 'test-cluster', region: 'us-east-1', version: '1.28.0', nodeCount: 0 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'nodeCount',
        message: 'Node count must be an integer between 1 and 100',
      });
    });

    it('should reject node count above maximum', () => {
      const errors = validationService.validateCluster(
        { name: 'test-cluster', region: 'us-east-1', version: '1.28.0', nodeCount: 101 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'nodeCount',
        message: 'Node count must be an integer between 1 and 100',
      });
    });

    it('should reject non-integer node count', () => {
      const errors = validationService.validateCluster(
        { name: 'test-cluster', region: 'us-east-1', version: '1.28.0', nodeCount: 3.5 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'nodeCount',
        message: 'Node count must be an integer between 1 and 100',
      });
    });
  });
});
