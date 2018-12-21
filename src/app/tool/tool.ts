export function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

export function isString(val) { return typeof val === 'string'; }
