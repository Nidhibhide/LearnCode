import { EDITOR_LANGUAGES, LANGUAGE_IDS, COMMENT_TEMPLATES } from '../constants';

export const GetEditorLang = (lang) => {
  return EDITOR_LANGUAGES[lang] || "cpp";
};

export const CalculateCode = (value) => {
  return LANGUAGE_IDS[value] || null;
};

export const getComment = (lang) => {
  return COMMENT_TEMPLATES[lang] || "// Write your code here";
};
