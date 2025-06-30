# Contributing to JWTBench

Thank you for your interest in contributing to JWTBench! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Setting up the development environment

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/jwtbench.git
cd jwtbench

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 How to Contribute

### 1. Choose an Issue

- Look at the [Issues](https://github.com/thisisdkyadav/jwtbench/issues) page
- Comment on an issue to let others know you're working on it
- For new features, please create an issue first to discuss

### 2. Create a Branch

```bash
# Create a new branch for your feature/fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

### 3. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Ensure your changes don't break existing functionality

### 4. Test Your Changes

```bash
# Run linting
npm run lint

# Build the project
npm run build

# Test locally
npm run dev
```

### 5. Commit Your Changes

```bash
# Add your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add new JWT algorithm support"
# or
git commit -m "fix: resolve token expiration display issue"
```

### 6. Push and Create Pull Request

```bash
# Push to your fork
git push origin feature/your-feature-name

# Create a Pull Request on GitHub
```

## 🎯 Types of Contributions

### 🐛 Bug Fixes

- Fix existing issues
- Improve error handling
- Resolve UI/UX problems

### ✨ New Features

- Add new JWT algorithms
- Improve existing tools
- Add new developer tools

### 📚 Documentation

- Improve README
- Add code comments
- Create tutorials

### 🎨 UI/UX Improvements

- Enhance visual design
- Improve accessibility
- Better mobile experience

### ⚡ Performance

- Optimize bundle size
- Improve loading times
- Better memory usage

## 📋 Pull Request Guidelines

### Before submitting a PR:

- [ ] Code follows the project's style guidelines
- [ ] Self-review of the code completed
- [ ] Code is commented, particularly in hard-to-understand areas
- [ ] Changes have been tested locally
- [ ] No console errors or warnings
- [ ] Build passes successfully

### PR Description should include:

- What changes were made and why
- Screenshots (for UI changes)
- Any breaking changes
- Related issue numbers

## 🔧 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling

### File Organization

```
src/
├── components/        # React components
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── styles/           # CSS and styling
```

### Component Guidelines

- One component per file
- Use descriptive names
- Include TypeScript interfaces
- Add JSDoc comments for complex components

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semi colons, etc
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintain

Examples:

```
feat(decoder): add ES512 algorithm support
fix(encoder): resolve payload validation issue
docs(readme): update installation instructions
```

## 🚫 What Not to Contribute

- Breaking changes without discussion
- Code that compromises security
- Features that require server-side processing
- Large dependencies that significantly increase bundle size

## 🛡️ Security

- All JWT processing must remain client-side
- No data should be transmitted to external servers
- Security-related changes require extra review
- Report security vulnerabilities privately

## 📞 Getting Help

- Open an issue for questions
- Join discussions in existing issues
- Contact [@thisisdkyadav](https://twitter.com/thisisdkyadav) on Twitter

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone.

### Our Standards

- Be respectful and inclusive
- Focus on what is best for the community
- Show empathy towards other community members
- Accept constructive criticism gracefully

### Enforcement

Unacceptable behavior may result in temporary or permanent ban from the project.

---

Thank you for contributing to JWTBench! 🎉
