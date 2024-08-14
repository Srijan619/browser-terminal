import { defineStore } from 'pinia';
import { watch, ref } from 'vue';

import { SAMPLE_PEM_KEY } from "../staticMessages/examplePemKey";
import { zipDiffViewerProject } from "../staticMessages/zipDiffViewer";
import { WELCOME_MESSAGE } from "../staticMessages/welcomeMessage";
import { NEATJS_PROJECT_DESCRIPTION } from "../staticMessages/Neat";

export const useFilesStore = defineStore('filesStore', () => {
    const AVAILABLE_DIRS = ref(new Map<string, any>([
        ["bio.md", WELCOME_MESSAGE],
        ["projects", new Map([
            ["zip-diff-viewer.md", zipDiffViewerProject],
            ["Neat.md", NEATJS_PROJECT_DESCRIPTION]
        ])],
        ["secret_keys.pem", SAMPLE_PEM_KEY]
    ]));

    const mapToObject = (map: Map<string, any>) => {
        const obj: any = {};
        map.forEach((value, key) => {
            if (value instanceof Map) {
                obj[key] = mapToObject(value); // Recursively handle nested maps
            } else {
                obj[key] = value;
            }
        });
        return obj;
    };

    const objectToMap = (obj: any) => {
        const map = new Map<string, any>();
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && !(obj[key] instanceof Array)) {
                map.set(key, objectToMap(obj[key])); // Recursively handle nested objects
            } else {
                map.set(key, obj[key]);
            }
        }
        return map;
    };

    const update = (data: any) => {
        AVAILABLE_DIRS.value = objectToMap(data);
        saveToLocalStorage();
    };

    const asJson = () => {
        return mapToObject(AVAILABLE_DIRS.value);
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('BROWSER_TERMINAL_FILES', JSON.stringify(asJson()));
    };

    const initFromLocalStorage = () => {
        const storedTerminalFiles = localStorage.getItem('BROWSER_TERMINAL_FILES');
        if (storedTerminalFiles) {
            const data = JSON.parse(storedTerminalFiles);
            update(data);
        } else {
            saveToLocalStorage(); // Save the default settings to localStorage
        }
    };

    const findMapAtPath = (path?: string[]): Map<string, any> | undefined => {
        let currentMap = AVAILABLE_DIRS.value;
        if (!path) return currentMap; // current dir if no path defined
        for (const segment of path) {
            const nextMap = currentMap.get(segment);
            if (nextMap instanceof Map) {
                currentMap = nextMap;
            } else {
                return currentMap; // Invalid path
            }
        }
        return currentMap;
    };

    const getFile = (fileName: string, path?: string[]): string => {
        const map = findMapAtPath(path);

        if (map && map.has(fileName)) {
            const file = map.get(fileName);
            // Check if the file is indeed a string or any expected content type
            return typeof file === 'string' ? file : '';
        }
        return ''; // Return an empty string if the file is not found or the map is empty
    };

    const saveFile = (fileName: string, content: string, path?: string[]): void => {
        findMapAtPath(path)?.set(fileName, content);
    }

    const addFile = (fileName: string, content: any = "", path?: string[]) => {
        const parentMap = findMapAtPath(path);
        if (parentMap) {
            parentMap.set(fileName, content);
            saveToLocalStorage();
        }
    };

    const addFolder = (folderName: string, path?: string[]) => {
        const parentMap = findMapAtPath(path);
        if (parentMap) {
            parentMap.set(folderName, new Map());
            saveToLocalStorage();
        }
    };

    watch(
        () => asJson(),
        () => {
            saveToLocalStorage();
        },
        { deep: true }
    );

    initFromLocalStorage();

    return {
        AVAILABLE_DIRS,
        addFile,
        addFolder,
        getFile,
        saveFile
    };
});
