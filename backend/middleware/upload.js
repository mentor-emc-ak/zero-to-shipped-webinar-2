import multer from "multer";

// Memory storage: the PDF is extracted in-process and never written to disk.
const upload = multer({ storage: multer.memoryStorage() });

export default upload;
