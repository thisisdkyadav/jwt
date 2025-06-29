import { useState, useMemo, useEffect, useRef } from "react"
import { base64url } from "jose"
import { toast } from "sonner"
import { Copy, Trash2, Clock, AlertTriangle, CheckCircle } from "lucide-react"

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

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds} seconds`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`
  return `${Math.floor(seconds / 86400)} days`
}

interface LifetimeVisualizerProps {
  isDark?: boolean
}

const LifetimeVisualizer = ({ isDark = true }: LifetimeVisualizerProps) => {
  const [jwt, setJwt] = useState("")
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))
  const timelineRef = useRef<HTMLDivElement>(null)

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
  const now = currentTime
  const min = Math.min(iat || now, nbf || now, now)
  const max = Math.max(exp || now, now)
  const percent = (v?: number) => (v ? Math.round(((v - min) / (max - min)) * 100) : 0)

  // Calculate remaining time or time until valid
  const timeRemaining = useMemo(() => {
    if (!payload) return null
    if (status === "expired") {
      return { label: "Expired", value: formatDuration(now - (exp || now)), negative: true }
    } else if (status === "not yet valid") {
      const validIn = (nbf || iat || now) - now
      return { label: "Valid in", value: formatDuration(validIn), negative: false }
    } else if (exp) {
      const remaining = exp - now
      return { label: "Expires in", value: formatDuration(remaining), negative: false }
    }
    return null
  }, [payload, status, now, exp, nbf, iat])

  const clearAll = () => {
    setJwt("")
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
    <div className="h-full flex flex-col lg:flex-row gap-3">
      {/* JWT Input */}
      <div className="flex-1">
        <div className={`rounded-xl p-4 space-y-3 h-full transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600"></div>
              <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>JWT Token</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(jwt, "JWT")}
                className={`p-1.5 rounded-md transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`}
                aria-label="Copy JWT to clipboard"
                disabled={!jwt}
              >
                <Copy size={14} />
              </button>

              <button onClick={clearAll} className={`p-1.5 rounded-md transition-all duration-200 ${isDark ? "bg-slate-700/50 text-gray-300 hover:text-white hover:bg-slate-600/50" : "bg-sky-50 text-gray-600 hover:text-gray-900 hover:bg-sky-100"}`} aria-label="Clear all fields">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <textarea
            className={`w-full p-3 rounded-lg font-mono text-sm 
                     focus:outline-none transition-all duration-300 resize-none
                     min-h-[100px] focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
            rows={4}
            value={jwt}
            onChange={(e) => setJwt(e.target.value.trim())}
            onPaste={handlePaste}
            placeholder="Paste JWT token to visualize its lifetime"
          />
          {error && <div className={`p-3 rounded-lg border font-medium text-sm ${isDark ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-600"}`}>{error}</div>}
        </div>
      </div>

      {/* Timeline Visualization */}
      {payload && (
        <div className="flex-1">
          <div className={`rounded-xl p-4 space-y-4 h-full transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Token Lifetime</h3>
              </div>

              {timeRemaining && (
                <div
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5
                  ${
                    timeRemaining.negative ? (isDark ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-red-100 text-red-700 border border-red-200") : isDark ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  <Clock size={12} />
                  <span>
                    {timeRemaining.label}: {timeRemaining.value}
                  </span>
                </div>
              )}
            </div>

            {/* Status */}
            <div
              className={`rounded-lg p-4 ${
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
              <div className="flex items-center gap-2">
                {status === "active" ? (
                  <CheckCircle size={16} className={isDark ? "text-emerald-400" : "text-emerald-600"} />
                ) : status === "expired" ? (
                  <AlertTriangle size={16} className={isDark ? "text-red-400" : "text-red-600"} />
                ) : (
                  <Clock size={16} className={isDark ? "text-amber-400" : "text-amber-600"} />
                )}
                <span className={`font-semibold text-sm ${status === "active" ? (isDark ? "text-emerald-300" : "text-emerald-700") : status === "expired" ? (isDark ? "text-red-300" : "text-red-700") : isDark ? "text-amber-300" : "text-amber-700"}`}>
                  {status === "active" ? "Token is Active" : status === "expired" ? "Token has Expired" : "Token is Not Yet Valid"}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h4 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Timeline Visualization</h4>
              <div ref={timelineRef} className={`relative h-12 rounded-lg flex items-center px-3 overflow-hidden ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-sky-50/50 border border-sky-200/50 shadow-inner"}`}>
                {/* Active period visualization */}
                {nbf && exp && (
                  <div
                    className={`absolute h-1.5 rounded-full ${isDark ? "bg-sky-500/30" : "bg-sky-500/20"}`}
                    style={{
                      left: `${percent(nbf)}%`,
                      width: `${percent(exp) - percent(nbf)}%`,
                      transition: "all 0.5s ease-in-out",
                    }}
                  ></div>
                )}

                {/* Timeline points */}
                {iat && (
                  <div
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: `${percent(iat)}%`,
                      transition: "all 0.5s ease-in-out",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-sky-500 rounded-full mb-0.5"></div>
                      <div className={`text-xs font-medium ${isDark ? "text-sky-300" : "text-sky-700"}`}>IAT</div>
                    </div>
                  </div>
                )}
                {nbf && (
                  <div
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: `${percent(nbf)}%`,
                      transition: "all 0.5s ease-in-out",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mb-0.5"></div>
                      <div className={`text-xs font-medium ${isDark ? "text-amber-300" : "text-amber-700"}`}>NBF</div>
                    </div>
                  </div>
                )}
                <div
                  className="absolute transform -translate-x-1/2 animate-pulse"
                  style={{
                    left: `${percent(now)}%`,
                    transition: "all 0.5s ease-in-out",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mb-0.5 shadow-lg shadow-emerald-500/50"></div>
                    <div className={`text-xs font-medium ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>NOW</div>
                  </div>
                </div>
                {exp && (
                  <div
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: `${percent(exp)}%`,
                      transition: "all 0.5s ease-in-out",
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mb-0.5"></div>
                      <div className={`text-xs font-medium ${isDark ? "text-red-300" : "text-red-700"}`}>EXP</div>
                    </div>
                  </div>
                )}

                {/* Timeline vertical line for current time */}
                <div
                  className="absolute h-full w-px bg-emerald-500/70 top-0 animate-pulse"
                  style={{
                    left: `${percent(now)}%`,
                    transition: "left 0.5s linear",
                  }}
                ></div>
              </div>
            </div>

            {/* Timestamp Details */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              {iat && (
                <div className={`rounded-lg p-3 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Issued At</div>
                  <div className={`text-xs font-mono ${isDark ? "text-sky-300" : "text-sky-700"}`}>{formatTimestamp(iat)}</div>
                </div>
              )}
              {nbf && (
                <div className={`rounded-lg p-3 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Not Before</div>
                  <div className={`text-xs font-mono ${isDark ? "text-amber-300" : "text-amber-700"}`}>{formatTimestamp(nbf)}</div>
                </div>
              )}
              <div className={`rounded-lg p-3 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Current Time</div>
                <div className={`text-xs font-mono ${isDark ? "text-emerald-300" : "text-emerald-700"}`}>{formatTimestamp(now)}</div>
              </div>
              {exp && (
                <div className={`rounded-lg p-3 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                  <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Expires At</div>
                  <div className={`text-xs font-mono ${isDark ? "text-red-300" : "text-red-700"}`}>{formatTimestamp(exp)}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LifetimeVisualizer
