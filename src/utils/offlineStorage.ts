import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface KarmaQuestDB extends DBSchema {
  tasks: {
    key: string;
    value: {
      id: string;
      title: string;
      description: string;
      category: string;
      priority: number;
      completed: boolean;
      xpReward: number;
      createdAt: string;
      lastModified: string;
      synced: boolean;
    };
  };
  diaryEntries: {
    key: string;
    value: {
      id: string;
      date: string;
      title: string;
      content: string;
      mood: number;
      tags: string[];
      insights?: string;
      sentiment?: string;
      lastModified: string;
      synced: boolean;
    };
  };
  userProgress: {
    key: string;
    value: {
      id: string;
      xp: number;
      level: number;
      achievements: string[];
      lastModified: string;
      synced: boolean;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<KarmaQuestDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<KarmaQuestDB>('KarmaQuestDB', 1, {
      upgrade(db) {
        // Tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });
          taskStore.createIndex('category', 'category');
          taskStore.createIndex('completed', 'completed');
          taskStore.createIndex('synced', 'synced');
        }

        // Diary entries store
        if (!db.objectStoreNames.contains('diaryEntries')) {
          const diaryStore = db.createObjectStore('diaryEntries', { keyPath: 'id' });
          diaryStore.createIndex('date', 'date');
          diaryStore.createIndex('synced', 'synced');
        }

        // User progress store
        if (!db.objectStoreNames.contains('userProgress')) {
          db.createObjectStore('userProgress', { keyPath: 'id' });
        }
      },
    });
  }

  // Tasks
  async saveTasks(tasks: any[]): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    
    for (const task of tasks) {
      await store.put({
        ...task,
        createdAt: task.createdAt.toISOString(),
        lastModified: new Date().toISOString(),
        synced: true
      });
    }
    
    await tx.done;
  }

  async getTasks(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const tasks = await this.db!.getAll('tasks');
    return tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt)
    }));
  }

  async saveTask(task: any): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.put('tasks', {
      ...task,
      createdAt: task.createdAt.toISOString(),
      lastModified: new Date().toISOString(),
      synced: false
    });
  }

  async getUnsyncedTasks(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const index = this.db!.transaction('tasks').store.index('synced');
    return await index.getAll(false);
  }

  // Diary Entries
  async saveDiaryEntries(entries: any[]): Promise<void> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction('diaryEntries', 'readwrite');
    const store = tx.objectStore('diaryEntries');
    
    for (const entry of entries) {
      await store.put({
        ...entry,
        date: entry.date.toISOString(),
        lastModified: new Date().toISOString(),
        synced: true
      });
    }
    
    await tx.done;
  }

  async getDiaryEntries(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const entries = await this.db!.getAll('diaryEntries');
    return entries.map(entry => ({
      ...entry,
      date: new Date(entry.date)
    }));
  }

  async saveDiaryEntry(entry: any): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.put('diaryEntries', {
      ...entry,
      date: entry.date.toISOString(),
      lastModified: new Date().toISOString(),
      synced: false
    });
  }

  async getUnsyncedDiaryEntries(): Promise<any[]> {
    if (!this.db) await this.init();
    
    const index = this.db!.transaction('diaryEntries').store.index('synced');
    return await index.getAll(false);
  }

  // User Progress
  async saveUserProgress(progress: any): Promise<void> {
    if (!this.db) await this.init();
    
    await this.db!.put('userProgress', {
      ...progress,
      lastModified: new Date().toISOString(),
      synced: false
    });
  }

  async getUserProgress(): Promise<any | null> {
    if (!this.db) await this.init();
    
    const allProgress = await this.db!.getAll('userProgress');
    return allProgress.length > 0 ? allProgress[0] : null;
  }

  // Sync operations
  async markAsSynced(store: 'tasks' | 'diaryEntries' | 'userProgress', id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const item = await this.db!.get(store, id);
    if (item) {
      item.synced = true;
      await this.db!.put(store, item);
    }
  }

  async clearSyncedData(): Promise<void> {
    if (!this.db) await this.init();
    
    // This could be used to clean up old synced data
    // Implementation depends on your data retention policy
  }
}

export const offlineStorage = new OfflineStorage();