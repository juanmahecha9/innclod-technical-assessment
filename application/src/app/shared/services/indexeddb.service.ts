import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexeddbService {
  private dbName = 'auth';
  private dbVersion = 1;
  private storeName = 'auth_info';
  private db!: IDBDatabase;

  constructor() {
    this.openDB();
  }

  private openDB() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(this.storeName)) {
        const objectStore = db.createObjectStore(this.storeName, {
          keyPath: 'id',
          autoIncrement: true,
        });
        objectStore.createIndex('mail', 'mail', { unique: true });
        objectStore.createIndex('password', 'password');
        objectStore.createIndex('id', 'id', { unique: true });
        objectStore.createIndex('names', 'names', { unique: true });
      }
    };

    request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event);
    };

    request.onsuccess = (event) => {
      console.log('IndexedDB opened successfully');
    };
  }

  addUser(auth: {
    email: string;
    password: string;
    id: string;
    names: string;
  }): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([this.storeName], 'readwrite');
        const objectStore = transaction.objectStore(this.storeName);
        const addRequest = objectStore.add(auth);

        addRequest.onsuccess = () => {
          resolve(addRequest.result);
        };

        addRequest.onerror = (event: any) => {
          reject('Error adding person: ' + event.target.errorCode);
        };
      };

      request.onerror = (event: any) => {
        const err = event.target.errorCode || null;
        reject('Error opening IndexedDB: ' + err);
      };
    });
  }

  private waitForDBOpen(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve();
      } else {
        const request = indexedDB.open(this.dbName, this.dbVersion);

        request.onsuccess = (event: any) => {
          this.db = event.target.result;
          resolve();
        };

        request.onerror = (event: any) => {
          reject('Error opening IndexedDB: ' + event.target.errorCode);
        };
      }
    });
  }

  async getUsersData(): Promise<any[]> {
    await this.waitForDBOpen();
    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = () => {
        const data = getAllRequest.result;
        if (data && data.length > 0) {
          resolve(data);
        } else {
          resolve([]);
        }
      };

      getAllRequest.onerror = (event: any) => {
        reject('Error getting auth info: ' + event);
      };
    });
  }

  async getUserByEmail(email: string): Promise<any | null> {
    await this.waitForDBOpen();
    return new Promise<any[]>((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, 'readonly');
      const objectStore = transaction.objectStore(this.storeName);
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = () => {
        const data = getAllRequest.result;
        if (data && data.length > 0) {
          const user = data.find((user) => user.email === email);
          resolve(user);
        } else {
          resolve([]);
        }
      };

      getAllRequest.onerror = (event: any) => {
        reject('Error getting auth info: ' + event);
      };
    });
  }

  clearData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction([this.storeName], 'readwrite');
        const objectStore = transaction.objectStore(this.storeName);
        const clearRequest = objectStore.clear();

        clearRequest.onsuccess = () => {
          resolve();
        };

        clearRequest.onerror = (event: any) => {
          reject('Error clearing store: ' + event.target.errorCode);
        };
      };

      request.onerror = (event: any) => {
        reject('Error opening IndexedDB: ' + event.target.errorCode);
      };
    });
  }
}
