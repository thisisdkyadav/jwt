import { useState } from "react"

function estimateEntropy(str: string) {
  // Simple entropy estimate: log2(unique chars^length)
  const unique = new Set(str).size
  if (!str) return 0
  return Math.round(str.length * Math.log2(unique || 1))
}

function getStrength(entropy: number, length: number) {
  if (length < 8 || entropy < 30) return "Weak"
  if (length < 16 || entropy < 60) return "Medium"
  return "Strong"
}

interface SecretStrengthCheckerProps {
  isDark?: boolean
}

const SecretStrengthChecker = ({ isDark = true }: SecretStrengthCheckerProps) => {
  const [secret, setSecret] = useState("")
  const entropy = estimateEntropy(secret)
  const length = secret.length
  const strength = getStrength(entropy, length)

  return (
    <div className="w-full">
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            {/* Secret Input */}
            <div className={`rounded-xl p-4 sm:p-5 space-y-3 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
                <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>HMAC Secret</h3>
              </div>
              <textarea
                className={`w-full p-3 sm:p-4 rounded-lg font-mono text-sm 
                         focus:outline-none transition-all duration-300 focus-ring resize-none
                         min-h-[120px] ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white placeholder:text-gray-400 focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 placeholder:text-gray-500 focus:border-sky-500 shadow-inner"}`}
                rows={5}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter your HMAC secret to analyze its strength"
              />
            </div>
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="space-y-4">
            {/* Security Analysis */}
            <div className={`rounded-xl p-4 sm:p-5 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Security Analysis</h3>
              </div>

              {secret ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Strength */}
                    <div className={`rounded-lg p-4 transition-all duration-300 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                      <div className={`text-xs font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Strength Level</div>
                      <div className={`text-xl font-bold ${strength === "Strong" ? "text-emerald-500" : strength === "Medium" ? "text-amber-500" : "text-red-500"}`}>{strength}</div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full transition-all duration-500 ${strength === "Strong" ? "bg-emerald-500 w-full" : strength === "Medium" ? "bg-amber-500 w-2/3" : "bg-red-500 w-1/3"}`}></div>
                      </div>
                    </div>

                    {/* Length */}
                    <div className={`rounded-lg p-4 transition-all duration-300 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                      <div className={`text-xs font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Character Length</div>
                      <div className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{length}</div>
                      <div className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{length < 8 ? "Too short" : length < 16 ? "Acceptable" : "Good length"}</div>
                    </div>

                    {/* Entropy */}
                    <div className={`rounded-lg p-4 transition-all duration-300 ${isDark ? "bg-slate-700/50 border border-slate-600/50" : "bg-white/50 border border-sky-200/50 shadow-inner"}`}>
                      <div className={`text-xs font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-600"}`}>Entropy (bits)</div>
                      <div className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{entropy}</div>
                      <div className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{entropy < 30 ? "Low entropy" : entropy < 60 ? "Medium entropy" : "High entropy"}</div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div
                    className={`rounded-lg p-4 ${
                      strength === "Weak"
                        ? isDark
                          ? "bg-red-500/10 border border-red-500/30"
                          : "bg-red-50 border border-red-200"
                        : strength === "Medium"
                        ? isDark
                          ? "bg-amber-500/10 border border-amber-500/30"
                          : "bg-amber-50 border border-amber-200"
                        : isDark
                        ? "bg-emerald-500/10 border border-emerald-500/30"
                        : "bg-emerald-50 border border-emerald-200"
                    }`}
                  >
                    <div className={`text-xs font-medium mb-2 ${strength === "Weak" ? "text-red-400" : strength === "Medium" ? "text-amber-400" : "text-emerald-400"}`}>Security Recommendations</div>
                    <div className={`text-sm ${strength === "Weak" ? (isDark ? "text-red-300" : "text-red-600") : strength === "Medium" ? (isDark ? "text-amber-300" : "text-amber-700") : isDark ? "text-emerald-300" : "text-emerald-700"}`}>
                      {strength === "Weak" && "Use a longer secret with mixed characters, numbers, and symbols."}
                      {strength === "Medium" && "Consider using a longer secret or adding more character variety."}
                      {strength === "Strong" && "Your secret has good strength for HMAC operations."}
                    </div>
                  </div>
                </>
              ) : (
                <div className={`rounded-lg p-8 border-2 border-dashed text-center ${isDark ? "border-slate-600 text-gray-400" : "border-gray-300 text-gray-500"}`}>
                  <div className="text-sm mb-2">Enter an HMAC secret to analyze</div>
                  <div className="text-xs opacity-70">We'll evaluate its strength, entropy, and provide security recommendations</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SecretStrengthChecker
