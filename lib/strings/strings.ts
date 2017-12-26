import { colorStrings, ColorStringKey } from './colorStrings';
import { dialogStrings, DialogStringKey } from './dialogStrings';
import { ribbonButtonStrings, RibbonButtonStringKey } from './ribbonButtonStrings';

export type Strings = { [key: string]: string };

let defaultStrings: Strings = {};

// When adding new localized string types, please register your strings set below
let registeredStringSet = [
    colorStrings,
    dialogStrings,
    ribbonButtonStrings,
];

// When adding new localized string types, please register your string keys below
export type RegisteredStrings = 
    ColorStringKey |
    DialogStringKey |
    RibbonButtonStringKey;

export function getString(
    key: RegisteredStrings,
    strings?: Strings): string {
    let str = (strings || {})[key];
    if (str == null) {
        str = defaultStrings[key];
    }
    return str;
}

registeredStringSet.forEach(strings => {
    Object.keys(strings).forEach(key => {
        if (defaultStrings[key]) {
            throw new Error(`Found duplicated string key: ${key}`);
        }
        defaultStrings[key] = strings[key];
    });
});