# Security Policy

## 🛡️ Security Commitment

JWTBench is designed with security as a top priority. All JWT processing happens client-side in your browser, ensuring that sensitive tokens never leave your device.

## 🔒 Security Features

### Client-Side Processing

- **No Server Communication**: All JWT operations happen in your browser
- **Zero Data Transmission**: Your tokens are never sent to any external servers
- **Local Storage Only**: No persistent storage of sensitive data
- **Memory Cleanup**: Sensitive data is cleared from memory after use

### Technical Security Measures

- **Content Security Policy (CSP)**: Strict CSP headers prevent XSS attacks
- **HTTPS Only**: All connections are encrypted in transit
- **Security Headers**: Comprehensive security headers implementation
- **No Analytics Tracking**: No user behavior tracking or data collection
- **Open Source**: Fully auditable codebase

### Cryptographic Security

- **Industry Standard Library**: Uses the `jose` library (RFC 7519 compliant)
- **Secure Random Generation**: Cryptographically secure key generation
- **Proper Algorithm Implementation**: Follows JWT/JOSE specifications
- **No Deprecated Algorithms**: Only secure, modern algorithms supported

## 🚨 Reporting Security Vulnerabilities

We take security vulnerabilities seriously. If you discover a security issue, please follow these guidelines:

### ✅ What to Report

- Authentication/authorization bypasses
- Cross-site scripting (XSS) vulnerabilities
- Cryptographic implementation flaws
- Client-side code injection vulnerabilities
- Any issue that could compromise user data

### 📧 How to Report

**Please do NOT create a public GitHub issue for security vulnerabilities.**

Instead, please report security vulnerabilities via:

- **Email**: thisisdkyadav@gmail.com
- **Subject**: [SECURITY] JWTBench Vulnerability Report
- **Include**: Detailed description, reproduction steps, and potential impact

### ⏱️ Response Timeline

- **Initial Response**: Within 24 hours
- **Confirmation**: Within 72 hours
- **Resolution**: Within 30 days (depending on severity)
- **Public Disclosure**: After fix is deployed and tested

### 🎯 Severity Guidelines

#### Critical (Immediate Response Required)

- Remote code execution
- Authentication bypass
- Cryptographic key exposure
- Mass data exposure

#### High (Response Within 24 Hours)

- Cross-site scripting (XSS)
- Privilege escalation
- Sensitive data exposure
- Cryptographic flaws

#### Medium (Response Within 72 Hours)

- Information disclosure
- Denial of service
- Configuration issues
- Input validation flaws

#### Low (Response Within 1 Week)

- Minor information leaks
- UI/UX security improvements
- Documentation security issues

## 🔐 Best Practices for Users

### When Using JWTBench

- **Use HTTPS**: Always access JWTBench via HTTPS
- **Clear Browser Data**: Clear sensitive data from browser after use
- **Private Windows**: Use incognito/private browsing for sensitive work
- **Verify URL**: Ensure you're using the official https://jwt.andiindia.in
- **Update Browser**: Use an up-to-date browser with security patches

### JWT Security Best Practices

- **Strong Secrets**: Use cryptographically strong HMAC secrets
- **Short Expiration**: Set appropriate token expiration times
- **Secure Storage**: Store tokens securely in your applications
- **Algorithm Selection**: Choose appropriate algorithms for your use case
- **Validate Claims**: Always validate JWT claims in your applications

## 🚫 Out of Scope

The following are generally considered out of scope for security reports:

- Issues affecting only outdated browsers
- Social engineering attacks
- Physical security issues
- Denial of service attacks requiring excessive resources
- Issues with third-party dependencies (report to upstream)
- Missing security headers (unless demonstrable impact)

## 📜 Security Changelog

### Current Version (1.0.0)

- Initial security implementation
- Client-side processing architecture
- Comprehensive security headers
- CSP implementation
- Secure key generation

### Future Security Enhancements

- Subresource Integrity (SRI) for all assets
- Enhanced CSP policies
- Additional security monitoring
- Regular security audits

## 🏆 Security Recognition

We appreciate security researchers who help keep JWTBench secure. Responsible disclosure of security vulnerabilities will be acknowledged in:

- Security advisory (if applicable)
- Public thanks (with permission)
- Contribution recognition

## 📞 Contact Information

For security-related inquiries:

- **Security Email**: thisisdkyadav@gmail.com
- **General Contact**: [@thisisdkyadav](https://twitter.com/thisisdkyadav)
- **Project**: https://github.com/thisisdkyadav/jwtbench

---

## 🔗 Additional Resources

- [JWT Security Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [JOSE Working Group](https://datatracker.ietf.org/wg/jose/about/)

Thank you for helping keep JWTBench secure! 🛡️
