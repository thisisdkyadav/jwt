import { useState } from "react"

const SYMMETRIC_FORMATS = [
  { label: "Base64", value: "base64" },
  { label: "Hex", value: "hex" },
]
const RSA_BITS = [2048, 4096]
const EC_CURVES = [
  { label: "P-256", value: "P-256" },
  { label: "P-384", value: "P-384" },
]

function randomBytes(len: number) {
  const arr = new Uint8Array(len)
  crypto.getRandomValues(arr)
  return arr
}
function toHex(arr: Uint8Array) {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}
function toBase64(arr: Uint8Array) {
  return btoa(String.fromCharCode(...arr))
}

interface KeyGeneratorProps {
  isDark?: boolean
}

const KeyGenerator = ({ isDark = true }: KeyGeneratorProps) => {
  const [symFormat, setSymFormat] = useState("base64")
  const [symLen, setSymLen] = useState(32)
  const [symKey, setSymKey] = useState("")
  const [rsaBits, setRsaBits] = useState(2048)
  const [rsaKeys, setRsaKeys] = useState<{ publicKey: string; privateKey: string } | null>(null)
  const [ecCurve, setEcCurve] = useState("P-256")
  const [ecKeys, setEcKeys] = useState<{ publicKey: string; privateKey: string } | null>(null)

  // Symmetric key generation
  const handleGenSym = () => {
    const bytes = randomBytes(symLen)
    setSymKey(symFormat === "hex" ? toHex(bytes) : toBase64(bytes))
  }

  // RSA key generation
  const handleGenRsa = async () => {
    const pair = await window.crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: rsaBits,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    )
    const pub = await window.crypto.subtle.exportKey("spki", pair.publicKey)
    const priv = await window.crypto.subtle.exportKey("pkcs8", pair.privateKey)
    setRsaKeys({
      publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(pub)))
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(priv)))
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PRIVATE KEY-----`,
    })
  }

  // EC key generation
  const handleGenEc = async () => {
    const pair = await window.crypto.subtle.generateKey({ name: "ECDSA", namedCurve: ecCurve }, true, ["sign", "verify"])
    const pub = await window.crypto.subtle.exportKey("spki", pair.publicKey)
    const priv = await window.crypto.subtle.exportKey("pkcs8", pair.privateKey)
    setEcKeys({
      publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(pub)))
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(priv)))
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PRIVATE KEY-----`,
    })
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-3">
      <div className="flex-1 space-y-3">
        {/* Symmetric Key Section */}
        <div className={`rounded-xl p-4 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-sky-400 to-sky-600"></div>
            <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Symmetric (HMAC) Secret</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="space-y-2">
              <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Length (bytes)</label>
              <input
                type="number"
                min={8}
                max={128}
                value={symLen}
                onChange={(e) => setSymLen(Number(e.target.value))}
                className={`w-full p-3 rounded-lg text-sm focus:outline-none transition-all duration-300 focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 focus:border-sky-500 shadow-inner"}`}
              />
            </div>

            <div className="space-y-2">
              <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Format</label>
              <select
                value={symFormat}
                onChange={(e) => setSymFormat(e.target.value)}
                className={`w-full p-3 rounded-lg text-sm focus:outline-none transition-all duration-300 focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 focus:border-sky-500 shadow-inner"}`}
              >
                {SYMMETRIC_FORMATS.map((f) => (
                  <option key={f.value} value={f.value} className={isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-sky-600 
                       text-white font-semibold text-sm tracking-wide
                       hover:from-sky-600 hover:to-sky-700 
                       transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              onClick={handleGenSym}
            >
              Generate Secret
            </button>
          </div>

          {symKey && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Generated Secret</h4>
                <button
                  className={`px-3 py-1.5 rounded-md text-xs font-medium
                           transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                             isDark ? "bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50" : "bg-white/50 border border-sky-200/50 text-gray-900 hover:bg-sky-50 shadow-sm"
                           }`}
                  onClick={() => navigator.clipboard.writeText(symKey)}
                >
                  Copy Secret
                </button>
              </div>
              <pre
                className={`rounded-lg p-3 text-xs 
                             overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed break-all ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-sky-200" : "bg-sky-50/50 border border-sky-200/50 text-sky-800 shadow-inner"}`}
              >
                {symKey}
              </pre>
            </div>
          )}
        </div>

        {/* RSA Key Section */}
        <div className={`rounded-xl p-4 space-y-4 transition-all duration-300 ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>RSA Keypair</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div className="space-y-2">
              <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Key Size (bits)</label>
              <select
                value={rsaBits}
                onChange={(e) => setRsaBits(Number(e.target.value))}
                className={`w-full p-3 rounded-lg text-sm focus:outline-none transition-all duration-300 focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 focus:border-sky-500 shadow-inner"}`}
              >
                {RSA_BITS.map((bits) => (
                  <option key={bits} value={bits} className={isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"}>
                    {bits}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 
                       text-white font-semibold text-sm tracking-wide
                       hover:from-emerald-600 hover:to-emerald-700 
                       transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              onClick={handleGenRsa}
            >
              Generate RSA Keys
            </button>
          </div>

          {rsaKeys && (
            <div className="space-y-4">
              {/* Public Key */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Public Key</h4>
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium
                             transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                               isDark ? "bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50" : "bg-white/50 border border-emerald-200/50 text-gray-900 hover:bg-emerald-50 shadow-sm"
                             }`}
                    onClick={() => navigator.clipboard.writeText(rsaKeys.publicKey)}
                  >
                    Copy Public
                  </button>
                </div>
                <pre
                  className={`rounded-lg p-3 text-xs 
                               overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-emerald-200" : "bg-emerald-50/50 border border-emerald-200/50 text-emerald-800 shadow-inner"}`}
                >
                  {rsaKeys.publicKey}
                </pre>
              </div>

              {/* Private Key */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Private Key</h4>
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium
                             transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                               isDark ? "bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50" : "bg-white/50 border border-emerald-200/50 text-gray-900 hover:bg-emerald-50 shadow-sm"
                             }`}
                    onClick={() => navigator.clipboard.writeText(rsaKeys.privateKey)}
                  >
                    Copy Private
                  </button>
                </div>
                <pre
                  className={`rounded-lg p-3 text-xs 
                               overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-emerald-200" : "bg-emerald-50/50 border border-emerald-200/50 text-emerald-800 shadow-inner"}`}
                >
                  {rsaKeys.privateKey}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        {/* EC Key Section */}
        <div className={`rounded-xl p-4 space-y-4 transition-all duration-300 h-full ${isDark ? "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50" : "bg-white/70 backdrop-blur-xl border border-sky-200/50 shadow-xl"}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <h3 className={`font-semibold text-sm tracking-wide ${isDark ? "text-white" : "text-gray-900"}`}>Elliptic Curve Keypair</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <div className="space-y-2">
              <label className={`block font-medium text-xs tracking-wide ${isDark ? "text-white/90" : "text-gray-700"}`}>Curve</label>
              <select
                value={ecCurve}
                onChange={(e) => setEcCurve(e.target.value)}
                className={`w-full p-3 rounded-lg text-sm focus:outline-none transition-all duration-300 focus-ring ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-white focus:border-sky-500/50" : "bg-white/50 border border-sky-200/50 text-gray-900 focus:border-sky-500 shadow-inner"}`}
              >
                {EC_CURVES.map((curve) => (
                  <option key={curve.value} value={curve.value} className={isDark ? "bg-slate-800 text-white" : "bg-white text-gray-900"}>
                    {curve.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 
                       text-white font-semibold text-sm tracking-wide
                       hover:from-purple-600 hover:to-purple-700 
                       transition-all duration-300 transform hover:scale-105 
                       shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              onClick={handleGenEc}
            >
              Generate EC Keys
            </button>
          </div>

          {ecKeys && (
            <div className="space-y-4">
              {/* Public Key */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Public Key</h4>
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium
                             transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                               isDark ? "bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50" : "bg-white/50 border border-purple-200/50 text-gray-900 hover:bg-purple-50 shadow-sm"
                             }`}
                    onClick={() => navigator.clipboard.writeText(ecKeys.publicKey)}
                  >
                    Copy Public
                  </button>
                </div>
                <pre
                  className={`rounded-lg p-3 text-xs 
                               overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-purple-200" : "bg-purple-50/50 border border-purple-200/50 text-purple-800 shadow-inner"}`}
                >
                  {ecKeys.publicKey}
                </pre>
              </div>

              {/* Private Key */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>Private Key</h4>
                  <button
                    className={`px-3 py-1.5 rounded-md text-xs font-medium
                             transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                               isDark ? "bg-slate-700/50 border border-slate-600/50 text-white hover:bg-slate-600/50" : "bg-white/50 border border-purple-200/50 text-gray-900 hover:bg-purple-50 shadow-sm"
                             }`}
                    onClick={() => navigator.clipboard.writeText(ecKeys.privateKey)}
                  >
                    Copy Private
                  </button>
                </div>
                <pre
                  className={`rounded-lg p-3 text-xs 
                               overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed ${isDark ? "bg-slate-700/50 border border-slate-600/50 text-purple-200" : "bg-purple-50/50 border border-purple-200/50 text-purple-800 shadow-inner"}`}
                >
                  {ecKeys.privateKey}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default KeyGenerator
