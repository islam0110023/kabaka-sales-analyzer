// Storage Manager for Sindbad Sales Analyzer
// Handles saving/loading settings in localStorage with instant wipe capability

const STORAGE_KEY = 'sindbad_analyzer_settings';

export const defaultSettings = {
    loginUrl: 'https://siindbad.com/sys/app/login.php',
    reportUrl: 'https://siindbad.com/sys/app/rep_sales_det.php',
    username: '',
    password: '',
    submitValue: 'تسجيل الدخول',
    startDate: '',
    endDate: '',
    cutoffHour: 6, // 06:00 AM
    rememberCredentials: false,
    autoAnalyzeOnLoad: true,
    theme: 'light'
};

export const StorageManager = {
    load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return { ...defaultSettings };
            const parsed = JSON.parse(raw);
            return { ...defaultSettings, ...parsed };
        } catch (e) {
            console.error('Error loading settings from localStorage:', e);
            return { ...defaultSettings };
        }
    },

    save(settings) {
        try {
            const current = this.load();
            const toSave = { ...current, ...settings };
            if (!toSave.rememberCredentials) {
                toSave.username = '';
                toSave.password = '';
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
            return true;
        } catch (e) {
            console.error('Error saving settings to localStorage:', e);
            return false;
        }
    },

    clearCredentials() {
        try {
            const settings = this.load();
            settings.username = '';
            settings.password = '';
            settings.rememberCredentials = false;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            return true;
        } catch (e) {
            return false;
        }
    },

    wipeAll() {
        try {
            localStorage.removeItem(STORAGE_KEY);
            return true;
        } catch (e) {
            return false;
        }
    }
};
