const ENCRYPTION_KEY = 'rezk_fit_hub_offline_secure_key';

const encryptValue = (val) => {
    if (val === null || val === undefined) return val;
    const str = typeof val === 'string' ? val : JSON.stringify(val);
    let cipher = '';
    for (let i = 0; i < str.length; i++) {
        cipher += String.fromCharCode(str.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
    }
    return btoa(unescape(encodeURIComponent(cipher)));
};

const decryptValue = (base64, parseJson = true) => {
    if (base64 === null || base64 === undefined) return base64;
    try {
        const cipher = decodeURIComponent(escape(atob(base64)));
        let str = '';
        for (let i = 0; i < cipher.length; i++) {
            str += String.fromCharCode(cipher.charCodeAt(i) ^ ENCRYPTION_KEY.charCodeAt(i % ENCRYPTION_KEY.length));
        }
        if (parseJson) {
            try {
                return JSON.parse(str);
            } catch {
                return str;
            }
        }
        return str;
    } catch {
        return null;
    }
};

class IndexedDBService {
    constructor() {
        this.dbName = 'RezkFitHubOfflineDB';
        this.dbVersion = 1;
        this.stores = [
            'pending_mutations',
            'queries',
            'attachments',
            'notifications',
            'drafts',
            'settings',
            'conversations',
            'reports'
        ];
        this.isMemoryMode = typeof indexedDB === 'undefined';
        this.memoryStore = {};

        if (this.isMemoryMode) {
            this.stores.forEach(s => {
                this.memoryStore[s] = new Map();
            });
        }
    }

    async getDb() {
        if (this.isMemoryMode) return null;
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = request.result;
                this.stores.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                });
            };
        });
    }

    async get(storeName, key) {
        if (this.isMemoryMode) {
            const encrypted = this.memoryStore[storeName].get(String(key));
            return encrypted ? decryptValue(encrypted) : null;
        }

        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const res = request.result;
                if (res && res.encryptedData) {
                    resolve({
                        id: res.id,
                        tenantId: res.tenantId,
                        ...decryptValue(res.encryptedData)
                    });
                } else {
                    resolve(res || null);
                }
            };
        });
    }

    async getAll(storeName) {
        if (this.isMemoryMode) {
            const all = [];
            this.memoryStore[storeName].forEach((val) => {
                all.push(decryptValue(val));
            });
            return all;
        }

        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const results = request.result.map(res => {
                    if (res && res.encryptedData) {
                        return {
                            id: res.id,
                            tenantId: res.tenantId,
                            ...decryptValue(res.encryptedData)
                        };
                    }
                    return res;
                });
                resolve(results);
            };
        });
    }

    async put(storeName, value) {
        if (!value || value.id === undefined) {
            throw new Error('Value must have a primary key property: "id"');
        }

        const { id, tenantId, ...sensitive } = value;
        const encryptedData = encryptValue(sensitive);

        if (this.isMemoryMode) {
            this.memoryStore[storeName].set(String(id), encryptValue(value));
            return value;
        }

        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const dataToStore = {
                id,
                tenantId: tenantId || 1,
                encryptedData
            };
            const request = store.put(dataToStore);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(value);
        });
    }

    async delete(storeName, key) {
        if (this.isMemoryMode) {
            const deleted = this.memoryStore[storeName].delete(String(key));
            return deleted;
        }

        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }

    async clear(storeName) {
        if (this.isMemoryMode) {
            this.memoryStore[storeName].clear();
            return true;
        }

        const db = await this.getDb();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(true);
        });
    }
}

export const indexedDBService = new IndexedDBService();
export default indexedDBService;
