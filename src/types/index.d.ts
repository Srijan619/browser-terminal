
// Define the PromptInstance interface
export interface PromptInstance {
    id: string;
    command: string;
    reply: string;
    currentDir: string;
    enabled: boolean;
}