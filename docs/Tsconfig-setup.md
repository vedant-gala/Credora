# TypeScript Configuration Setup for Credora Monorepo

## Overview

This document explains the TypeScript configuration structure in the Credora monorepo, including inheritance policies, path resolution, and guidelines for adding new configurations.

## Monorepo Structure

```
Credora/
├── tsconfig.json                 # Root-level configuration (parent)
├── backend/
│   ├── tsconfig.json            # Backend-specific configuration (child)
│   └── src/
├── web-dashboard/
│   ├── tsconfig.json            # Web dashboard configuration (child)
│   └── src/
├── shared/
│   ├── tsconfig.json            # Shared utilities configuration (child)
│   └── src/
└── mobile-app/
    ├── tsconfig.json            # Mobile app configuration (child)
    └── src/
```

## Configuration Hierarchy

### Root Level (`tsconfig.json`)
- **Purpose**: Base configuration shared across all packages
- **Location**: Project root directory
- **Scope**: Global settings, common compiler options, shared references

### Child Level (`package-name/tsconfig.json`)
- **Purpose**: Package-specific configuration
- **Location**: Individual package directories
- **Scope**: Package-specific settings, local path mappings, build outputs

## Inheritance Policy

### How Extension Works
When a child `tsconfig.json` extends from a parent:

```json
// Child tsconfig.json
{
  "extends": "../tsconfig.json",  // Path resolved relative to child location
  // ... child-specific configuration
}
```

### Inheritance Rules

#### 1. **Complete Override, No Merging**
- **Child configurations completely replace parent configurations**
- **No deep merging of objects or concatenation of arrays**
- **Last configuration wins**

#### 2. **Path Resolution Context**
- **Parent paths**: Resolved relative to parent file location
- **Child paths**: Resolved relative to child file location
- **Include/Exclude**: Always resolved relative to child location

#### 3. **Configuration Categories**

##### Compiler Options (`compilerOptions`)
- **Child overrides parent entirely**
- **No inheritance of individual options**
- **Must specify all needed options in child**

##### Include/Exclude Patterns
- **Child patterns replace parent patterns**
- **Resolved relative to child directory**
- **Use `"./src/**/*"` for local source files**

##### References
- **Child references replace parent references**
- **Paths resolved relative to child location**
- **Use for package dependencies**

## Current Configuration Examples

### Root Configuration (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"],
  "references": [
    { "path": "./backend" },
    { "path": "./web-dashboard" },
    { "path": "./shared" }
  ]
}
```

### Backend Configuration (`backend/tsconfig.json`)
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/*"]
    }
  },
  "include": ["./src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "tests",
    "**/*.test.ts"
  ]
}
```

## Path Mapping Strategy

### Root-Level Paths
- **Use for cross-package imports**
- **Resolved relative to project root**
- **Example**: `@shared/*` → `shared/src/*`

### Package-Level Paths
- **Use for local package imports**
- **Resolved relative to package directory**
- **Example**: `@/*` → `./src/*`

## Guidelines for Adding New Configurations

### When to Add to Root Level

✅ **Add to root `tsconfig.json` when:**
- Setting is needed across all packages
- Defining global compiler options
- Establishing shared build targets
- Configuring project-wide references
- Setting common TypeScript features

**Examples:**
```json
{
  "compilerOptions": {
    "target": "ES2022",           // All packages use ES2022
    "strict": true,               // All packages use strict mode
    "esModuleInterop": true       // All packages use ES module interop
  }
}
```

### When to Add to Child Level

✅ **Add to package `tsconfig.json` when:**
- Setting is specific to one package
- Configuring package-specific build outputs
- Defining local path mappings
- Setting package-specific compiler options
- Including/excluding package-specific files

**Examples:**
```json
{
  "compilerOptions": {
    "outDir": "./dist",           // Backend-specific output
    "rootDir": "./src"            // Backend-specific source root
  },
  "include": ["./src/**/*"],      // Backend-specific source files
  "paths": {
    "@/*": ["./src/*"]            // Backend-specific path mapping
  }
}
```

## Common Pitfalls and Solutions

### 1. **Include Pattern Resolution**
❌ **Wrong**: `"include": ["src/**/*"]` (resolves relative to root)
✅ **Correct**: `"include": ["./src/**/*"]` (resolves relative to package)

### 2. **Path Mapping Conflicts**
❌ **Wrong**: Mixing root and package path mappings without clear strategy
✅ **Correct**: Use root for cross-package, package for local imports

### 3. **Inheritance Misunderstanding**
❌ **Wrong**: Expecting parent options to merge with child
✅ **Correct**: Child completely overrides parent - specify all needed options

### 4. **Reference Path Resolution**
❌ **Wrong**: Using absolute paths in references
✅ **Correct**: Use relative paths from child location

## Best Practices

1. **Keep root configuration minimal** - Only include truly shared settings
2. **Use explicit relative paths** - `"./src/**/*"` instead of `"src/**/*"`
3. **Document path mapping strategy** - Make it clear what `@/*` resolves to
4. **Test inheritance behavior** - Verify child configurations work as expected
5. **Use consistent naming** - Follow established patterns across packages

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check path resolution context
   - Verify include/exclude patterns
   - Ensure paths are relative to correct location

2. **Build failures in monorepo**
   - Verify package references are correct
   - Check for circular dependencies
   - Ensure all packages can build independently

3. **Path mapping not working**
   - Verify baseUrl setting
   - Check path resolution context
   - Test with explicit relative paths

### Debug Commands

```bash
# Check TypeScript compilation without emitting
npx tsc --noEmit

# Build specific package
npm run build:backend

# Build all packages
npm run build:all

# Clean and rebuild
npm run clean && npm run build:all
```

## Summary

- **Root config**: Global, shared settings
- **Child config**: Package-specific settings
- **Inheritance**: Complete override, no merging
- **Path resolution**: Always relative to config file location
- **Strategy**: Root for cross-package, child for local

When adding new configurations, ask yourself: "Is this needed across all packages or just one specific package?" This will guide you to the correct location.
