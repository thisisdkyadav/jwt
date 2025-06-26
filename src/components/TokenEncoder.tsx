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

const TokenEncoder = () => {
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

  return (
    <div className="space-y-4">
      <div>
        <label className="font-medium">Header (JSON):</label>
        <CodeMirror value={header} height="100px" extensions={[json()]} onChange={(v: string) => setHeader(v)} />
      </div>
      <div>
        <label className="font-medium">Payload (JSON):</label>
        <CodeMirror value={payload} height="120px" extensions={[json()]} onChange={(v: string) => setPayload(v)} />
      </div>
      <div>
        <label className="font-medium">Algorithm:</label>
        <select className="ml-2 p-1 border rounded" value={alg} onChange={(e) => setAlg(e.target.value)}>
          {ALGORITHMS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="font-medium">Secret / Private Key:</label>
        <input className="w-full p-2 border rounded font-mono text-sm mt-1" type="text" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Enter secret or private key" />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold" onClick={handleGenerate}>
        Generate Token
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {token && (
        <div>
          <div className="font-semibold flex items-center gap-2">
            Generated JWT
            <button
              className="ml-2 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                navigator.clipboard.writeText(token)
              }}
            >
              Copy
            </button>
          </div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{token}</pre>
        </div>
      )}
    </div>
  )
}

export default TokenEncoder
