import { copyFile, mkdir, writeFile } from 'fs/promises'
import { dirname, resolve } from 'path'

import { Plugin, PluginBuild } from 'esbuild'

import glob from 'tiny-glob';

interface Options {
    context: string,
    destination: string,
    sources: Array<string>
}

const NAMESPACE = 'esbuild-copy';
const CONFIG: Options = {
    context: './',
    destination: './',
    sources: []
}

export default (options: Options): Plugin => {
    Object.assign(CONFIG, options);

    return {
        name: NAMESPACE,
        async setup({onStart, onEnd, initialOptions}: PluginBuild)
        {
            const outdir = resolve(initialOptions.outdir || '', CONFIG.destination)
            await copy(CONFIG.context, outdir)
        }
    }
}

const collect = async (dir: string) => {
    const files = await Promise.all(
        CONFIG.sources.map(source =>
            glob(source, {cwd: dir, filesOnly: true})
        )
    )

    return files.flat()
}

const copy = async (from: string, to: string) => {
    const files = await collect(from)
    const copied: Array<string> = []

    for (const file of files)
    {
        const src = resolve(from, file)
        const dest = resolve(to, file)

        await mkdir(dirname(dest), { recursive: true })
        copyFile(src, dest)
            .then(() => {
                copied.push(file)
            })
    }

    return copied
}
