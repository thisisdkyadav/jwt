import { useState, useMemo, useEffect } from "react"
import { base64url, jwtVerify, importSPKI, decodeJwt } from "jose"
import { toast } from "sonner"
import { Copy, Trash2, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

const ALGORITHMS = [
  { label: "HS256 (HMAC SHA-256)", value: "HS256" },
  { label: "HS384 (HMAC SHA-384)", value: "HS384" },
  { label: "HS512 (HMAC SHA-512)", value: "HS512" },
  { label: "RS256 (RSA SHA-256)", value: "RS256" },
  { label: "ES256 (ECDSA P-256 SHA-256)", value: "ES256" },
]

function parseJwtPart(part: string) {
  try {
    const bytes = base64url.decode(part)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json)
  } catch {
    return null
  }
}

function formatTimestamp(ts?: number) {
  if (!ts) return "-"
  try {
    return new Date(ts * 1000).toLocaleString()
  } catch {
    return "Invalid"
  }
}

async function verifyJwt({ jwt, key, alg }: { jwt: string; key: string; alg: string }) {
  try {
    let cryptoKey: CryptoKey | Uint8Array
    if (alg.startsWith("HS")) {
      cryptoKey = new TextEncoder().encode(key)
    } else if (alg.startsWith("RS") || alg.startsWith("ES")) {
      cryptoKey = await importSPKI(key, alg)
    } else {
      throw new Error("Unsupported algorithm")
    }
    await jwtVerify(jwt, cryptoKey, { algorithms: [alg] })
    return { valid: true, reason: "Signature valid" }
  } catch (error) {
    let msg = "Unknown error"
    if (typeof error === "string") msg = error
    else if (error instanceof Error) msg = error.message
    return { valid: false, reason: msg }
  }
}

function checkTokenExpiration(jwt: string) {
  try {
    const decoded = decodeJwt(jwt)
    const now = Math.floor(Date.now() / 1000)

    if (decoded.exp && decoded.exp < now) {
      return { status: "expired", message: "Token has expired" }
    }

    if (decoded.nbf && decoded.nbf > now) {
      return { status: "notyet", message: "Token not yet valid" }
    }

    return { status: "valid", message: "Token is within validity period" }
  } catch {
    return { status: "invalid", message: "Could not decode token" }
  }
}

interface TokenDecoderProps {
  isDark?: boolean
}

const TokenDecoder = ({ isDark = true }: TokenDecoderProps) => {
  const [jwt, setJwt] = useState("")
  const [key, setKey] = useState("")
  const [alg, setAlg] = useState("HS256")
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; reason: string } | null>(null)
  const [expirationStatus, setExpirationStatus] = useState<{ status: string; message: string } | null>(null)
  const [verificationError, setVerificationError] = useState("")

  const { header, payload, error } = useMemo(() => {
    if (!jwt) return { header: null, payload: null, error: "" }
    const parts = jwt.split(".")
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        error: "JWT must have 3 parts (header.payload.signature)",
      }
    }
    const header = parseJwtPart(parts[0])
    const payload = parseJwtPart(parts[1])
    return { header, payload, error: "" }
  }, [jwt])

  // Auto-detect algorithm from JWT header
  useEffect(() => {
    if (header?.alg && ALGORITHMS.find((a) => a.value === header.alg)) {
      setAlg(header.alg)
    }
  }, [header])

  // Auto-verify when both JWT and key are present
  useEffect(() => {
    if (jwt && key && !error) {
      const timer = setTimeout(() => {
        handleVerify()
      }, 300) // Small delay to avoid excessive API calls while typing
      return () => clearTimeout(timer)
    } else {
      setVerificationResult(null)
      setVerificationError("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, key, alg])

  useEffect(() => {
    if (jwt) {
      setExpirationStatus(checkTokenExpiration(jwt))
    } else {
      setExpirationStatus(null)
    }
  }, [jwt])

  const handleVerify = async () => {
    if (!jwt || !key) return

    setVerificationError("")
    setVerificationResult(null)

    try {
      const result = await verifyJwt({ jwt, key, alg })
      setVerificationResult(result)
    } catch {
      setVerificationError("An unexpected error occurred during verification")
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const clearAll = () => {
    setJwt("")
    setKey("")
    setVerificationResult(null)
    setVerificationError("")
    toast.info("All fields cleared")
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    setJwt(pastedText.trim())
  }

  return (
    <div className="w-full h-full">
      <div className="w-full space-y-4">
        {/* Main Layout - Side by side on wide screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-0">
          {/* Left Panel - Input & Verification */}
          <div className="space-y-4">
            {/* JWT Input Section */}
            <div className={`rounded-xl p-4 sm:p-6 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
                  <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>JWT Token</h3>
                </div>
                <div className="flex items-center gap-2">
                  {expirationStatus && (
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1
                      ${
                        expirationStatus.status === "valid"
                          ? isDark
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : "bg-green-100 text-green-700 border border-green-200"
                          : expirationStatus.status === "expired"
                          ? isDark
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-red-100 text-red-700 border border-red-200"
                          : isDark
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {expirationStatus.status === "valid" && <CheckCircle size={12} />}
                      {expirationStatus.status === "expired" && <XCircle size={12} />}
                      {expirationStatus.status === "notyet" && <Clock size={12} />}
                      {expirationStatus.status === "invalid" && <AlertCircle size={12} />}
                      <span>{expirationStatus.status === "valid" ? "Valid" : expirationStatus.status === "expired" ? "Expired" : expirationStatus.status === "notyet" ? "Not Yet Valid" : "Invalid"}</span>
                    </div>
                  )}
                  <button
                    onClick={() => copyToClipboard(jwt, "JWT")}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                    aria-label="Copy JWT to clipboard"
                    disabled={!jwt}
                  >
                    <Copy size={14} />
                  </button>
                  <button onClick={clearAll} className={`p-1.5 rounded-lg transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`} aria-label="Clear all fields">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <textarea
                className={`w-full p-3 sm:p-4 rounded-lg font-mono text-sm 
                         focus:outline-none transition-all duration-300 resize-none
                         min-h-[100px] sm:min-h-[120px] focus-ring ${
                           isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"
                         }`}
                value={jwt}
                onChange={(e) => setJwt(e.target.value.trim())}
                onPaste={handlePaste}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
              />
              {error && <div className={`mt-3 p-3 rounded-lg border font-medium ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>{error}</div>}
            </div>

            {/* Verification Section */}
            <div className={`rounded-xl p-4 sm:p-6 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Signature Verification</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Secret/Key Input */}
                <div className="space-y-2">
                  <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Secret / Public Key</label>
                  <input
                    className={`w-full p-3 rounded-lg font-mono text-sm 
                             focus:outline-none transition-all duration-300 focus-ring ${
                               isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"
                             }`}
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter secret or public key"
                  />
                </div>

                {/* Algorithm Selection */}
                <div className="space-y-2">
                  <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Algorithm {header?.alg && <span className="text-xs opacity-60">(auto-detected)</span>}</label>
                  <select
                    className={`w-full p-3 rounded-lg text-sm focus:outline-none transition-all duration-300 focus-ring ${
                      isDark ? "bg-slate-700/50 border border-slate-600/50 text-white focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 focus:border-sky-500 shadow-inner"
                    }`}
                    value={alg}
                    onChange={(e) => setAlg(e.target.value)}
                  >
                    {ALGORITHMS.map((a) => (
                      <option key={a.value} value={a.value} className={isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Verification Results */}
              {verificationError && (
                <div className={`rounded-lg p-3 border transition-all duration-300 ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>
                  <div className="flex items-center gap-2">
                    <XCircle size={16} />
                    <span className="font-medium text-sm">{verificationError}</span>
                  </div>
                </div>
              )}

              {verificationResult && (
                <div
                  className={`rounded-lg p-3 border transition-all duration-300 ${
                    verificationResult.valid ? (isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700") : isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {verificationResult.valid ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    <span className="font-medium text-sm">{verificationResult.valid ? "Signature Valid" : `Invalid: ${verificationResult.reason}`}</span>
                  </div>
                </div>
              )}

              {!jwt && (
                <div className={`rounded-lg p-4 border-2 border-dashed text-center ${isDark ? "border-slate-600 text-gray-400" : "border-gray-300 text-gray-500"}`}>
                  <div className="text-sm">Enter a JWT token above to verify its signature</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Decoded Results */}
          <div className="space-y-4">
            {/* Header */}
            <div className={`rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
                  <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Header</h3>
                </div>
                {header && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(header, null, 2), "Header")}
                    className={`p-1.5 rounded-md transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                    aria-label="Copy header to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
              <div
                className={`rounded-lg p-3 text-xs sm:text-sm overflow-x-auto 
                             whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-sky-200" : "bg-sky-50/50 border border-sky-200/50 text-sky-800 shadow-inner"}`}
              >
                {header ? JSON.stringify(header, null, 2) : <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Paste a JWT token to see the decoded header</div>}
              </div>
            </div>

            {/* Payload */}
            <div className={`rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                  <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Payload</h3>
                </div>
                {payload && (
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(payload, null, 2), "Payload")}
                    className={`p-1.5 rounded-md transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                    aria-label="Copy payload to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
              <div
                className={`rounded-lg p-3 text-xs sm:text-sm overflow-x-auto 
                             whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-emerald-200" : "bg-emerald-50/50 border border-emerald-200/50 text-emerald-800 shadow-inner"}`}
              >
                {payload ? JSON.stringify(payload, null, 2) : <div className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Paste a JWT token to see the decoded payload</div>}
              </div>

              {/* Timestamps */}
              {payload && (
                <div className="grid grid-cols-1 gap-2 mt-3 text-xs">
                  {payload.exp && (
                    <div className={`rounded-lg p-2 flex justify-between items-center ${isDark ? "bg-slate-700/30 border border-slate-600/30" : "bg-white/50 border border-sky-200/30 shadow-sm"}`}>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Expires:</span>
                      <span className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{formatTimestamp(payload.exp)}</span>
                    </div>
                  )}
                  {payload.iat && (
                    <div className={`rounded-lg p-2 flex justify-between items-center ${isDark ? "bg-slate-700/30 border border-slate-600/30" : "bg-white/50 border border-sky-200/30 shadow-sm"}`}>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Issued:</span>
                      <span className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{formatTimestamp(payload.iat)}</span>
                    </div>
                  )}
                  {payload.nbf && (
                    <div className={`rounded-lg p-2 flex justify-between items-center ${isDark ? "bg-slate-700/30 border border-slate-600/30" : "bg-white/50 border border-sky-200/30 shadow-sm"}`}>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Not Before:</span>
                      <span className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{formatTimestamp(payload.nbf)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenDecoder
