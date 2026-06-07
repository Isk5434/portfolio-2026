import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function assertIncludes(file, text, label = text) {
  if (!read(file).includes(text)) {
    fail(`${file}: missing ${label}`);
  }
}

const requiredHeaders = [
  "Strict-Transport-Security",
  "Content-Security-Policy",
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Cross-Origin-Opener-Policy",
  "Cross-Origin-Resource-Policy",
];

const requiredCspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
];

for (const file of ["public/_headers", "vercel.json", "next.config.ts"]) {
  if (!exists(file)) fail(`${file}: file is required`);
}

if (exists("next.config.ts")) {
  assertIncludes("next.config.ts", "poweredByHeader: false", "poweredByHeader: false");
  assertIncludes("next.config.ts", 'output: "export"', 'output: "export"');
}

if (exists("public/_headers")) {
  for (const header of requiredHeaders) assertIncludes("public/_headers", header);
  for (const directive of requiredCspDirectives) {
    assertIncludes("public/_headers", directive, `CSP directive ${directive}`);
  }
}

if (exists("vercel.json")) {
  const vercel = JSON.parse(read("vercel.json"));
  const flattened = JSON.stringify(vercel);
  for (const header of requiredHeaders) {
    if (!flattened.includes(header)) fail(`vercel.json: missing ${header}`);
  }
  for (const directive of requiredCspDirectives) {
    if (!flattened.includes(directive)) {
      fail(`vercel.json: missing CSP directive ${directive}`);
    }
  }
}

if (exists("out") && !exists("out/_headers")) {
  fail("out/_headers: missing. Run npm run build after editing public/_headers.");
}

const scanRoots = ["src", "next.config.ts"];
const blockedPatterns = [
  { pattern: "dangerouslySetInnerHTML", label: "dangerouslySetInnerHTML" },
  { pattern: "eval(", label: "eval(" },
  { pattern: ".innerHTML", label: ".innerHTML" },
  { pattern: "http://", label: "insecure http:// URL" },
];

function walk(entry) {
  const full = path.join(root, entry);
  if (!fs.existsSync(full)) return [];
  const stat = fs.statSync(full);
  if (stat.isFile()) return [entry];
  const files = [];
  for (const child of fs.readdirSync(full)) {
    if (child === "node_modules" || child === ".next" || child === "out") continue;
    files.push(...walk(path.join(entry, child)));
  }
  return files;
}

for (const file of scanRoots.flatMap(walk)) {
  const ext = path.extname(file).toLowerCase();
  if ([".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".woff", ".woff2"].includes(ext)) {
    continue;
  }
  const body = read(file);
  for (const item of blockedPatterns) {
    if (body.includes(item.pattern)) fail(`${file}: found ${item.label}`);
  }
  if (body.includes('target="_blank"') && !body.includes('rel="noopener noreferrer"')) {
    warn(`${file}: target="_blank" should include rel="noopener noreferrer"`);
  }
}

if (warnings.length) {
  console.log("Security warnings:");
  for (const message of warnings) console.log(`- ${message}`);
}

if (failures.length) {
  console.error("Security check failed:");
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log("Security check passed.");
