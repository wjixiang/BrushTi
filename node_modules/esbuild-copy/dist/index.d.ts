import { Plugin } from 'esbuild';
interface Options {
    context: string;
    destination: string;
    sources: Array<string>;
}
declare const _default: (options: Options) => Plugin;
export default _default;
