import {SETTINGS} from "../../src/common/config/settings";
import {fromHexToBase64, fromUTF8ToBase64} from "../../src/common/utils/features/utf8.to.base64";

export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)

export const inCodedAuth = fromHexToBase64(SETTINGS.ADMIN)

export const createString = (length: number) => {
    let s = ''
    for (let x = 1; x <= length; x++) {
        s += x % 10
    }
    return s
}