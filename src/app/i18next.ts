import { LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { I18NEXT_SERVICE, ITranslationService } from 'angular-i18next';
import Fetch from 'i18next-fetch-backend';
//import {base64} from 'base-64';


const phraseAppProjectId = 'f82506b9c0d6116509e49c14a0f32b49';
const username = 'giobos';
const password = "hJTWI9Nf2oSwjJEJcI4t";
const translationFromPhraseApp = true;

const langToLocaleId: {[key: string]: string} = {
    en: 'd16db34bc8ec20200ddd1bd8c20f9023',
    bg: '9da59730f73cc9ae7c0bb389f44b4ed1',
    cs: '97068534068d70b2ead063701dd598fe',
    de: '7e3e37055b3433bdeef1f48d8df0df6f',
    el: '1e645750c432d696d83e342320dfee58',
    es: 'b3c13f0f28ee241cf325655453f0f5ce',
    'fr-be': '2cea526bda23b76d76f9533a993957f0',
    'fr-fr': 'b67149ba2d368fe0954ed72f2126f157',
    hr: '9f351a22ca9b9d4e55958620ed0ba3c9',
    hu: '8896c0b564b544b8672ebb0db6856f96',
    it: '01cea70e49261464b911e4c4a2970522',
    lt: '455b4b3ef75f5ae0d68636454e5c4cb5',
    'nl-be': '3acadbec8b06e4a44b66797b7f47f6a4',
    'nl-nl': '7121676698b5e32bdce8212a924229ec',
    pl: 'ff5f817ee96476b0a48f883fdc16e33a',
    pt: '32bff7d90cd12985b18ccc1dd215dd0e',
    ro: '4d8617f72a707e18f8219e90678438a9',
    ru: 'dcaedfcb7cfb409a3f5afaca44b7a2ed',
    sk: '65f95c6052045623ee737abca05e347a',
    sl: '0b91e43e697319efb75bb405a47e4350',
    tr: '4f0efea7553f40304cd3fc9cb91e9046',
};



const headers = new Headers();
if (translationFromPhraseApp) headers.append( 'Authorization', 'Basic ' + btoa(username + ':' + password)); 
headers.append('X-Requested-With', 'XMLHttpRequest');
  
  

function translationsDownloadPath (lang: string, namespaces: string[]) : string {
    const phraseAppLocaleId = langToLocaleId[lang.toLowerCase()];
    if (translationFromPhraseApp) {
        return `https://api.phraseapp.com/api/v2/projects/${phraseAppProjectId}/locales/${phraseAppLocaleId}/download?file_format=i18next`;
    } else {
        return '';
        //   const request = {
        //     language: langs[0].toLowerCase(),
        //     prefixes: languagePrefixesToLoad.join(','),
        //   };
        //   const url = '/en/homev6/labels?' + queryString(request);
        //   return url;
    }
}

export function appInit(i18next: ITranslationService) {
    return () => i18next.use(Fetch).init({
        fallbackLng: 'en',
        debug: true,
        returnEmptyString: false,

        backend: {
            //loadPath: translationsDownloadPath,
            loadPath: (lang:string) => `/assets/labels/${lang}.json`,
            requestOptions: {
              //mode: 'cors',
              credentials: 'include',
              headers,
            },
        },        
    });
}

export function localeIdFactory(i18next: ITranslationService) {
    return i18next.language;
}

export const I18N_PROVIDERS = [
    {
        provide: APP_INITIALIZER,
        useFactory: appInit,
        deps: [I18NEXT_SERVICE],
        multi: true
    },
    {
        provide: LOCALE_ID,
        deps: [I18NEXT_SERVICE],
        useFactory: localeIdFactory
    }];