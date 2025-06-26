import { useState } from "react"
import { jwtVerify, importSPKI } from "jose"

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

interface SignatureVerifierProps {
  isDark?: boolean
}

const SignatureVerifier = ({ isDark = true }: SignatureVerifierProps) => {
  const [jwt, setJwt] = useState("")
  const [key, setKey] = useState("")
  const [alg, setAlg] = useState("HS256")
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleVerify = async () => {
    setError("")
    setResult(null)
    if (!jwt || !key) {
      setError("JWT and key are required")
      return
    }
    const { valid, reason } = await verifyJwt({ jwt, key, alg })
    setResult(valid ? `Valid: ${reason}` : `Invalid: ${reason}`)
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* JWT Input */}
        <div className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
            <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>JWT Token</h3>
          </div>
          <textarea
            className={`w-full p-4 sm:p-5 rounded-2xl font-mono text-sm sm:text-base 
                     focus:outline-none transition-all duration-300 resize-none
                     min-h-[100px] sm:min-h-[120px] focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
            rows={3}
            value={jwt}
            onChange={(e) => setJwt(e.target.value.trim())}
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
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={handleVerify}
            >
              Verify Signature
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`rounded-3xl p-6 border transition-all duration-300 ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div
            className={`rounded-3xl p-6 border transition-all duration-300 ${
              result.startsWith("Valid") ? (isDark ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-700") : isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${result.startsWith("Valid") ? "bg-emerald-400" : "bg-red-400"}`}></div>
              <span className="font-medium">{result}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignatureVerifier
