import {LANG} from "../global/constants";
import {useTypedSelector} from "../store/store";
import ZH_TW_DICT from "./zh_tw.json";
import EN_US_DICT from "./en_us.json";
/**
 * Custom hook to manage language and retrieve translated content.
 * @param {string} initialLang - Initial language
 * @returns {object} - Object containing current language, setLang function, and translate function.
 */
// Define the type for the dictionary
type TranslationDictionary = {
  [key: string]: string; // Keys are strings, and values are also strings
};
const useLang = () => {
  const l = useTypedSelector((state) =>
    state.User ? state.User.lang : LANG.EN_US
  );
  // console.log(l, LANG.ZH_TW);
  // console.log(l === LANG.ZH_TW);
  const json: TranslationDictionary =
    l === LANG.ZH_TW
      ? (ZH_TW_DICT as TranslationDictionary)
      : (EN_US_DICT as TranslationDictionary);
  // Translate function to fetch the corresponding language content

  function displayLang(text: string) {
    // ideally, we use a library to translate, and only write into dictionary for specific words
    if (!json[text]) {
      return text;
    }
    return json[text];
  }

  return displayLang;
};

export default useLang;
