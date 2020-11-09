import AsyncStorage from "@react-native-community/async-storage";

/**
 * This class represents a Persistent/Stored/Saved map
 * with String keys ang boolean values.
 * A user can store boolean preferences.
 * for e.g. UserPreferences.enable("DailyUpdates") or
 * UserPreferences.disable("MulticoloredBackground")
 * The users preferences are saved as a JSON string.
 * The api provided in react-native to retrieve and store data
 * locally is async.
 */
export class UserPreferences {

    static preferenceEnabledOrDisabled = {};
    static preferenceKey = '@PreferenceEnabledOrDisabled';
    static ENABLED = 1;
    static DISABLED = 0;
    static initialized = false;

    /**
     * load the Preferences string.
     * Should happen only once in an app session.
     * The check UserPreferences.initialized? is done in the caller methods to avoid
     * calling this async method.
     */
    static async init() {
        let preferenceFromStorage = await AsyncStorage.getItem(UserPreferences.preferenceKey);
        if(preferenceFromStorage != null)
            UserPreferences.preferenceEnabledOrDisabled = JSON.parse(preferenceFromStorage);
        UserPreferences.initialized = true;
    }

    static async saveUserPreference() {
        await AsyncStorage.setItem(UserPreferences.preferenceKey,
            JSON.stringify(UserPreferences.preferenceEnabledOrDisabled));
    }

    static async enable(preferenceItem) {
        if(!UserPreferences.initialized)
            await UserPreferences.init();
        UserPreferences.preferenceEnabledOrDisabled[preferenceItem] = UserPreferences.ENABLED;
        await UserPreferences.saveUserPreference();
    }

    static async disable(preferenceItem) {
        if(!UserPreferences.initialized)
            await UserPreferences.init();
        UserPreferences.preferenceEnabledOrDisabled[preferenceItem] = UserPreferences.DISABLED;
        await UserPreferences.saveUserPreference();
    }

    static async isEnabled(preferenceItem)  {
        if(!UserPreferences.initialized)
            await UserPreferences.init();
        let status = UserPreferences.preferenceEnabledOrDisabled[preferenceItem];
        return status != null && status == UserPreferences.ENABLED;
    }

    static async isDisabled(preferenceItem)  {
        if(!UserPreferences.initialized)
            await UserPreferences.init();
        let status = UserPreferences.preferenceEnabledOrDisabled[preferenceItem];
        return status != null && status == UserPreferences.DISABLED;
    }

    static async clear() {
        await AsyncStorage.setItem(UserPreferences.preferenceKey, JSON.stringify({}));
        UserPreferences.preferenceEnabledOrDisabled = {};
    }
}

