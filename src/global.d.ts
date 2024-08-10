// global.d.ts
interface PerformanceMemory {
    usedJSHeapSize: number; // The amount of JavaScript heap currently allocated.
    totalJSHeapSize: number; // The total amount of JavaScript heap available.
    jsHeapSizeLimit: number; // The maximum amount of JavaScript heap available.
}

interface Performance {
    memory: PerformanceMemory; // Adding the memory property
}