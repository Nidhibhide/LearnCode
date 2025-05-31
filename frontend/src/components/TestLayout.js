export const GetEditorLang = (lang) => {
  if (lang === "C++" || lang === "C") return "cpp";
  if (lang === "Java") return "java";
  if (lang === "Python") return "python";
  if (lang === "JavaScript") return "javascript";
  return "cpp";
};

export const CalculateCode = (value) => {
  if (value === "C++") return "54";
  else if (value === "C") return "50";
  else if (value === "Java") return "91";
  else if (value === "Python") return "100";
  else if (value === "JavaScript") return "97";
  else return null; // or a default fallback ID
};

export const getComment = (lang) => {
  if (lang === "Python") return "# Write your code here";
  if (
    lang === "Javascript" ||
    lang === "Java" ||
    lang === "C" ||
    lang === "C++"
  )
    return "// Write your code here";
  return "// Write your code here"; // fallback
};
