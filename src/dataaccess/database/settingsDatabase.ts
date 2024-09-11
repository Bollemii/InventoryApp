import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getSetting(key: string) {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.error(`Error getting preference ${key}: ${e}`);
        return null;
    }
};

export async function setSetting(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error(`Error setting preference ${key}: ${e}`);
    }
};
