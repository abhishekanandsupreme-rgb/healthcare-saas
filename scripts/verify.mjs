import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const ROOT = path.resolve(process.cwd());
const REQUIRED_FILES = [
  "src/app/layout.tsx",
  "src/app/page.tsx",
  "src/app/about/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/pricing/page.tsx",
  "src/components/Navbar.tsx",
  "src/components/Hero.tsx",
  "src/components/FeatureGrid.tsx",
  "src/components/Pricing.tsx",
  "src/components/CTA.tsx",
  "package.json",
  "tsconfig.json",
  "next.config.js",
  "tailwind.config.ts",
];

const REQUIRED_SCRIPTS = ["dev", "build", "start", "typecheck", "test"];

let failed = false;

console.log("=== Healthcare SaaS Verification ===\n");

// 1. Check required files exist
console.log("1. Checking required files...");
for (const file of REQUIRED_FILES) {
  const fullPath = path.join(ROOT, file);
  if (!fs.existsSync(fullPath)) {
    console.error(`  MISSING: ${file}`);
    failed = true;
  } else {
    console.log(`  OK: ${file}`);
  }
}

// 2. Check package.json scripts
console.log("\n2. Checking package.json scripts...");
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
for (const script of REQUIRED_SCRIPTS) {
  if (pkg.scripts && pkg.scripts[script]) {
    console.log(`  OK: scripts.${script} = "${pkg.scripts[script]}"`);
  } else {
    console.error(`  MISSING: scripts.${script}`);
    failed = true;
  }
}

// 3. TypeScript type check
console.log("\n3. Running TypeScript type check...");
try {
  execSync("npm run typecheck", { cwd: ROOT, stdio: "pipe" });
  console.log("  OK: TypeScript compiles without errors");
} catch (e) {
  console.error("  FAILED: TypeScript errors found");
  console.error(e.stdout?.toString() || e.message);
  failed = true;
}

// 4. Next.js build check
console.log("\n4. Running Next.js build...");
try {
  execSync("npm run build", { cwd: ROOT, stdio: "pipe", timeout: 300000 });
  console.log("  OK: Next.js build succeeded");
} catch (e) {
  console.error("  FAILED: Build failed");
  console.error(e.stdout?.toString() || e.message);
  failed = true;
}

// 5. Check dev server can start (quick check of next.config)
console.log("\n5. Checking Next.js configuration...");
try {
  const nextConfig = fs.readFileSync(path.join(ROOT, "next.config.js"), "utf-8");
  console.log(`  OK: next.config.js present (${nextConfig.length} bytes)`);
} catch (e) {
  console.error("  FAILED: Could not read next.config.js");
  failed = true;
}

console.log("\n=== Verification Summary ===");
if (failed) {
  console.error("FAILED: Some checks did not pass. Review errors above.");
  process.exit(1);
} else {
  console.log("PASSED: All verification checks completed successfully.");
  process.exit(0);
}
