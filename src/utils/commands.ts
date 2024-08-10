import { PromptInstance } from "../types";
import { marked } from 'marked';
import { useCommandPromptStore } from '../stores/globalStore';
import { SAMPLE_PEM_KEY } from "./example_pem_key";
import { zipDiffViewerProject } from "../projects/zipDiffViewer";

const ROOT_DIR = '~';
let CURRENT_DIR = ROOT_DIR;
const COMMAND_LS = 'ls';
const COMMAND_CD = 'cd';
const COMMAND_PWD = 'pwd';
const COMMAND_CLEAR = 'clear';
const COMMAND_CAT = 'cat';
const COMMAND_HELP = 'help';

const AVAILABLE_DIRS = new Map();

const PROJECT_MAP = new Map();
PROJECT_MAP.set("zip-diff-viewer.md", marked.parse(zipDiffViewerProject));
PROJECT_MAP.set("project2.md", "Project 2 was fairly complex")
// Add key-value pairs
AVAILABLE_DIRS.set("bio.md", "Hello srijan here! Welcome to my world!");
AVAILABLE_DIRS.set("projects", PROJECT_MAP);
AVAILABLE_DIRS.set("secret_keys.pem", SAMPLE_PEM_KEY);

const VALID_COMMANDS = [COMMAND_LS, COMMAND_CD, COMMAND_PWD, COMMAND_CLEAR, COMMAND_CAT, COMMAND_HELP];
const BAD_COMMAND_ERROR_MESSAGE = 'Command not found!';
let PROMPT_INSTANCE: PromptInstance;

const getCommandPromptStore = () => {
    return useCommandPromptStore();
};

// Function to check if the command is allowed
const isInputCommandAllowed = (command: string): boolean => {
    if (!command) return false;
    return VALID_COMMANDS.includes(commandPrefix(command));
};

const commandPrefix = (command: string): string => {
    return command?.split(' ')[0];
}

const commandSuffix = (command: string): string => {
    return command?.split(' ')[1];
}

const getCurrentDirName = (currentDir: string): string => {
    const allDirs = currentDir.split('/');
    return allDirs[allDirs.length - 1];
}

const isFile = (fileName: string): boolean => {
    // Check if the filename contains a dot, is not just a dot, and has a valid extension
    const validExtensions = ['txt', 'md'];
    const parts = fileName.split('.');

    // If there's no dot or only one part, it cannot be a file
    if (parts.length <= 1) return false;

    // Check if the last part is a valid file extension
    const extension = parts.pop(); // Get the last part after the last dot
    if (!extension) return false;
    return validExtensions.includes(extension.toLowerCase());
};

// Function to filter only directories (non-files) in the current directory
const getFileRecursively = (currentDirName: string, currentDirContent: any = AVAILABLE_DIRS): (string | Map<string, any>)[] => {
    if (!currentDirContent) return [];

    // Try to get the directory content directly from the map if possible
    const content = currentDirContent.get(currentDirName);

    if (content) return content;

    // If content is not found directly, recursively search within nested Maps
    for (const [key, value] of currentDirContent) {
        if (value instanceof Map) {
            const result = getFileRecursively(currentDirName, value);
            if (result) {
                return result; // Return the result immediately if found
            }
        }
    }

    // If not found anywhere, return an empty string
    return [];
};


const mapDirsToString = (content: (string | Map<string, any>)[]) => {
    if (content) {
        return Array.from(content as (string | Map<string, any>)[])
            .flatMap((item: string | Map<string, any>) => {
                // If the item is a string (file or directory)
                if (typeof item === 'string') {
                    return isFile(item) ? item : []; // Return the item if it's a file
                } else if (Array.isArray(item)) {
                    // If it's an array (assuming this is a nested structure), filter its contents
                    return item.filter(nestedItem => typeof nestedItem === 'string' && isFile(nestedItem));
                } else if (item instanceof Map) {
                    // Handle the case where the item is a nested Map
                    return Array.from(item.keys()).filter(nestedKey => isFile(nestedKey));
                }
                return [];
            })
            .join(' ');
    }
}


const handleClearCommand = (): void => {
    getCommandPromptStore().PROMPT_INSTANCES = [];
}

const handleHelpCommand = (): void => {
    PROMPT_INSTANCE.reply = `Need help? Try followings: ${VALID_COMMANDS.join(' | ')}`
}

const handleLsCommand = (): void => {
    const currentDirName = getCurrentDirName(PROMPT_INSTANCE.currentDir)
    if (currentDirName && AVAILABLE_DIRS.has(currentDirName)) {
        const dirMappedString = mapDirsToString(getFileRecursively(currentDirName));
        PROMPT_INSTANCE.reply = dirMappedString ? dirMappedString : '';
    } else {
        PROMPT_INSTANCE.reply = Array.from(AVAILABLE_DIRS.keys()).join(' ');
    }
}

const handleCdCommand = (): void => {
    const changeDir = commandSuffix(PROMPT_INSTANCE.command);
    if (!changeDir) {
        // Change to root always if nothing provided
        CURRENT_DIR = ROOT_DIR;
    }
    else if (!AVAILABLE_DIRS.has(changeDir)) {
        PROMPT_INSTANCE.reply = `No such directory!`
    } else {
        CURRENT_DIR += "/" + changeDir;
    }
}

const handleCatCommand = () => {
    const file = commandSuffix(PROMPT_INSTANCE.command);
    if (!file) {
        PROMPT_INSTANCE.reply = "Please provide file name to view!"
    }
    else if (!isFile(file)) {
        PROMPT_INSTANCE.reply = "Not a file!"
    }
    else if (getFileRecursively(file)) {
        const fileContent = getFileRecursively(file);
        PROMPT_INSTANCE.reply = fileContent.toString();
    }
    else {
        PROMPT_INSTANCE.reply = `No such file: ${file}`
    }
}

const handleCommand = (promptInstance: PromptInstance): void => {
    if (!isInputCommandAllowed(promptInstance.command)) {
        promptInstance.reply = BAD_COMMAND_ERROR_MESSAGE;
        return;
    }
    PROMPT_INSTANCE = promptInstance
    switch (commandPrefix(promptInstance.command)) {
        case COMMAND_CLEAR:
            handleClearCommand();
            break;
        case COMMAND_HELP:
            handleHelpCommand();
            break;
        case COMMAND_LS:
            handleLsCommand();
            break;
        case COMMAND_CD:
            handleCdCommand();
            break;
        case COMMAND_CAT:
            handleCatCommand();
            break;
    }
}

export { handleCommand, CURRENT_DIR }