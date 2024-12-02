const { checkNecessaryCases, checkUndefinedNull, consoleHandler } = require('./commonFunc');
const i18n = require('../i18n.config');

// Default locale and list of available languages
const defaultSelectedLangId = i18n.getLocale();
const supportedLangIds = i18n.getLocales();

/**
 * This method translates the given text into the supported languages
 * INPUT: tag of the text
 * INPUT: selected language id to translate
 * OUTPUT: translated text
 * @param incomingRequest
 * @param textTAG
 * @returns {*}
 */
exports.translateText = (incomingRequest, textTAG) => {

  // Extract from the headers the selected language
  const languageID = this.extractSelectedLang(incomingRequest);
  consoleHandler(`Selected language: ${languageID}`);

  if (checkNecessaryCases(textTAG)){
    if (checkNecessaryCases(languageID) && supportedLangIds.includes(languageID)){
      // TRANSLATE FOR THE SELECTED LANGUAGE
      return i18n.__({phrase: textTAG, locale: languageID});

    } else {
      // DEFAULT TRANSLATION (defaultSelectedLangId)
      return i18n.__({phrase: textTAG, locale: defaultSelectedLangId});
    }
  } else {
    // DEFAULT TRANSLATION (defaultSelectedLangId)
    // ENGLISH
    return i18n.__({phrase: textTAG, locale: defaultSelectedLangId});
  }
};

/**
 * This method extracts the selected language from the incoming request
 * @param incomingRequest
 * @returns {string}
 */
exports.extractSelectedLang = (incomingRequest) => {

  // Retrieve the selected language
  if (checkUndefinedNull(incomingRequest) && checkUndefinedNull(incomingRequest.headers)){
    if (checkNecessaryCases(incomingRequest.headers.lang)){
      return incomingRequest.headers.lang;
    }
  }

  // Default control - ENGLISH
  return 'en';
};

/**
 * This method translates the given text into the supported languages
 * INPUT: tag of the text
 * INPUT: selected language id to translate
 * OUTPUT: translated text
 * @param requestedLanguageCode
 * @param textTAG
 * @returns {*}
 */
exports.translateTextOnDemand = (requestedLanguageCode, textTAG) => {

  // Selected language
  const languageID = requestedLanguageCode;
  consoleHandler(`Selected language: ${languageID}`);

  if (checkNecessaryCases(textTAG)){
    if (checkNecessaryCases(languageID) && supportedLangIds.includes(languageID)){
      // TRANSLATE FOR THE SELECTED LANGUAGE
      return i18n.__({phrase: textTAG, locale: languageID});

    } else {
      // DEFAULT TRANSLATION (defaultSelectedLangId)
      return i18n.__({phrase: textTAG, locale: defaultSelectedLangId});
    }
  } else {
    // DEFAULT TRANSLATION (defaultSelectedLangId)
    // ENGLISH
    return i18n.__({phrase: textTAG, locale: defaultSelectedLangId});
  }
};
