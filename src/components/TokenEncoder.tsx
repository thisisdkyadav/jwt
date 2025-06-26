import { useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { SignJWT, importPKCS8 } from "jose"

const ALGORITHMS = [
  { label: "HS256 (HMAC SHA-256)", value: "HS256" },
  { label: "HS384 (HMAC SHA-384)", value: "HS384" },
  { label: "HS512 (HMAC SHA-512)", value: "HS512" },
  { label: "RS256 (RSA SHA-256)", value: "RS256" },
  { label: "ES256 (ECDSA P-256 SHA-256)", value: "ES256" },
]

const defaultHeader = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
const defaultPayload = JSON.stringify(
  {
    sub: "1234567890",
    name: "John Doe",
    iat: Math.floor(Date.now() / 1000),
  },
  null,
  2
)

type GenerateJwtArgs = {
  header: string
  payload: string
  secret: string
  alg: string
}

async function generateJwt({ header, payload, secret, alg }: GenerateJwtArgs): Promise<{ jwt?: string; error?: string }> {
  try {
    const parsedHeader = JSON.parse(header)
    const parsedPayload = JSON.parse(payload)
    let key: CryptoKey | Uint8Array
    if (alg.startsWith("HS")) {
      key = new TextEncoder().encode(secret)
    } else if (alg.startsWith("RS") || alg.startsWith("ES")) {
      key = await importPKCS8(secret, alg)
    } else {
      throw new Error("Unsupported algorithm")
    }
    const jwt = await new SignJWT(parsedPayload).setProtectedHeader(parsedHeader).sign(key)
    return { jwt }
  } catch (e) {
    let msg = "Unknown error"
    if (typeof e === "string") msg = e
    else if (e instanceof Error) msg = e.message
    return { error: msg }
  }
}

interface TokenEncoderProps {
  isDark?: boolean
}

const TokenEncoder = ({ isDark = true }: TokenEncoderProps) => {
  const [header, setHeader] = useState(defaultHeader)
  const [payload, setPayload] = useState(defaultPayload)
  const [secret, setSecret] = useState("")
  const [alg, setAlg] = useState("HS256")
  const [token, setToken] = useState("")
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    setError("")
    setToken("")
    const { jwt, error } = await generateJwt({ header, payload, secret, alg })
    if (error) setError(error)
    else setToken(jwt || "")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token)
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Header and Payload Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Header */}
          <div className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
              <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Header</h3>
            </div>
            <div className={`rounded-2xl overflow-hidden ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
              <CodeMirror value={header} height="120px" extensions={[json()]} onChange={(v: string) => setHeader(v)} theme={isDark ? "dark" : "light"} className="text-sm font-mono" />
            </div>
          </div>

          {/* Payload */}
          <div className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Payload</h3>
            </div>
            <div className={`rounded-2xl overflow-hidden ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
              <CodeMirror value={payload} height="140px" extensions={[json()]} onChange={(v: string) => setPayload(v)} theme={isDark ? "dark" : "light"} className="text-sm font-mono" />
            </div>
          </div>
        </div>

        {/* Configuration Section */}
        <div className={`rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Secret/Key Input */}
            <div className="space-y-3">
              <label className={`block font-medium text-sm tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Secret / Private Key</label>
              <input
                className={`w-full p-4 rounded-2xl font-mono text-sm 
                         focus:outline-none transition-all duration-300 focus-ring ${
                           isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"
                         }`}
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter secret or private key"
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex justify-center pt-4">
            <button
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 
                       text-white font-semibold text-lg tracking-wide
                       hover:from-sky-600 hover:to-sky-700 
                       transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={handleGenerate}
            >
              Generate JWT Token
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

        {/* Generated Token */}
        {token && (
          <div className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
                <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Generated JWT</h3>
              </div>
              <button
                className={`px-4 py-2 rounded-xl text-sm font-medium
                         transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                           isDark ? "bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50" : "bg-white/50 border border-sky-200/50 text-gray-900 hover:bg-sky-50 shadow-sm"
                         }`}
                onClick={copyToClipboard}
              >
                Copy Token
              </button>
            </div>
            <pre
              className={`rounded-2xl p-4 text-xs sm:text-sm 
                           overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed break-all ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-amber-200" : "bg-amber-50/50 border border-amber-200/50 text-amber-800 shadow-inner"}`}
            >
              {token}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenEncoder
