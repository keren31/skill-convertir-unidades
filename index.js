const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to the unit converter. What would you like to convert?',
            HELP_MESSAGE: 'You can ask me to convert length units, for example: convert 5 meters to feet. How can I help you?',
            GOODBYE_MESSAGE: 'Goodbye!',
            FALLBACK_MESSAGE: 'Sorry, I don\'t know about that. Please try again.',
            ERROR_MESSAGE: 'Sorry, there was a problem. Please try again.',
            CONVERT_MESSAGE: '%.2f %s is %.2f %s.',
            UNSUPPORTED_CONVERSION: 'Sorry, I can\'t convert from %s to %s.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: 'Bienvenido al conversor. ¿Qué cantidad te gustaría convertir?',
            HELP_MESSAGE: 'Puedes pedirme que convierta unidades de longitud, por ejemplo: convierte 5 metros a pies. ¿Cómo puedo ayudarte?',
            GOODBYE_MESSAGE: '¡Adiós!',
            FALLBACK_MESSAGE: 'Lo siento, no sé sobre eso. Por favor intenta de nuevo.',
            ERROR_MESSAGE: 'Lo siento, tuve problemas para hacer lo que pediste. Por favor intenta nuevamente.',
            CONVERT_MESSAGE: '%.2f %s son %.2f %s.',
            UNSUPPORTED_CONVERSION: 'Lo siento, no puedo convertir de %s a %s.'
        }
    }
};

const conversionRates = {
    'feet': {
        'inches': 12,
        'yards': 0.333333
    },
    'inches': {
        'feet': 0.0833333,
        'yards': 0.0277778
    },
    'yards': {
        'feet': 3,
        'inches': 36
    }
};

const conversionEsp = {
    'metros': {
        'centímetros': 100,
        'kilómetros': 0.001
    },
    'centímetros': {
        'metros': 0.01,
        'kilómetros': 0.00001
    },
    'kilómetros': {
        'metros': 1000,
        'centímetros': 100000
    }
};

const ConvertidorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertidorIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const { deUnidad, UnidadFinal, cantidad } = handlerInput.requestEnvelope.request.intent.slots;
        const fromUnit = deUnidad.value.toLowerCase();
        const toUnit = UnidadFinal.value.toLowerCase();
        const value = parseFloat(cantidad.value);
        
        const locale = Alexa.getLocale(handlerInput.requestEnvelope);
        const isEnglish = locale.startsWith('en');
        const conversionTable = isEnglish ? conversionRates : conversionEsp;

        let speakOutput = 'Convertidor de Keren. ';

        if (conversionTable[fromUnit] && conversionTable[fromUnit][toUnit]) {
            const convertedValue = value * conversionTable[fromUnit][toUnit];
            speakOutput += requestAttributes.t('CONVERT_MESSAGE', value, fromUnit, convertedValue, toUnit);
        } else {
            speakOutput += requestAttributes.t('UNSUPPORTED_CONVERSION', fromUnit, toUnit);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Convertidor de Keren. ' + requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Convertidor de Keren. ' + requestAttributes.t('HELP_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Convertidor de Keren. ' + requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Convertidor de Keren. ' + requestAttributes.t('FALLBACK_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = 'Convertidor de Keren. ' + requestAttributes.t('REFLECTOR_MESSAGE', intentName);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = 'Convertidor de Keren. ' + requestAttributes.t('ERROR_MESSAGE');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(requestAttributes.t('HELP_MESSAGE'))
            .getResponse();
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope), // Utiliza Alexa.getLocale para obtener el idioma de la solicitud
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertidorIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LocalizationInterceptor, LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/convertidor-unidades/v1.0')
    .lambda();