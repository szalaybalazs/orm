import { eExtension, iTables } from '../../types';
/**
 * Get extension changes between states
 * @param snapshot previous state of the database
 * @param state current state of the databse
 * @returns changes in extensions
 */
export declare const getExtensionChanges: (snapshot: iTables, state: iTables) => {
    dropped: eExtension[];
    added: eExtension[];
};
