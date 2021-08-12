import en from './en.json';
import it from './it.json';

let language = navigator.language || navigator.userLanguage;

document.getElementsByTagName("html")[0].lang = language;

export const defaultLocale = language;

export const languages = {
  en: en,
  it: it
};