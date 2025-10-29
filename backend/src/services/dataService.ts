import fs from 'fs/promises';
import { watch } from 'fs';
import path from 'path';
import { Database, Cluster, Project, Region, Version } from '../types/index.js';

class DataService {
  private dbPath: string;
  private db: Database = { projects: [], clusters: [] };
  private regions: Region[] = [];
  private versions: Version[] = [];
  private fileWatcher: ReturnType<typeof watch> | null = null;
  private onDataChangeCallback: ((previousClusters: Cluster[], newClusters: Cluster[]) => void) | null = null;
  private isInternalChange = false;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'mock', 'db.json');
  }

  async loadData(): Promise<void> {
    try {
      const dbData = await fs.readFile(this.dbPath, 'utf-8');
      this.db = JSON.parse(dbData);

      const regionsData = await fs.readFile(
        path.join(process.cwd(), 'mock', 'regions.json'),
        'utf-8'
      );
      this.regions = JSON.parse(regionsData);

      const versionsData = await fs.readFile(
        path.join(process.cwd(), 'mock', 'versions.json'),
        'utf-8'
      );
      this.versions = JSON.parse(versionsData);

      console.log('Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      throw error;
    }
  }

  startWatching() {
    if (this.fileWatcher) {
      return;
    }

    this.fileWatcher = watch(this.dbPath, async (eventType) => {
      if (eventType === 'change' && !this.isInternalChange) {
        console.log('External database file change detected, reloading...');
        const previousClusters = [...this.db.clusters];
        
        try {
          const dbData = await fs.readFile(this.dbPath, 'utf-8');
          this.db = JSON.parse(dbData);
          
          if (this.onDataChangeCallback) {
            this.onDataChangeCallback(previousClusters, this.db.clusters);
          }
        } catch (error) {
          console.error('Error reloading data:', error);
        }
      }
    });

    console.log('File watching started for:', this.dbPath);
  }

  stopWatching() {
    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = null;
      console.log('File watching stopped');
    }
  }

  onDataChange(callback: (previousClusters: Cluster[], newClusters: Cluster[]) => void) {
    this.onDataChangeCallback = callback;
  }

  private async saveData(): Promise<void> {
    this.isInternalChange = true;
    await fs.writeFile(this.dbPath, JSON.stringify(this.db, null, 2));
    setTimeout(() => {
      this.isInternalChange = false;
    }, 100);
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // Projects
  getProjects(): Project[] {
    return this.db.projects;
  }

  getProjectById(id: string): Project | undefined {
    return this.db.projects.find(p => p.id === id);
  }

  // Clusters
  getClusters(projectId?: string): Cluster[] {
    if (projectId) {
      return this.db.clusters.filter(c => c.projectId === projectId);
    }
    return this.db.clusters;
  }

  getClusterById(id: string): Cluster | undefined {
    return this.db.clusters.find(c => c.id === id);
  }

  async createCluster(clusterData: Omit<Cluster, 'id' | 'createdAt' | 'updatedAt'>): Promise<Cluster> {
    const now = new Date().toISOString();
    const newCluster: Cluster = {
      ...clusterData,
      id: this.generateId('cluster'),
      createdAt: now,
      updatedAt: now,
    };

    this.db.clusters.push(newCluster);
    await this.saveData();
    return newCluster;
  }

  async updateCluster(id: string, updates: Partial<Omit<Cluster, 'id' | 'projectId' | 'createdAt'>>): Promise<Cluster> {
    const clusterIndex = this.db.clusters.findIndex(c => c.id === id);
    
    if (clusterIndex === -1) {
      throw new Error('Cluster not found');
    }

    const updatedCluster = {
      ...this.db.clusters[clusterIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.db.clusters[clusterIndex] = updatedCluster;
    await this.saveData();
    return updatedCluster;
  }

  async deleteCluster(id: string): Promise<void> {
    const clusterIndex = this.db.clusters.findIndex(c => c.id === id);
    
    if (clusterIndex === -1) {
      throw new Error('Cluster not found');
    }

    this.db.clusters.splice(clusterIndex, 1);
    await this.saveData();
  }

  clusterNameExists(projectId: string, name: string, excludeId?: string): boolean {
    return this.db.clusters.some(
      c => c.projectId === projectId && c.name === name && c.id !== excludeId
    );
  }

  // Reference data
  getRegions(): Region[] {
    return this.regions;
  }

  getVersions(): Version[] {
    return this.versions;
  }

  isValidRegion(region: string): boolean {
    return this.regions.some(r => r.code === region);
  }

  isValidVersion(version: string): boolean {
    return this.versions.some(v => v.version === version);
  }
}

export const dataService = new DataService();
