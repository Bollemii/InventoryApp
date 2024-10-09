import AsyncStorage from "@react-native-async-storage/async-storage";

import { log } from "@/logger";

/**
 * Get a setting
 * 
 * @param key The key of the setting
 * @returns A promise that resolves to the setting
 */
export async function getSetting(key: string) {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        log.error(`Error getting preference ${key}: ${e} (SettingDatabase::getSetting)`);
        throw e;
    }
}

/**
 * Set a setting
 * 
 * @param key The key of the setting
 * @param value The value of the setting
 */
export async function setSetting(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        log.error(`Error setting preference ${key}: ${e} (SettingDatabase::setSetting)`);
        throw e;
    }
}
