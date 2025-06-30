# 🚀 JWTBench - Professional JWT Developer Tool

[![Live Demo](https://img.shields.io/badge/🌐-Live%20Demo-blue?style=for-the-badge)](https://jwt.andiindia.in)
[![GitHub](https://img.shields.io/badge/GitHub-thisisdkyadav-black?style=for-the-badge&logo=github)](https://github.com/thisisdkyadav)
[![Twitter](https://img.shields.io/badge/Twitter-@thisisdkyadav-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/thisisdkyadav)

> The most comprehensive JWT (JSON Web Token) decoder, encoder, and verification tool for developers. All processing happens client-side for maximum security.

## ✨ Features

### 🔍 **JWT Decoder**

- **Instant Decoding**: Paste any JWT token and see decoded header and payload
- **Auto-Detection**: Automatically detects algorithm from JWT header
- **Signature Verification**: Verify HMAC and RSA signatures
- **Expiration Check**: Real-time token validity and expiration status
- **Pretty JSON**: Formatted, syntax-highlighted JSON output

### 🔧 **JWT Encoder**

- **Token Generation**: Create JWT tokens with custom claims
- **Multiple Algorithms**: Support for HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512
- **Auto-Updates**: Real-time token generation as you type
- **Custom Payloads**: Add any claims you need
- **Copy to Clipboard**: One-click copying of generated tokens

### 🔒 **Security Analysis**

- **Secret Strength Checker**: Analyze HMAC secret strength and entropy
- **Vulnerability Detection**: Identify weak secrets and common issues
- **Security Recommendations**: Get actionable security advice
- **Entropy Calculation**: Detailed entropy analysis

### 🔑 **Key Generator**

- **Cryptographic Keys**: Generate secure HMAC secrets and RSA key pairs
- **Multiple Formats**: Support for various key formats and sizes
- **Secure Generation**: Cryptographically secure random generation
- **Export Options**: Easy copying and downloading of keys

### 📊 **Lifetime Visualizer**

- **Token Timeline**: Visual representation of token validity periods
- **Expiration Warnings**: Clear indicators for expired or soon-to-expire tokens
- **Validity Periods**: `iat`, `exp`, and `nbf` claim visualization
- **Time Zone Support**: Local time zone handling

## 🛡️ Security Features

- **🔐 Client-Side Processing**: All operations happen in your browser
- **🚫 No Data Transmission**: Tokens never leave your device
- **🔒 Zero Server Storage**: No logs, no tracking, no data retention
- **🛡️ Security Headers**: Comprehensive security headers implementation
- **🔍 Source Code**: Open source and auditable

## 🚀 Live Demo

Visit **[jwt.andiindia.in](https://jwt.andiindia.in)** to use JWTBench right now!

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript
- **Styling**: TailwindCSS 4.0
- **JWT Library**: jose (industry standard)
- **Build Tool**: Vite 7.0

## 📱 Supported Algorithms

| Algorithm | Type  | Description                     |
| --------- | ----- | ------------------------------- |
| HS256     | HMAC  | HMAC using SHA-256              |
| HS384     | HMAC  | HMAC using SHA-384              |
| HS512     | HMAC  | HMAC using SHA-512              |
| RS256     | RSA   | RSASSA-PKCS1-v1_5 using SHA-256 |
| RS384     | RSA   | RSASSA-PKCS1-v1_5 using SHA-384 |
| RS512     | RSA   | RSASSA-PKCS1-v1_5 using SHA-512 |
| ES256     | ECDSA | ECDSA using P-256 and SHA-256   |
| ES384     | ECDSA | ECDSA using P-384 and SHA-384   |
| ES512     | ECDSA | ECDSA using P-521 and SHA-512   |

## 🏃‍♂️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/thisisdkyadav/jwtbench.git
cd jwtbench

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌟 Why JWTBench?

### **🚄 Fast & Modern**

- Instant processing with no server delays
- Modern React 19 with cutting-edge performance
- Optimized bundle size and loading times

### **🎨 Developer-Friendly UX**

- Clean, intuitive interface designed for developers
- Dark/light mode support
- Keyboard shortcuts and accessibility features
- Mobile-responsive design

### **🔒 Security-First**

- All processing happens client-side
- No data transmission to external servers
- Comprehensive security headers
- Open source for transparency

### **⚡ Feature-Rich**

- 5 powerful tools in one application
- Support for all major JWT algorithms
- Real-time processing and validation
- Export and sharing capabilities

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Guidelines

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [RFC 7519](https://tools.ietf.org/html/rfc7519) - JSON Web Token specification
- [JOSE Working Group](https://datatracker.ietf.org/wg/jose/about/) - JSON Object Signing and Encryption
- [jose](https://github.com/panva/jose) - JavaScript library for JWTs
- [React](https://reactjs.org/) - UI library
- [TailwindCSS](https://tailwindcss.com/) - CSS framework

## 📞 Contact & Support

- **Developer**: [@thisisdkyadav](https://twitter.com/thisisdkyadav)
- **Website**: [jwt.andiindia.in](https://jwt.andiindia.in)
- **GitHub**: [@thisisdkyadav](https://github.com/thisisdkyadav)
- **Email**: thisisdkyadav@gmail.com

---

<div align="center">

**Built with ❤️ by [Devesh Yadav](https://github.com/thisisdkyadav)**

[![GitHub stars](https://img.shields.io/github/stars/thisisdkyadav/jwtbench?style=social)](https://github.com/thisisdkyadav/jwtbench)
[![Twitter Follow](https://img.shields.io/twitter/follow/thisisdkyadav?style=social)](https://twitter.com/thisisdkyadav)

</div>
