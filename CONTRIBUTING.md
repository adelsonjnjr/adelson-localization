# Contributing to Adelson Localization

First off, thank you for considering contributing to Adelson Localization! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (React version, browser, OS)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed feature**
- **Examples of how the feature would be used**
- **Why this enhancement would be useful**

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

#### Pull Request Guidelines

- **Write clear commit messages**
- **Update documentation** if you're changing functionality
- **Add tests** if you're adding new features
- **Follow the existing code style**
- **Keep pull requests focused** on a single feature or bug fix

### Code Style

- Use TypeScript for all new code
- Follow the existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

### Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/adelson-localization.git
cd adelson-localization

# Install dependencies
npm install

# Build the project
npm run build

# Run in watch mode during development
npm run dev

# Run tests
npm test
```

### Adding New Languages

To add support for a new language:

1. Add the plural rules in `src/useLanguage.ts` in the `lnPlural` function
2. Update the documentation to include the new language
3. Add example translation files
4. Update the README with the new language support

Example:
```typescript
// Add to lnPlural function
else if (language.key === "de") { // German
  pluralKey = count === 1 ? `${key}.singular` : `${key}.plural`;
}
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Test with different React versions if possible

### Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/)
- Add JSDoc comments for new functions
- Include code examples for new features

## Community

- Be respectful and considerate
- Welcome newcomers and encourage diverse contributions
- Give constructive feedback

## Questions?

Feel free to open an issue with the label `question` if you have any questions about contributing.

Thank you for your contributions! 🙏

---

**Jean Junior Adelson**
