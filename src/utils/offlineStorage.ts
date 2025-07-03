// Simplified offline storage without IndexedDB for now
export class OfflineStorage {
  async init(): Promise<void> {
    // Initialize localStorage-based storage
  }

  async saveTasks(tasks: any[]): Promise<void> {
    localStorage.setItem('karmaquest-tasks', JSON.stringify(tasks));
  }

  async getTasks(): Promise<any[]> {
    const stored = localStorage.getItem('karmaquest-tasks');
    return stored ? JSON.parse(stored) : [];
  }

  async saveTask(task: any): Promise<void> {
    const tasks = await this.getTasks();
    tasks.push(task);
    await this.saveTasks(tasks);
  }

  async saveDiaryEntries(entries: any[]): Promise<void> {
    localStorage.setItem('karmaquest-diary', JSON.stringify(entries));
  }

  async getDiaryEntries(): Promise<any[]> {
    const stored = localStorage.getItem('karmaquest-diary');
    return stored ? JSON.parse(stored) : [];
  }

  async saveDiaryEntry(entry: any): Promise<void> {
    const entries = await this.getDiaryEntries();
    entries.push(entry);
    await this.saveDiaryEntries(entries);
  }

  async getUnsyncedTasks(): Promise<any[]> {
    return [];
  }

  async getUnsyncedDiaryEntries(): Promise<any[]> {
    return [];
  }

  async markAsSynced(store: string, id: string): Promise<void> {
    // No-op for now
  }

  async clearSyncedData(): Promise<void> {
    // No-op for now
  }

  async saveUserProgress(progress: any): Promise<void> {
    localStorage.setItem('karmaquest-progress', JSON.stringify(progress));
  }

  async getUserProgress(): Promise<any | null> {
    const stored = localStorage.getItem('karmaquest-progress');
    return stored ? JSON.parse(stored) : null;
  }
}

export const offlineStorage = new OfflineStorage();