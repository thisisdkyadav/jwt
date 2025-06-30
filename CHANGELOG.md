# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-30

### 🎉 Initial Release

#### Added

- **JWT Decoder**: Instant JWT token decoding and verification

  - Auto-detection of algorithm from JWT header
  - Real-time signature verification for HMAC and RSA
  - Token expiration status and validity checking
  - Pretty-printed JSON output with syntax highlighting

- **JWT Encoder**: Professional JWT token generation

  - Support for HS256, HS384, HS512, RS256, RS384, RS512, ES256, ES384, ES512
  - Real-time token generation as you type
  - Custom payload and header configuration
  - One-click copy to clipboard functionality

- **Secret Strength Checker**: HMAC secret security analysis

  - Entropy calculation and strength assessment
  - Security recommendations and best practices
  - Vulnerability detection for weak secrets
  - Real-time analysis as you type

- **Key Generator**: Cryptographic key generation tool

  - Secure HMAC secret generation
  - RSA key pair generation (2048, 3072, 4096 bit)
  - Multiple output formats (PEM, JWK)
  - Cryptographically secure random generation

- **Lifetime Visualizer**: Token validity timeline
  - Visual representation of token lifetime
  - `iat`, `exp`, and `nbf` claim visualization
  - Expiration warnings and status indicators
  - Local timezone support

#### Security Features

- **Client-side Processing**: All operations happen in browser
- **Zero Data Transmission**: No tokens sent to external servers
- **Comprehensive Security Headers**: CSP, HSTS, X-Frame-Options
- **Open Source**: Fully auditable codebase

#### Technical Features

- **Modern Stack**: React 19, TypeScript, TailwindCSS 4.0, Vite 7.0
- **Performance Optimized**: Bundle splitting, lazy loading, optimized assets
- **Accessibility**: WCAG compliant, keyboard navigation, screen reader support
- **Mobile Responsive**: Optimized for all device sizes
- **Dark/Light Mode**: User preference with system detection

#### User Experience

- **Intuitive Interface**: Clean, developer-focused design
- **Real-time Processing**: Instant feedback and validation
- **Error Handling**: Comprehensive error messages and guidance
- **Copy/Paste Support**: Easy data input and output
- **Keyboard Shortcuts**: Productivity-focused interactions

### 🛠️ Technical Details

#### Supported JWT Algorithms

- **HMAC**: HS256, HS384, HS512
- **RSA**: RS256, RS384, RS512
- **ECDSA**: ES256, ES384, ES512

#### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

#### Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: < 500KB gzipped

---

## [Upcoming] - Future Releases

### Planned Features

- **Additional Algorithms**: PS256, PS384, PS512 support
- **Batch Processing**: Multiple token operations
- **Export/Import**: Save and load configurations
- **API Mode**: CLI and programmatic access
- **Plugin System**: Extensible architecture
- **Advanced Analytics**: Token usage patterns

### Roadmap

- **v1.1.0**: Additional algorithms and batch processing
- **v1.2.0**: Export/import functionality and CLI
- **v2.0.0**: Plugin system and advanced features

---

## Security Advisories

No security vulnerabilities have been reported for this project.

If you discover a security vulnerability, please report it privately to thisisdkyadav@gmail.com.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.
