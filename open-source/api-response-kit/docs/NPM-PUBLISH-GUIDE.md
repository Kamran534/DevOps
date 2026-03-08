# How to Publish api-response-kit on npm

> Step-by-step guide to publish your package on npm for the first time.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create an npm Account](#2-create-an-npm-account)
3. [Prepare the Package](#3-prepare-the-package)
4. [Login to npm from Terminal](#4-login-to-npm-from-terminal)
5. [Check Package Name Availability](#5-check-package-name-availability)
6. [Publish to npm](#6-publish-to-npm)
7. [Verify the Publication](#7-verify-the-publication)
8. [Publishing Updates](#8-publishing-updates)
9. [Best Practices](#9-best-practices)
10. [Troubleshooting](#10-troubleshooting)

---

## 1. Prerequisites

Before publishing, make sure you have:

- [x] Node.js >= 18 installed
- [x] npm CLI installed (comes with Node.js)
- [x] A working project with tests passing
- [x] A GitHub repository (for linking)

Verify your setup:

```bash
node --version    # Should show v18+
npm --version     # Should show 9+
```

---

## 2. Create an npm Account

### Step 1: Go to npmjs.com

Open your browser and visit:

```
https://www.npmjs.com/signup
```

### Step 2: Fill in your details

| Field | What to enter |
|-------|---------------|
| Username | Choose a unique username (e.g., `kamran534`) |
| Email | Your email address |
| Password | A strong password |

### Step 3: Verify your email

npm will send a verification email. Click the link to verify.

### Step 4: Enable 2FA (Recommended)

Go to your npm profile → **Account Settings** → **Two-Factor Authentication**

- Choose **"Authorization and Publishing"** for maximum security
- Use an authenticator app (Google Authenticator, Authy, etc.)

---

## 3. Prepare the Package

### 3.1 Review package.json

Make sure these fields are correctly set:

```json
{
  "name": "api-response-kit",
  "version": "1.0.0",
  "description": "Standardize your Node.js API responses with a consistent format",
  "main": "dist/src/index.js",
  "types": "dist/src/index.d.ts",
  "license": "MIT",
  "author": "Kamran534",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Kamran534/DevOps.git"
  },
  "keywords": ["api", "response", "express", "nestjs", "fastify", "rest", "standardize", "typescript"],
  "files": ["dist", "adapters"]
}
```

**Important fields explained:**

| Field | Purpose |
|-------|---------|
| `name` | The package name on npm (must be unique) |
| `version` | Semantic version (major.minor.patch) |
| `main` | Entry point for `require()` |
| `types` | Entry point for TypeScript types |
| `files` | What gets included when someone installs your package |
| `keywords` | Helps people find your package via search |
| `license` | Must match the LICENSE file |

### 3.2 Set up the `files` field

The `files` field controls what gets published. Only include what users need:

```json
{
  "files": [
    "dist",
    "adapters"
  ]
}
```

This **excludes** tests, examples, source TypeScript, etc. — keeping the package small.

### 3.3 Add a .npmignore file (optional)

Create `.npmignore` to explicitly exclude files:

```
src/
tests/
examples/
docs/
coverage/
.github/
*.test.ts
jest.config.ts
.eslintrc.json
.prettierrc
tsconfig.json
```

> Note: If `files` is set in package.json, npm uses that instead of `.npmignore`.

### 3.4 Build the project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 3.5 Test the build

```bash
npm test
```

Make sure **all 27 tests pass** before publishing.

### 3.6 Preview what will be published

```bash
npm pack --dry-run
```

This shows exactly which files will be included in the package. Review the list:

```
npm notice Tarball Contents
npm notice 1.2kB  dist/src/index.js
npm notice 0.8kB  dist/src/success.js
npm notice 0.6kB  dist/src/error.js
npm notice 0.5kB  dist/src/validation.js
npm notice 0.7kB  dist/src/pagination.js
npm notice 1.0kB  dist/src/interfaces.js
npm notice ...
npm notice 2.5kB  package.json
npm notice 4.2kB  README.md
```

---

## 4. Login to npm from Terminal

### Step 1: Run npm login

```bash
npm login
```

### Step 2: Enter credentials

```
Username: kamran534
Password: ********
Email: your-email@example.com
```

### Step 3: Enter 2FA code (if enabled)

```
Enter one-time password from your authenticator app: 123456
```

### Step 4: Verify login

```bash
npm whoami
```

Should output: `kamran534`

---

## 5. Check Package Name Availability

Before publishing, check if the name is taken:

```bash
npm search api-response-kit
```

Or visit: `https://www.npmjs.com/package/api-response-kit`

### If the name is taken:

Options:

1. **Scoped package** (recommended):
   ```json
   { "name": "@kamran534/api-response-kit" }
   ```

2. **Different name**:
   ```json
   { "name": "api-response-standardizer" }
   ```

### Scoped package notes:

- Scoped packages are free on npm
- Format: `@username/package-name`
- To publish a scoped package as **public** (free):
  ```bash
  npm publish --access public
  ```

---

## 6. Publish to npm

### Step 1: Make sure everything is ready

```bash
# Build
npm run build

# Test
npm test

# Preview package contents
npm pack --dry-run
```

### Step 2: Publish

**For unscoped package:**

```bash
npm publish
```

**For scoped package (@username/package):**

```bash
npm publish --access public
```

### Step 3: Enter 2FA code if prompted

```
Enter OTP: 123456
```

### Expected output:

```
npm notice
npm notice api-response-kit@1.0.0
npm notice === Tarball Contents ===
npm notice 1.2kB dist/src/index.js
npm notice ...
npm notice === Tarball Details ===
npm notice name:          api-response-kit
npm notice version:       1.0.0
npm notice filename:      api-response-kit-1.0.0.tgz
npm notice package size:  3.5 kB
npm notice total files:   12
npm notice
+ api-response-kit@1.0.0
```

---

## 7. Verify the Publication

### 7.1 Check on npmjs.com

Visit: `https://www.npmjs.com/package/api-response-kit`

You should see:
- Package name and description
- README rendered
- Install command
- Version info

### 7.2 Test installation in a new project

```bash
mkdir test-install && cd test-install
npm init -y
npm install api-response-kit
```

### 7.3 Test the import

Create `test.js`:

```javascript
const { success, error, paginated } = require("api-response-kit")
console.log("Import successful!")
console.log("Available functions:", { success, error, paginated })
```

```bash
node test.js
```

### 7.4 Clean up

```bash
cd ..
rm -rf test-install
```

---

## 8. Publishing Updates

### 8.1 Semantic Versioning (SemVer)

| Version Bump | When to use | Command |
|-------------|-------------|---------|
| **Patch** (1.0.0 → 1.0.1) | Bug fixes, no API changes | `npm version patch` |
| **Minor** (1.0.0 → 1.1.0) | New features, backwards compatible | `npm version minor` |
| **Major** (1.0.0 → 2.0.0) | Breaking changes | `npm version major` |

### 8.2 Steps to publish an update

```bash
# 1. Make your changes
# 2. Run tests
npm test

# 3. Build
npm run build

# 4. Bump version (choose one)
npm version patch    # Bug fix
npm version minor    # New feature
npm version major    # Breaking change

# 5. Publish
npm publish

# 6. Push the version tag to GitHub
git push --tags
git push
```

### 8.3 Example: Adding a new feature

```bash
# After adding the feature and writing tests
npm test                    # All tests pass
npm run build               # Build succeeds
npm version minor           # 1.0.0 → 1.1.0 (auto-creates git tag)
npm publish                 # Publish to npm
git push && git push --tags # Push to GitHub
```

---

## 9. Best Practices

### 9.1 Before every publish

```bash
# Checklist
npm test                 # All tests pass?
npm run build            # Build succeeds?
npm pack --dry-run       # Correct files included?
npm audit                # No security vulnerabilities?
```

### 9.2 Add prepublishOnly script

Already set in your `package.json`:

```json
{
  "scripts": {
    "prepublishOnly": "npm run build"
  }
}
```

This automatically runs `npm run build` before every `npm publish`.

### 9.3 Add a CHANGELOG

Create `CHANGELOG.md` to track changes:

```markdown
# Changelog

## [1.0.0] - 2026-03-08

### Added
- Core response builders: success, created, noContent, error, notFound, unauthorized, forbidden
- Validation error handler with field-level errors
- Pagination support with auto-calculated metadata
- Express middleware adapter
- Fastify plugin adapter
- NestJS interceptor adapter
- Full TypeScript support with generics
- 27 unit tests
```

### 9.4 Badge in README

Add npm badges to your README:

```markdown
[![npm version](https://img.shields.io/npm/v/api-response-kit.svg)](https://npmjs.com/package/api-response-kit)
[![npm downloads](https://img.shields.io/npm/dm/api-response-kit.svg)](https://npmjs.com/package/api-response-kit)
```

### 9.5 GitHub Release

After publishing, create a GitHub release:

```bash
gh release create v1.0.0 --title "v1.0.0" --notes "Initial release of api-response-kit"
```

---

## 10. Troubleshooting

### "Package name too similar to existing package"

Use a scoped name:

```json
{ "name": "@kamran534/api-response-kit" }
```

```bash
npm publish --access public
```

### "You must be logged in to publish"

```bash
npm login
npm whoami  # Verify you're logged in
```

### "Cannot publish over previously published version"

You cannot overwrite a published version. Bump the version:

```bash
npm version patch
npm publish
```

### "403 Forbidden — You do not have permission"

- Make sure you're logged in: `npm whoami`
- Make sure the package name isn't taken
- For scoped packages, add `--access public`

### "Missing main entry point"

Build first:

```bash
npm run build
ls dist/src/index.js  # Should exist
```

### "ERR! 402 Payment Required"

Scoped packages are private by default (requires paid npm plan). Publish as public:

```bash
npm publish --access public
```

---

## Quick Reference: Full Publish Workflow

```bash
# First time
npm login                        # Login to npm
npm test                         # Run tests
npm run build                    # Build TypeScript
npm pack --dry-run               # Preview contents
npm publish                      # Publish!

# Updates
npm test                         # Run tests
npm run build                    # Build
npm version patch|minor|major    # Bump version
npm publish                      # Publish update
git push && git push --tags      # Push to GitHub
```
