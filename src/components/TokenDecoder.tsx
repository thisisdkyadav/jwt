import { useState, useMemo } from "react"
import { base64url } from "jose"

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

interface TokenDecoderProps {
  isDark?: boolean
}

const TokenDecoder = ({ isDark = true }: TokenDecoderProps) => {
  const [jwt, setJwt] = useState("")

  const { header, payload, signature, error } = useMemo(() => {
    if (!jwt) return { header: null, payload: null, signature: "", error: "" }
    const parts = jwt.split(".")
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: "",
        error: "JWT must have 3 parts (header.payload.signature)",
      }
    }
    const header = parseJwtPart(parts[0])
    const payload = parseJwtPart(parts[1])
    const signature = parts[2]
    return { header, payload, signature, error: "" }
  }, [jwt])

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6 sm:space-y-8">
        {/* Input Section */}
        <div className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <label className={`block text-lg sm:text-xl font-semibold mb-4 tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Paste your JWT token</label>
          <textarea
            className={`w-full p-4 sm:p-5 rounded-2xl font-mono text-sm sm:text-base 
                     focus:outline-none transition-all duration-300 resize-none
                     min-h-[100px] sm:min-h-[120px] ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
            value={jwt}
            onChange={(e) => setJwt(e.target.value.trim())}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          />
          {error && <div className={`mt-4 p-4 rounded-2xl border font-medium ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>{error}</div>}
        </div>

        {/* Results Section */}
        {(header || payload || signature) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Header */}
            {header && (
              <div className={`rounded-3xl p-5 sm:p-6 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
                  <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Header</h3>
                </div>
                <pre
                  className={`rounded-2xl p-4 text-xs sm:text-sm overflow-x-auto 
                               whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-sky-200" : "bg-sky-50/50 border border-sky-200/50 text-sky-800 shadow-inner"}`}
                >
                  {JSON.stringify(header, null, 2)}
                </pre>
              </div>
            )}

            {/* Payload */}
            {payload && (
              <div className={`rounded-3xl p-5 sm:p-6 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                  <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Payload</h3>
                </div>
                <pre
                  className={`rounded-2xl p-4 text-xs sm:text-sm overflow-x-auto 
                               whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-emerald-200" : "bg-emerald-50/50 border border-emerald-200/50 text-emerald-800 shadow-inner"}`}
                >
                  {JSON.stringify(payload, null, 2)}
                </pre>

                {/* Timestamps */}
                <div className="grid grid-cols-1 gap-2 mt-4 text-xs sm:text-sm">
                  {payload.exp && (
                    <div className={`rounded-xl p-3 flex justify-between items-center ${isDark ? "bg-slate-700/30 border border-slate-600/30" : "bg-white/50 border border-sky-200/30 shadow-sm"}`}>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Expires:</span>
                      <span className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{formatTimestamp(payload.exp)}</span>
                    </div>
                  )}
                  {payload.iat && (
                    <div className={`rounded-xl p-3 flex justify-between items-center ${isDark ? "bg-slate-700/30 border border-slate-600/30" : "bg-white/50 border border-sky-200/30 shadow-sm"}`}>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Issued:</span>
                      <span className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{formatTimestamp(payload.iat)}</span>
                    </div>
                  )}
                  {payload.nbf && (
                    <div className={`rounded-xl p-3 flex justify-between items-center ${isDark ? "bg-slate-700/30 border border-slate-600/30" : "bg-white/50 border border-sky-200/30 shadow-sm"}`}>
                      <span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>Not Before:</span>
                      <span className={`font-mono ${isDark ? "text-white" : "text-gray-900"}`}>{formatTimestamp(payload.nbf)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Signature */}
            {signature && (
              <div className={`rounded-3xl p-5 sm:p-6 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                  <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Signature</h3>
                </div>
                <pre
                  className={`rounded-2xl p-4 text-xs sm:text-sm overflow-x-auto 
                               whitespace-pre-wrap font-mono leading-relaxed break-all ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-purple-200" : "bg-purple-50/50 border border-purple-200/50 text-purple-800 shadow-inner"}`}
                >
                  {signature}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TokenDecoder
