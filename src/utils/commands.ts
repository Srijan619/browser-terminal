import { PromptInstance } from "../types";
import { useCommandPromptStore } from '../stores/globalStore';
import { useCustomizationStore } from '../stores/customizationStore';
import { SAMPLE_PEM_KEY } from "../staticMessages/examplePemKey";
import { zipDiffViewerProject } from "../staticMessages/zipDiffViewer";
import { WELCOME_MESSAGE } from "../staticMessages/welcomeMessage";
import { NEATJS_PROJECT_DESCRIPTION } from "../staticMessages/Neat";
import { marked } from "marked";

const ROOT_DIR = '~';
const COMMAND_LS = 'ls';
const COMMAND_CD = 'cd';
const COMMAND_PWD = 'pwd';
const COMMAND_CLEAR = 'clear';
const COMMAND_CAT = 'cat';
const COMMAND_TOP = 'top';
const COMMAND_HISTORY = 'history';
const COMMAND_HELP = 'help';

const AVAILABLE_DIRS = new Map();

const PROJECT_MAP = new Map();
PROJECT_MAP.set("zip-diff-viewer.md", (zipDiffViewerProject));
PROJECT_MAP.set("Neat.md", NEATJS_PROJECT_DESCRIPTION);
// Add key-value pairs
AVAILABLE_DIRS.set("bio.md", WELCOME_MESSAGE);
AVAILABLE_DIRS.set("projects", PROJECT_MAP);
AVAILABLE_DIRS.set("secret_keys.pem", SAMPLE_PEM_KEY);

const VALID_COMMANDS = [COMMAND_LS, COMMAND_CD, COMMAND_PWD, COMMAND_CLEAR, COMMAND_CAT, COMMAND_TOP, COMMAND_HELP, COMMAND_HISTORY];
const BAD_COMMAND_ERROR_MESSAGE = '&nbsp;Command not found! Type <code>help</code> to know all options.';
let PROMPT_INSTANCE: PromptInstance;

const getCommandPromptStore = () => {
    return useCommandPromptStore();
};

const getCustomizationStore = () => {
    return useCustomizationStore();
};

const formatBadCommandMessage = (command: string) => {
    let formattedMessage = (command && `<code>${command}</code>`) + BAD_COMMAND_ERROR_MESSAGE;
    return marked.parse(formattedMessage).toString();
}
// Function to check if the command is allowed
const isInputCommandAllowed = (command: string): boolean => {
    if (!command) return false;
    return VALID_COMMANDS.includes(commandPrefix(command));
};

const commandPrefix = (command: string): string => {
    return command?.split(' ')[0]?.trim();
}

const commandSuffix = (command: string): string => {
    return command?.split(' ')[1]?.trim();
}

const getCurrentDirName = (currentDir: string): string => {
    const allDirs = currentDir.split('/');
    return allDirs[allDirs.length - 1];
}

const isFile = (fileName: string): boolean => {
    // Check if the filename contains a dot, is not just a dot, and has a valid extension
    const validExtensions = ['txt', 'md', 'pem'];
    const parts = fileName.split('.');

    // If there's no dot or only one part, it cannot be a file
    if (parts.length <= 1) return false;

    // Check if the last part is a valid file extension
    const extension = parts.pop(); // Get the last part after the last dot
    if (!extension) return false;
    return validExtensions.includes(extension.toLowerCase());
};

const formatLsReply = (reply: string) => {
    const formattedReply = [] as string[];
    reply?.split(' ').forEach(r => {
        if (!isFile(r)) {
            formattedReply.push(`<span style="color: ${getCustomizationStore().TERMINAL_LS_FOLDER_COLOR};">${r}</span>`)
        } else {
            formattedReply.push(`<span style="color:${getCustomizationStore().TERMINAL_LS_FILE_COLOR};">${r}</span>`)
        }
    })
    return marked.parse(formattedReply.join(' '))
}

// Function to filter only directories (non-files) in the current directory
const getFileRecursively = (currentDirName: string, currentDirContent: any = AVAILABLE_DIRS): (string | Map<string, any>)[] => {
    if (!currentDirContent) return [];

    // Try to get the directory content directly from the map if possible
    const content = currentDirContent.get(currentDirName);

    if (content) return content;

    // If content is not found directly, recursively search within nested Maps
    for (const [, value] of currentDirContent) {
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
    PROMPT_INSTANCE.reply = marked.parse(`Need help? Try followings: <code>${VALID_COMMANDS.join(' | ')}</code>`).toString();
}

const handleLsCommand = (): void => {
    const currentDirName = getCurrentDirName(PROMPT_INSTANCE.currentDir)
    let reply = '';
    if (currentDirName && AVAILABLE_DIRS.has(currentDirName)) {
        const dirMappedString = mapDirsToString(getFileRecursively(currentDirName));
        reply = dirMappedString ? dirMappedString : '';
    } else {
        reply = Array.from(AVAILABLE_DIRS.keys()).join(' ');
    }
    PROMPT_INSTANCE.reply = formatLsReply(reply).toString();
}

const handleCdCommand = (): void => {
    const changeDir = commandSuffix(PROMPT_INSTANCE.command);
    if (!changeDir) {
        // Change to root always if nothing provided
        getCommandPromptStore().CURRENT_DIR = ROOT_DIR;
    }
    else if (!AVAILABLE_DIRS.has(changeDir)) {
        PROMPT_INSTANCE.reply = `No such directory!`
    } else {
        getCommandPromptStore().CURRENT_DIR += "/" + changeDir;
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

const handleTopCommand = () => {
    // DUMMY top command rep of os
    if (performance.memory) {
        const memoryInfo = performance.memory;

        // Convert bytes to megabytes (1 MB = 1024 * 1024 bytes)
        const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2);

        let message = '';
        message += '<strong>Memory Usage Summary:</strong><br>';
        message += 'JS Heap Size Limit: ' + bytesToMB(memoryInfo.jsHeapSizeLimit) + ' MB<br>';
        message += 'Total Allocated JS Heap Size: ' + bytesToMB(memoryInfo.totalJSHeapSize) + ' MB<br>';
        message += 'Currently Used JS Heap Size: ' + bytesToMB(memoryInfo.usedJSHeapSize) + ' MB<br>';

        PROMPT_INSTANCE.reply = marked.parse(message).toString();
    } else {
        PROMPT_INSTANCE.reply = 'Memory information is not available in this browser.';
    }
}

const handlePwdCommand = () => {
    PROMPT_INSTANCE.reply = getCommandPromptStore().CURRENT_DIR;
}

const handleHistoryCommand = () => {
    PROMPT_INSTANCE.reply = marked.parse(getCommandPromptStore().COMMAND_HISTORY.join('<br>')).toString();
}

const handleDefaultCheck = () => {
    if (!PROMPT_INSTANCE.command) {
        return; //
    }
    if (!isInputCommandAllowed(PROMPT_INSTANCE.command)) {
        PROMPT_INSTANCE.reply = formatBadCommandMessage(PROMPT_INSTANCE.command);
        return;
    }
}

const setAndSanitizePromptInstance = (promptInstance: PromptInstance) => {
    PROMPT_INSTANCE = promptInstance;
    PROMPT_INSTANCE.command = PROMPT_INSTANCE.command.trim();
}
const handleCommand = (promptInstance: PromptInstance): void => {
    setAndSanitizePromptInstance(promptInstance);
    getCommandPromptStore().COMMAND_HISTORY.push(promptInstance.command);
    switch (commandPrefix(PROMPT_INSTANCE.command)) {
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
        case COMMAND_TOP:
            handleTopCommand();
            break;
        case COMMAND_PWD:
            handlePwdCommand();
            break;
        case COMMAND_HISTORY:
            handleHistoryCommand();
            break;
        default:
            handleDefaultCheck();
            break;
    }
}

export { handleCommand }