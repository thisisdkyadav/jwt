import { useState, useEffect } from "react"
import { jwtVerify, importSPKI, decodeJwt } from "jose"
import { toast } from "sonner"
import { Copy, Trash2, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

const ALGORITHMS = [
  { label: "HS256 (HMAC SHA-256)", value: "HS256" },
  { label: "HS384 (HMAC SHA-384)", value: "HS384" },
  { label: "HS512 (HMAC SHA-512)", value: "HS512" },
  { label: "RS256 (RSA SHA-256)", value: "RS256" },
  { label: "ES256 (ECDSA P-256 SHA-256)", value: "ES256" },
]

async function verifyJwt({ jwt, key, alg }: { jwt: string; key: string; alg: string }) {
  try {
    let cryptoKey: CryptoKey | Uint8Array
    if (alg.startsWith("HS")) {
      cryptoKey = new TextEncoder().encode(key)
    } else if (alg.startsWith("RS") || alg.startsWith("ES")) {
      // Try to import as SPKI PEM (public key)
      cryptoKey = await importSPKI(key, alg)
    } else {
      throw new Error("Unsupported algorithm")
    }
    await jwtVerify(jwt, cryptoKey, { algorithms: [alg] })
    return { valid: true, reason: "Signature valid" }
  } catch (e) {
    let msg = "Unknown error"
    if (typeof e === "string") msg = e
    else if (e instanceof Error) msg = e.message
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
  } catch (e) {
    return { status: "invalid", message: "Could not decode token" }
  }
}

interface SignatureVerifierProps {
  isDark?: boolean
}

const SignatureVerifier = ({ isDark = true }: SignatureVerifierProps) => {
  const [jwt, setJwt] = useState("")
  const [key, setKey] = useState("")
  const [alg, setAlg] = useState("HS256")
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; reason: string } | null>(null)
  const [expirationStatus, setExpirationStatus] = useState<{ status: string; message: string } | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (jwt) {
      setExpirationStatus(checkTokenExpiration(jwt))
    } else {
      setExpirationStatus(null)
    }
  }, [jwt])

  const handleVerify = async () => {
    setError("")
    setVerificationResult(null)

    if (!jwt || !key) {
      setError("JWT and key are required")
      return
    }

    try {
      const result = await verifyJwt({ jwt, key, alg })
      setVerificationResult(result)

      if (result.valid) {
        toast.success("Signature verified successfully")
      } else {
        toast.error("Signature verification failed")
      }
    } catch (e) {
      toast.error("Verification process failed")
      setError("An unexpected error occurred during verification")
    }
  }

  const clearAll = () => {
    setJwt("")
    setKey("")
    setVerificationResult(null)
    setError("")
    toast.info("All fields cleared")
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text")
    setJwt(pastedText.trim())
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* JWT Input */}
        <div className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
              <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>JWT Token</h3>
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
                className={`p-2 rounded-xl transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                aria-label="Copy JWT to clipboard"
              >
                <Copy size={16} />
              </button>

              <button onClick={clearAll} className={`p-2 rounded-xl transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`} aria-label="Clear all fields">
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <textarea
            className={`w-full p-4 sm:p-5 rounded-2xl font-mono text-sm sm:text-base 
                     focus:outline-none transition-all duration-300 resize-none
                     min-h-[100px] sm:min-h-[120px] focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
            rows={3}
            value={jwt}
            onChange={(e) => setJwt(e.target.value.trim())}
            onPaste={handlePaste}
            placeholder="Paste JWT token here"
          />
        </div>

        {/* Configuration */}
        <div className={`rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Verification Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Secret/Key Input */}
            <div className="space-y-3">
              <label className={`block font-medium text-sm tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Secret / Public Key</label>
              <input
                className={`w-full p-4 rounded-2xl font-mono text-sm 
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
            <div className="space-y-3">
              <label className={`block font-medium text-sm tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Algorithm</label>
              <select
                className={`w-full p-4 rounded-2xl text-sm focus:outline-none transition-all duration-300 focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 focus:border-sky-500 shadow-inner"}`}
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

          {/* Verify Button */}
          <div className="flex justify-center pt-4">
            <button
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 
                       text-white font-semibold text-lg tracking-wide
                       hover:from-sky-600 hover:to-sky-700 
                       transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              onClick={handleVerify}
              disabled={!jwt || !key}
            >
              Verify Signature
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`rounded-3xl p-6 border transition-all duration-300 ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>
            <div className="flex items-center gap-3">
              <XCircle size={18} />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Result Display */}
        {verificationResult && (
          <div
            className={`rounded-3xl p-6 border transition-all duration-300 ${
              verificationResult.valid ? (isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700") : isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <div className="flex items-center gap-3">
              {verificationResult.valid ? <CheckCircle size={18} /> : <XCircle size={18} />}
              <span className="font-medium">{verificationResult.valid ? "Signature Valid" : `Invalid: ${verificationResult.reason}`}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignatureVerifier
