# Contributing to Quantum Computing Simulator

Thank you for your interest in contributing to the Quantum Computing Simulator project! This document provides guidelines and instructions to help you contribute effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Familiarity with React, TypeScript, and Git
- Basic understanding of quantum computing concepts (helpful but not required for all contributions)

### Setting Up the Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/quantum-computing-simulator.git
   cd quantum-computing-simulator
   ```
3. Add the original repository as upstream:
   ```bash
   git remote add upstream https://github.com/Nouridin/quantum-computing-simulator.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

The application should now be running at `http://localhost:5173`.

## Development Workflow

1. Create a new branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-you-are-fixing
   ```

2. Make your changes, following our [coding standards](#coding-standards)

3. Write or update tests as necessary

4. Run tests locally to ensure they pass:
   ```bash
   npm test
   ```

5. Run linting checks:
   ```bash
   npm run lint
   ```

6. Commit your changes with a descriptive commit message:
   ```bash
   git commit -m "Add feature: detailed description of your changes"
   ```

7. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

8. Create a pull request from your fork to the main repository

## Pull Request Process

1. Ensure your PR addresses a specific issue. If an issue doesn't exist, create one first.
2. Fill out the PR template completely.
3. Make sure all tests pass and there are no linting errors.
4. Add or update documentation as needed.
5. Include screenshots or GIFs for UI changes.
6. Your PR needs approval from at least one maintainer before it can be merged.
7. Once approved, a maintainer will merge your PR.

### PR Review Criteria

Pull requests are evaluated based on:

- Code quality and adherence to our coding standards
- Test coverage
- Performance considerations (especially for quantum simulation code)
- Documentation quality
- User experience (for UI changes)

## Coding Standards

### General Guidelines

- Write clean, readable, and maintainable code
- Follow the Single Responsibility Principle
- Keep functions small and focused
- Use meaningful names for variables, functions, and components
- Add comments for complex algorithms or non-obvious code

### TypeScript

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type unless absolutely necessary
- Use type inference where it makes code more readable

### React

- Use functional components and hooks
- Keep components small and reusable
- Follow React best practices for performance optimization
- Use Jotai for state management consistently

### Quantum Computing Code

- Include references to papers or resources for implemented algorithms
- Add detailed comments explaining quantum concepts
- Ensure numerical stability in quantum operations
- Optimize for performance where possible

### Formatting and Linting

The project uses ESLint and Prettier. Ensure your code follows these standards:

```bash
# Format code
npm run format

# Check linting
npm run lint
```

## Testing

We use Jest, Vitest, and Cypress for testing. All new code should include appropriate tests:

- **Unit tests** for utility functions and small components
- **Integration tests** for component interactions
- **E2E tests** for critical user flows

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e
```

### Test Coverage

Aim for high test coverage, especially for core quantum simulation functionality.

## Documentation

Good documentation is crucial for this project due to the complex nature of quantum computing:

- Add JSDoc comments to functions and classes
- Update README.md when adding new features
- Document public APIs thoroughly
- Include examples of usage
- For quantum algorithms, include a brief explanation of the algorithm and references

### Educational Content

When contributing educational content:

- Ensure accuracy of quantum computing explanations
- Include references to academic papers or textbooks
- Make explanations accessible to different audience levels (beginner to advanced)
- Consider adding diagrams or visualizations for complex concepts

## Issue Reporting

### Bug Reports

When reporting bugs, please include:

- Detailed description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser and OS information
- Console errors if any

### Feature Requests

Feature requests are welcome. Please include:

- Clear description of the feature
- Use cases and benefits
- Any relevant research or references
- Mockups or diagrams if applicable

## Feature Requests

We welcome feature requests! When proposing new features:

1. First check existing issues to avoid duplicates
2. Clearly describe the feature and its benefits
3. Explain how it fits into the project's goals
4. If possible, outline a technical approach for implementation
5. Consider offering to implement the feature yourself

## Community

Join our community:

- Star the project on GitHub
- Join discussions in Issues and Pull Requests
- Help answer questions from other contributors
- Share the project with others interested in quantum computing

## Quantum Computing Resources

If you're new to quantum computing, these resources might help:

- [Quantum Computing for Computer Scientists](https://www.cambridge.org/core/books/quantum-computing-for-computer-scientists/8AEA723BEE5CC9F5C03FDD4BA850C711)
- [Qiskit Textbook](https://qiskit.org/textbook)
- [Quantum Country](https://quantum.country/)
- [Microsoft's Quantum Development Kit Documentation](https://docs.microsoft.com/en-us/quantum/)

Thank you for contributing to the Quantum Computing Simulator project!
