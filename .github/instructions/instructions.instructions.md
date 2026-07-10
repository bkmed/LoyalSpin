---
description: Project development guidelines for React Native, Android, iOS, and CI/CD tasks
applyTo: "**/*"
---

# Project Context

This project is a cross-platform mobile application built with React Native and native Android/iOS modules.

The codebase may include:

- React Native / TypeScript / JavaScript
- Android native modules (Kotlin/Java)
- iOS native modules (Swift/Objective-C)
- Gradle build system
- CocoaPods
- CI/CD pipelines
- Git workflows

# General Coding Guidelines

- Always analyze the existing code before making changes.
- Follow existing project architecture and conventions.
- Prefer minimal, targeted changes.
- Do not rewrite working code without a clear reason.
- Preserve backward compatibility.
- Avoid introducing unnecessary dependencies.
- Keep code clean, readable, and maintainable.

# React Native Guidelines

When modifying React Native code:

- Use TypeScript when possible.
- Follow existing component patterns.
- Avoid unnecessary re-renders.
- Handle Android and iOS differences explicitly.
- Check native module compatibility before changing dependencies.
- Avoid breaking public APIs.

Before changing dependencies:

- Check compatibility with:
  - React Native version
  - Android Gradle Plugin
  - Gradle version
  - Kotlin version
  - Xcode version
  - CocoaPods version

# Android Guidelines

For Android changes:

- Respect current minSdk, compileSdk, and targetSdk.
- Consider old device compatibility.
- Avoid APIs unavailable on supported Android versions.
- Use proper lifecycle handling.
- Prefer Kotlin for new native code unless Java is already used in the module.

Before modifying Gradle:

- Inspect existing build.gradle files.
- Verify dependency compatibility.
- Avoid unnecessary Gradle upgrades.

When fixing build errors:

- Identify the root cause.
- Do not blindly update versions.
- Explain why the change is required.

# iOS Guidelines

For iOS changes:

- Keep Swift code compatible with the project's deployment target.
- Respect existing CocoaPods configuration.
- Avoid unnecessary Pod updates.
- Verify native module registration.

# Testing Guidelines

When adding or modifying features:

- Add or update tests when possible.
- Prefer meaningful tests over increasing coverage artificially.
- Test real business logic.
- Avoid tests that only verify implementation details.

# Debugging Rules

When investigating bugs:

1. Reproduce or analyze the error.
2. Identify the root cause.
3. Search the repository for related code.
4. Propose the smallest safe fix.
5. Explain possible side effects.

Do not:
- Apply random fixes.
- Change multiple unrelated files.
- Hide errors instead of fixing them.

# Git Guidelines

Before suggesting Git commands:

- Check repository state.
- Explain destructive operations.
- Prefer safe commands.

Avoid recommending:
- `git reset --hard`
- `git push --force`
- History rewriting

unless explicitly requested.

# CI/CD Guidelines

For pipelines:

- Keep workflows simple.
- Validate YAML syntax.
- Verify build commands locally.
- Ensure artifacts are generated correctly.
- Handle secrets securely.

When modifying CI:

Check:
- Node version
- Java version
- Gradle version
- Ruby/CocoaPods version
- Environment variables

# Code Review Guidelines

When reviewing changes, check:

- Correctness
- Maintainability
- Performance
- Security
- Error handling
- Testing
- Backward compatibility

Provide:
- Problem explanation
- Suggested fix
- Reasoning

# Response Style

When helping with code:

- Be concise and technical.
- Provide exact commands when useful.
- Explain important decisions.
- Mention risks and compatibility concerns.