import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Helper to update a deep value in an object by path string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function updateNestedValue(obj: any, path: string, value: any): any {
    const newObj = JSON.parse(JSON.stringify(obj));
    const keys = path.split('.');
    let current = newObj;

    for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    return newObj;
}
