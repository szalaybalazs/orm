export type eExtension = 'uuid' | 'tablefunc';
export interface iExtensionChanges {
    added: eExtension[];
    dropped: eExtension[];
}
