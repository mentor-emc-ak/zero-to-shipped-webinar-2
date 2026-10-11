/* File validation — all scoring now happens in the backend. */

export function validateFile(file) {
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    return "That doesn't look like a PDF. Please choose a .pdf file.";
  }
  if (file.size > 5 * 1024 * 1024) {
    return "File is larger than ~5 MB. Please choose a smaller PDF.";
  }
  return null;
}
