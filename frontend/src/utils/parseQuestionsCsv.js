export const MAX_IMPORT_QUESTIONS = 50;

/** Split a CSV line, respecting double-quoted fields. */
const splitCsvLine = (line) => {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells;
};

const normalizeHeader = (h) =>
  String(h || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

/**
 * Parse CSV text into question objects.
 * Required headers: questionText, expectedOutput
 * Optional: sampleInput
 */
export const parseQuestionsCsv = (text) => {
  const raw = String(text || "").replace(/^\uFEFF/, "").trim();
  if (!raw) {
    return { ok: false, error: "Your file has no questions." };
  }

  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) {
    return {
      ok: false,
      error: "Your file has no questions.",
    };
  }

  const headers = splitCsvLine(lines[0]).map(normalizeHeader);
  const qIdx = headers.indexOf("questiontext");
  const outIdx = headers.indexOf("expectedoutput");
  const inIdx = headers.indexOf("sampleinput");

  if (qIdx === -1 || outIdx === -1) {
    return {
      ok: false,
      error: "This file is missing required columns.",
    };
  }

  const questions = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const questionText = (cells[qIdx] || "").trim();
    const expectedOutput = (cells[outIdx] || "").trim();
    const sampleInput = inIdx >= 0 ? (cells[inIdx] || "").trim() : "";

    if (!questionText && !expectedOutput && !sampleInput) continue;

    if (!questionText || !expectedOutput) {
      return {
        ok: false,
        error: `Question ${questions.length + 1} is incomplete.`,
      };
    }

    questions.push({ questionText, sampleInput, expectedOutput });
  }

  if (!questions.length) {
    return { ok: false, error: "Your file has no questions." };
  }

  if (questions.length > MAX_IMPORT_QUESTIONS) {
    return {
      ok: false,
      error: `You can import up to ${MAX_IMPORT_QUESTIONS} questions.`,
    };
  }

  return { ok: true, questions };
};

export const SAMPLE_QUESTIONS_CSV = `questionText,sampleInput,expectedOutput
"Write a function that returns the sum of two numbers","2 3","5"
"Write a function that reverses a string","hello","olleh"
`;

export const downloadSampleQuestionsCsv = () => {
  const blob = new Blob([SAMPLE_QUESTIONS_CSV], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "sample-questions.csv";
  link.click();
  URL.revokeObjectURL(url);
};
