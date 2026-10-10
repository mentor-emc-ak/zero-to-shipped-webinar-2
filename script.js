/* 0→shipped resume parser — mocked parsing, real file handling.
   Nothing leaves the browser: the file is read locally with FileReader. */

const SKILLS = [
  "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "SQL",
  "PostgreSQL", "MongoDB", "Docker", "Kubernetes", "AWS", "Git", "CI/CD",
  "HTML", "CSS", "GraphQL", "Redis", "Terraform", "Linux",
];

// Simple PDF text extraction: pull text out of uncompressed content streams
// and even out of compressed streams where the string literals survive.
function extractPdfText(arrayBuffer) {
  let raw = "";
  try {
    raw = new TextDecoder("latin1").decode(arrayBuffer);
  } catch {
    return "";
  }
  const matches = raw.match(/\((?:\\.|[^\\()])*\)/g);
  if (!matches) return "";
  return matches
    .map((m) => m.slice(1, -1).replace(/\\([()\\])/g, "$1"))
    .join(" ");
}

// Small, deterministic hash so the same resume always gets the same score.
function hashString(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function computeResult(fileName, text) {
  const haystack = text.toLowerCase();
  const present = [];
  const missing = [];

  for (const skill of SKILLS) {
    // Word-boundary-ish match so "java" doesn't match "javascript"
    const pattern = new RegExp(
      `\\b${skill.toLowerCase().replace(/[.+]/g, "\\$&")}\\b`
    );
    if (pattern.test(haystack)) present.push(skill);
    else missing.push(skill);
  }

  const detected = present.length;
  const score = Math.min(95, 15 + detected * 6);
  const verdict =
    score >= 70 ? "Strong match 🎯"
    : score >= 40 ? "Decent base — add the missing skills"
    : "Needs work — most target skills are absent";

  return { fileName, score, present, missing, verdict };
}

const uploadCard = document.getElementById("upload-card");
const resultCard = document.getElementById("result-card");
const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("file-input");
const errorEl = document.getElementById("error");
const stepsEl = document.getElementById("steps");
const steps = [...stepsEl.querySelectorAll(".step")];
const resetBtn = document.getElementById("reset-btn");

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.hidden = false;
}

function resetUi() {
  errorEl.hidden = true;
  stepsEl.hidden = true;
  uploadCard.hidden = false;
  resultCard.hidden = true;
  steps.forEach((s) => s.classList.remove("active", "done"));
  fileInput.value = "";
}

function animateSteps(done) {
  return new Promise((resolve) => {
    let i = 0;
    const tick = () => {
      if (i > 0) steps[i - 1].classList.replace("active", "done");
      if (i >= steps.length) return resolve();
      steps[i].classList.add("active");
      i++;
      setTimeout(tick, 700);
    };
    tick();
  });
}

function showResult(result) {
  document.getElementById("score-value").textContent = result.score;
  document.getElementById("score-ring").style.setProperty("--p", result.score);
  document.getElementById("verdict").textContent = result.verdict;
  document.getElementById("file-name").textContent = result.fileName;

  const presentUl = document.getElementById("present-skills");
  const missingUl = document.getElementById("missing-skills");
  presentUl.innerHTML = "";
  missingUl.innerHTML = "";

  if (result.present.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No target skills found";
    presentUl.appendChild(li);
  } else {
    result.present.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      presentUl.appendChild(li);
    });
  }

  if (result.missing.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "All target skills present 🎉";
    missingUl.appendChild(li);
  } else {
    result.missing.forEach((skill) => {
      const li = document.createElement("li");
      li.textContent = skill;
      missingUl.appendChild(li);
    });
  }

  uploadCard.hidden = true;
  resultCard.hidden = false;
}

async function handleFile(file) {
  errorEl.hidden = true;

  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showError("File is larger than ~5 MB. Please choose a smaller PDF.");
    return;
  }
  if (!file.name.toLowerCase().endsWith(".pdf")) {
    showError("That doesn't look like a PDF. Please choose a .pdf file.");
    return;
  }

  stepsEl.hidden = false;
  await animateSteps();

  const buffer = await file.arrayBuffer();
  const text = extractPdfText(buffer);
  const result = computeResult(file.name, text);
  showResult(result);
}

dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fileInput.click();
  }
});
fileInput.addEventListener("change", () => {
  handleFile(fileInput.files[0]);
});

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  })
);
dropzone.addEventListener("drop", (e) => {
  handleFile(e.dataTransfer.files[0]);
});

resetBtn.addEventListener("click", resetUi);
