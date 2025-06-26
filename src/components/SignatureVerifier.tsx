import React, { useState } from "react";
import { jwtVerify, importSPKI, importPKCS8 } from "jose";

const ALGORITHMS = [
  { label: "HS256 (HMAC SHA-256)", value: "HS256" },
  { label: "HS384 (HMAC SHA-384)", value: "HS384" },
  { label: "HS512 (HMAC SHA-512)", value: "HS512" },
  { label: "RS256 (RSA SHA-256)", value: "RS256" },
  { label: "ES256 (ECDSA P-256 SHA-256)", value: "ES256" },
];

async function verifyJwt({
  jwt,
  key,
  alg,
}: {
  jwt: string;
  key: string;
  alg: string;
}) {
  try {
    let cryptoKey: CryptoKey | Uint8Array;
    if (alg.startsWith("HS")) {
      cryptoKey = new TextEncoder().encode(key);
    } else if (alg.startsWith("RS") || alg.startsWith("ES")) {
      // Try to import as SPKI PEM (public key)
      cryptoKey = await importSPKI(key, alg);
    } else {
      throw new Error("Unsupported algorithm");
    }
    await jwtVerify(jwt, cryptoKey, { algorithms: [alg] });
    return { valid: true, reason: "Signature valid" };
  } catch (e) {
    let msg = "Unknown error";
    if (typeof e === "string") msg = e;
    else if (e instanceof Error) msg = e.message;
    return { valid: false, reason: msg };
  }
}

const SignatureVerifier = () => {
  const [jwt, setJwt] = useState("");
  const [key, setKey] = useState("");
  const [alg, setAlg] = useState("HS256");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setError("");
    setResult(null);
    if (!jwt || !key) {
      setError("JWT and key are required");
      return;
    }
    const { valid, reason } = await verifyJwt({ jwt, key, alg });
    setResult(valid ? `Valid: ${reason}` : `Invalid: ${reason}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="font-medium">JWT:</label>
        <textarea
          className="w-full p-2 border rounded font-mono text-sm"
          rows={3}
          value={jwt}
          onChange={(e) => setJwt(e.target.value.trim())}
          placeholder="Paste JWT here"
        />
      </div>
      <div>
        <label className="font-medium">Secret / Public Key:</label>
        <input
          className="w-full p-2 border rounded font-mono text-sm mt-1"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter secret or public key"
        />
      </div>
      <div>
        <label className="font-medium">Algorithm:</label>
        <select
          className="ml-2 p-1 border rounded"
          value={alg}
          onChange={(e) => setAlg(e.target.value)}
        >
          {ALGORITHMS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
        onClick={handleVerify}
      >
        Verify Signature
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {result && (
        <div
          className={
            result.startsWith("Valid") ? "text-green-700" : "text-red-700"
          }
        >
          {result}
        </div>
      )}
    </div>
  );
};

export default SignatureVerifier;
