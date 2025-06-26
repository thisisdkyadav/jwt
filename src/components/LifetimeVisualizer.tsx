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

function getStatus(iat?: number, nbf?: number, exp?: number) {
  const now = Math.floor(Date.now() / 1000)
  if (exp && now > exp) return "expired"
  if (nbf && now < nbf) return "not yet valid"
  if (iat && now < iat) return "not yet valid"
  return "active"
}

function formatTimestamp(ts?: number) {
  if (!ts) return "-"
  try {
    return new Date(ts * 1000).toLocaleString()
  } catch {
    return "Invalid"
  }
}

interface LifetimeVisualizerProps {
  isDark?: boolean
}

const LifetimeVisualizer = ({ isDark = true }: LifetimeVisualizerProps) => {
  const [jwt, setJwt] = useState("")
  const { payload, error } = useMemo(() => {
    if (!jwt) return { payload: null, error: "" }
    const parts = jwt.split(".")
    if (parts.length !== 3) return { payload: null, error: "JWT must have 3 parts (header.payload.signature)" }
    const payload = parseJwtPart(parts[1])
    return { payload, error: "" }
  }, [jwt])

  const iat = payload?.iat
  const nbf = payload?.nbf
  const exp = payload?.exp
  const status = getStatus(iat, nbf, exp)

  // Calculate timeline positions (simple linear, not to scale)
  const now = Math.floor(Date.now() / 1000)
  const min = Math.min(iat || now, nbf || now, now)
  const max = Math.max(exp || now, now)
  const percent = (v?: number) => (v ? Math.round(((v - min) / (max - min)) * 100) : 0)

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* JWT Input */}
        <div className={`rounded-3xl p-6 sm:p-8 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
            <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>JWT Token</h3>
          </div>
          <textarea
            className={`w-full p-4 sm:p-5 rounded-2xl font-mono text-sm sm:text-base 
                     focus:outline-none transition-all duration-300 resize-none
                     min-h-[100px] sm:min-h-[120px] focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
            rows={3}
            value={jwt}
            onChange={(e) => setJwt(e.target.value.trim())}
            placeholder="Paste JWT token to visualize its lifetime"
          />
          {error && <div className={`p-4 rounded-2xl border font-medium ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>{error}</div>}
        </div>

        {/* Timeline Visualization */}
        {payload && (
          <div className={`rounded-3xl p-6 sm:p-8 space-y-6 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
              <h3 className={`font-bold text-lg sm:text-xl tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Token Lifetime</h3>
            </div>

            {/* Status */}
            <div
              className={`rounded-2xl p-6 mb-6 ${
                status === "active"
                  ? isDark
                    ? "bg-emerald-500/10 border border-emerald-500/30"
                    : "bg-emerald-50 border border-emerald-200"
                  : status === "expired"
                  ? isDark
                    ? "bg-red-500/10 border border-red-500/30"
                    : "bg-red-50 border border-red-200"
                  : isDark
                  ? "bg-amber-500/10 border border-amber-500/30"
                  : "bg-amber-50 border border-amber-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${status === "active" ? "bg-emerald-400" : status === "expired" ? "bg-red-400" : "bg-amber-400"}`}></div>
                <span className={`font-semibold text-lg ${status === "active" ? (isDark ? "text-emerald-300" : "text-emerald-700") : status === "expired" ? (isDark ? "text-red-300" : "text-red-700") : isDark ? "text-amber-300" : "text-amber-700"}`}>
                  {status === "active" ? "Token is Active" : status === "expired" ? "Token has Expired" : "Token is Not Yet Valid"}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h4 className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Timeline Visualization</h4>
              <div className={`relative h-12 rounded-2xl flex items-center px-4 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-sky-50/50 border border-sky-200/50 shadow-inner"}`}>
                {/* Timeline points */}
                {iat && (
                  <div className="absolute transform -translate-x-1/2" style={{ left: `${percent(iat)}%` }}>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-sky-500 rounded-full mb-1"></div>
                      <div className={`text-xs font-medium ${isDark ? "text-sky-300" : "text-sky-700"}`}>IAT</div>
                    </div>
                  </div>
                )}
                {nbf && (
                  <div className="absolute transform -translate-x-1/2" style={{ left: `${percent(nbf)}%` }}>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-amber-500 rounded-full mb-1"></div>
                      <div className={`text-xs font-medium ${isDark ? "text-amber-300" : "text-amber-700"}`}>NBF</div>
                    </div>
                  </div>
                )}
                <div className="absolute transform -translate-x-1/2" style={{ left: `${percent(now)}%` }}>
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mb-1"></div>
                    <div className={`text-xs font-medium ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>NOW</div>
                  </div>
                </div>
                {exp && (
                  <div className="absolute transform -translate-x-1/2" style={{ left: `${percent(exp)}%` }}>
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mb-1"></div>
                      <div className={`text-xs font-medium ${isDark ? "text-red-300" : "text-red-700"}`}>EXP</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timestamp Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {iat && (
                <div className={`rounded-2xl p-4 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Issued At</div>
                  <div className={`text-sm font-mono ${isDark ? "text-sky-300" : "text-sky-700"}`}>{formatTimestamp(iat)}</div>
                </div>
              )}
              {nbf && (
                <div className={`rounded-2xl p-4 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Not Before</div>
                  <div className={`text-sm font-mono ${isDark ? "text-amber-300" : "text-amber-700"}`}>{formatTimestamp(nbf)}</div>
                </div>
              )}
              <div className={`rounded-2xl p-4 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Current Time</div>
                <div className={`text-sm font-mono ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>{formatTimestamp(now)}</div>
              </div>
              {exp && (
                <div className={`rounded-2xl p-4 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Expires At</div>
                  <div className={`text-sm font-mono ${isDark ? "text-red-300" : "text-red-700"}`}>{formatTimestamp(exp)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LifetimeVisualizer
