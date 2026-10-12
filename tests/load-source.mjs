import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import ts from 'typescript';

const loadPackage = createRequire(import.meta.url);
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixedNow = Date.parse('2026-10-11T12:00:00Z');
class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [fixedNow])); }
    static now() { return fixedNow; }
}

// No application module can reach the network or load a database client here.
// SDKs must be explicitly mocked; only the pure chart dependency is allowed.
export function loadSource(entry, { mocks = {}, globals = {}, sourceRoot = root } = {}) {
    const cache = new Map();
    function load(filename) {
        if (cache.has(filename)) return cache.get(filename).exports;
        const source = fs.readFileSync(filename, 'utf8');
        const { outputText } = ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
            fileName: filename,
        });
        const loadedModule = { exports: {} };
        cache.set(filename, loadedModule);
        function requireMock(id) {
            if (Object.hasOwn(mocks, id)) return mocks[id];
            if (id === 'iztro') return loadPackage(id);
            if (id.startsWith('@/') || id.startsWith('.')) {
                const base = id.startsWith('@/') ? path.join(sourceRoot, id.slice(2)) : path.resolve(path.dirname(filename), id);
                const resolved = ['', '.ts', '.tsx'].map(ext => base + ext).find(file => fs.existsSync(file) && fs.statSync(file).isFile());
                if (resolved) return load(resolved);
            }
            throw new Error(`Unmocked dependency blocked: ${id}`);
        }
        vm.runInNewContext(outputText, {
            module: loadedModule, exports: loadedModule.exports, require: requireMock,
            Date: FixedDate, Response, Request, ReadableStream, TextEncoder, TextDecoder,
            Buffer, crypto: globalThis.crypto, URL, Event,
            setTimeout: callback => setTimeout(callback, 0),
            process: { env: {} },
            console: { log() {}, warn() {}, error() {} },
            fetch: () => { throw new Error('Network access blocked in regression tests'); },
            ...globals,
        }, { filename });
        return loadedModule.exports;
    }
    return load(path.join(sourceRoot, entry));
}
