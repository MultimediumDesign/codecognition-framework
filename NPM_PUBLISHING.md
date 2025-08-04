# NPM Publishing Guide

## Current Status
❌ **Not yet published to NPM** - Installation via GitHub only

## When Ready to Publish

### 1. Prepare for NPM Publishing
```bash
# Ensure you're logged in to NPM
npm login

# Verify package.json is ready
npm run test  # if tests exist
npm audit fix

# Check package contents
npm pack --dry-run
```

### 2. Publish to NPM
```bash
# Publish the package
npm publish

# Or if you want to publish under a scope
npm publish --access public
```

### 3. Update Installation Instructions
After publishing, update README.md to include:

```bash
# NPM Installation (will work after publishing)
npm install -g codecognition-framework
codecognition install

# NPX Usage (will work after publishing)  
npx codecognition-framework install
```

### 4. Update Links
- Update package badges in README.md
- Update NPM link in Links section
- Update CLI references to use global `codecognition` command

## Benefits of NPM Publishing
- ✅ Easier installation (`npm install -g codecognition-framework`)
- ✅ Global CLI access (`codecognition` command available everywhere)
- ✅ Automatic updates via `npm update -g codecognition-framework`
- ✅ Better discoverability on npmjs.com
- ✅ Version management and semantic versioning
- ✅ Download statistics and community metrics

## Current Working Installation
Until NPM publishing, users can install via:

```bash
# Quick install (recommended)
curl -fsSL https://raw.githubusercontent.com/MultimediumDesign/codecognition-framework/main/install.sh | bash

# Manual installation
git clone https://github.com/MultimediumDesign/codecognition-framework.git
cd codecognition-framework
npm install
node scripts/install.js
```