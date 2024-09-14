interface Options {
    context: string;
    sources: string[];
    destination: string;
}
declare const _default: (options: Partial<Options>) => {
    name: string;
    setup(build: any): void;
};
export default _default;
