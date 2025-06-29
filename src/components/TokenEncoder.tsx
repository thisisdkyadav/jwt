import { useState, useEffect } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { json } from "@codemirror/lang-json"
import { SignJWT, importPKCS8 } from "jose"
import { toast } from "sonner"
import { Copy, Trash2, Wand2 } from "lucide-react"

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
  } catch (error) {
    let msg = "Unknown error"
    if (typeof error === "string") msg = error
    else if (error instanceof Error) msg = error.message
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

  // Auto-generate token when all required fields are present
  useEffect(() => {
    if (header && payload && secret) {
      const timer = setTimeout(() => {
        handleGenerate()
      }, 500) // Debounce to avoid excessive generation while typing
      return () => clearTimeout(timer)
    } else {
      setToken("")
      setError("")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [header, payload, secret, alg])

  // Update header algorithm when alg changes
  useEffect(() => {
    try {
      const headerObj = JSON.parse(header)
      if (headerObj.alg !== alg) {
        const updatedHeader = { ...headerObj, alg }
        setHeader(JSON.stringify(updatedHeader, null, 2))
      }
    } catch {
      // Ignore parsing errors
    }
  }, [alg, header])

  const handleGenerate = async (showToasts = false) => {
    setError("")
    setToken("")
    try {
      const { jwt, error } = await generateJwt({ header, payload, secret, alg })
      if (error) {
        setError(error)
        if (showToasts) toast.error("Failed to generate token")
      } else {
        setToken(jwt || "")
        if (showToasts) toast.success("JWT token generated successfully")
      }
    } catch {
      if (showToasts) toast.error("An error occurred during token generation")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(token)
    toast.success("Token copied to clipboard")
  }

  const clearAll = () => {
    setHeader(defaultHeader)
    setPayload(defaultPayload)
    setSecret("")
    setToken("")
    setError("")
    toast.info("All fields reset to default")
  }

  return (
    <div className="w-full">
      <div className="w-full space-y-4">
        {/* Main Layout - Side by side on wide screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            {/* Header and Payload Section */}
            <div className="grid grid-cols-1 gap-4">
              {/* Header */}
              <div className={`rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
                    <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Header</h3>
                  </div>
                  <button
                    onClick={() => setHeader(defaultHeader)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                    aria-label="Reset header to default"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={`rounded-lg overflow-hidden ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <CodeMirror
                    value={header}
                    height="80px"
                    extensions={[json()]}
                    onChange={setHeader}
                    theme={isDark ? "dark" : "light"}
                    className="text-sm font-mono"
                    basicSetup={{
                      lineNumbers: false,
                      foldGutter: false,
                    }}
                  />
                </div>
              </div>

              {/* Payload */}
              <div className={`rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Payload</h3>
                  </div>
                  <button
                    onClick={() => setPayload(defaultPayload)}
                    className={`p-1.5 rounded-lg transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                    aria-label="Reset payload to default"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className={`rounded-lg overflow-hidden ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <CodeMirror
                    value={payload}
                    height="120px"
                    extensions={[json()]}
                    onChange={setPayload}
                    theme={isDark ? "dark" : "light"}
                    className="text-sm font-mono"
                    basicSetup={{
                      lineNumbers: false,
                      foldGutter: false,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Configuration & Generated Token */}
          <div className="space-y-4">
            {/* Configuration Section */}
            <div className={`rounded-xl p-4 sm:p-5 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Configuration</h3>
                </div>
                <button
                  onClick={clearAll}
                  className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-2
                    transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                  aria-label="Reset all fields"
                >
                  <Trash2 size={12} />
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Algorithm Selection */}
                <div className="space-y-2">
                  <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Algorithm</label>
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

                {/* Secret/Key Input */}
                <div className="space-y-2">
                  <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Secret / Private Key</label>
                  <textarea
                    className={`w-full p-3 rounded-lg font-mono text-sm 
                             focus:outline-none transition-all duration-300 focus-ring resize-none
                             min-h-[80px] ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
                    rows={4}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter secret or private key"
                  />
                </div>
              </div>
            </div>

            {/* Generated Token */}
            <div className={`rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
                  <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Generated JWT</h3>
                </div>
                {token && (
                  <button
                    className={`p-1.5 rounded-lg transition-all duration-200 flex items-center gap-2
                             ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                    onClick={copyToClipboard}
                    aria-label="Copy token to clipboard"
                  >
                    <Copy size={14} />
                  </button>
                )}
              </div>
              <div
                className={`rounded-lg p-3 text-xs 
                             overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed break-all min-h-[120px] ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-amber-200" : "bg-amber-50/50 border border-amber-200/50 text-amber-800 shadow-inner"}`}
              >
                {token || <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Fill in all fields above to generate a JWT token</div>}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`rounded-xl p-4 border transition-all duration-300 ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="font-medium text-sm">{error}</span>
                </div>
              </div>
            )}

            {/* Manual Generate Button (when auto-generation is not working) */}
            {!token && secret && (
              <div className="flex justify-center">
                <button
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 
                           text-white font-semibold text-sm tracking-wide
                           hover:from-sky-600 hover:to-sky-700 
                           transition-all duration-300 transform hover:scale-105 
                           shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
                           flex items-center gap-2"
                  onClick={() => handleGenerate(true)}
                >
                  <Wand2 size={16} />
                  Generate JWT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenEncoder
