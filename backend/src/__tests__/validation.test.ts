import { validationService } from '../services/validationService.js';

describe('ValidationService', () => {
  describe('validateCluster', () => {
    const validCluster = {
      name: 'test-cluster',
      region: 'us-east-1',
      version: '1.28.0',
      nodeCount: 3,
    };

    it('should validate a valid cluster', () => {
      const errors = validationService.validateCluster(validCluster, 'project-1', false);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty cluster name', () => {
      const errors = validationService.validateCluster(
        { ...validCluster, name: '' },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Cluster name is required',
      });
    });

    it('should reject invalid cluster name format', () => {
      const errors = validationService.validateCluster(
        { ...validCluster, name: 'Invalid_Name!' },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'name',
        message: 'Cluster name must contain only lowercase letters, numbers, and hyphens',
      });
    });

    it('should reject node count below minimum', () => {
      const errors = validationService.validateCluster(
        { ...validCluster, nodeCount: 0 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'nodeCount',
        message: 'Node count must be between 1 and 100',
      });
    });

    it('should reject node count above maximum', () => {
      const errors = validationService.validateCluster(
        { ...validCluster, nodeCount: 101 },
        'project-1',
        false
      );
      expect(errors).toContainEqual({
        field: 'nodeCount',
        message: 'Node count must be between 1 and 100',
      });
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validationService.validateEmail('test@example.com')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(validationService.validateEmail('invalid-email')).toBe(false);
    });

    it('should reject empty email', () => {
      expect(validationService.validateEmail('')).toBe(false);
    });
  });
});
