import React, { useState } from "react";

const SYMMETRIC_FORMATS = [
  { label: "Base64", value: "base64" },
  { label: "Hex", value: "hex" },
];
const RSA_BITS = [2048, 4096];
const EC_CURVES = [
  { label: "P-256", value: "P-256" },
  { label: "P-384", value: "P-384" },
];

function randomBytes(len: number) {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return arr;
}
function toHex(arr: Uint8Array) {
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
function toBase64(arr: Uint8Array) {
  return btoa(String.fromCharCode(...arr));
}

const KeyGenerator = () => {
  const [symFormat, setSymFormat] = useState("base64");
  const [symLen, setSymLen] = useState(32);
  const [symKey, setSymKey] = useState("");
  const [rsaBits, setRsaBits] = useState(2048);
  const [rsaKeys, setRsaKeys] = useState<
    { publicKey: string; privateKey: string } | null
  >(null);
  const [ecCurve, setEcCurve] = useState("P-256");
  const [ecKeys, setEcKeys] = useState<
    { publicKey: string; privateKey: string } | null
  >(null);

  // Symmetric key generation
  const handleGenSym = () => {
    const bytes = randomBytes(symLen);
    setSymKey(symFormat === "hex" ? toHex(bytes) : toBase64(bytes));
  };

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
    );
    const pub = await window.crypto.subtle.exportKey("spki", pair.publicKey);
    const priv = await window.crypto.subtle.exportKey("pkcs8", pair.privateKey);
    setRsaKeys({
      publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(
        String.fromCharCode(...new Uint8Array(pub))
      )
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(
        String.fromCharCode(...new Uint8Array(priv))
      )
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PRIVATE KEY-----`,
    });
  };

  // EC key generation
  const handleGenEc = async () => {
    const pair = await window.crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: ecCurve },
      true,
      ["sign", "verify"]
    );
    const pub = await window.crypto.subtle.exportKey("spki", pair.publicKey);
    const priv = await window.crypto.subtle.exportKey("pkcs8", pair.privateKey);
    setEcKeys({
      publicKey: `-----BEGIN PUBLIC KEY-----\n${btoa(
        String.fromCharCode(...new Uint8Array(pub))
      )
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PUBLIC KEY-----`,
      privateKey: `-----BEGIN PRIVATE KEY-----\n${btoa(
        String.fromCharCode(...new Uint8Array(priv))
      )
        .replace(/(.{64})/g, "$1\n")
        .trim()}\n-----END PRIVATE KEY-----`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="font-semibold mb-2">Symmetric (HMAC) Secret</div>
        <div className="flex gap-2 items-center mb-2">
          <label>Length:</label>
          <input
            type="number"
            min={8}
            max={128}
            value={symLen}
            onChange={(e) => setSymLen(Number(e.target.value))}
            className="w-16 p-1 border rounded"
          />
          <label>Format:</label>
          <select
            value={symFormat}
            onChange={(e) => setSymFormat(e.target.value)}
            className="p-1 border rounded"
          >
            {SYMMETRIC_FORMATS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleGenSym}
          >
            Generate
          </button>
        </div>
        {symKey && (
          <div className="mt-2">
            <div className="font-medium">Secret:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {symKey}
            </pre>
            <button
              className="mt-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigator.clipboard.writeText(symKey)}
            >
              Copy
            </button>
          </div>
        )}
      </div>
      <div>
        <div className="font-semibold mb-2">Asymmetric (RSA) Keypair</div>
        <div className="flex gap-2 items-center mb-2">
          <label>Bits:</label>
          <select
            value={rsaBits}
            onChange={(e) => setRsaBits(Number(e.target.value))}
            className="p-1 border rounded"
          >
            {RSA_BITS.map((bits) => (
              <option key={bits} value={bits}>
                {bits}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleGenRsa}
          >
            Generate
          </button>
        </div>
        {rsaKeys && (
          <div className="mt-2">
            <div className="font-medium">Public Key:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {rsaKeys.publicKey}
            </pre>
            <button
              className="mt-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigator.clipboard.writeText(rsaKeys.publicKey)}
            >
              Copy
            </button>
            <div className="font-medium mt-2">Private Key:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {rsaKeys.privateKey}
            </pre>
            <button
              className="mt-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigator.clipboard.writeText(rsaKeys.privateKey)}
            >
              Copy
            </button>
          </div>
        )}
      </div>
      <div>
        <div className="font-semibold mb-2">Asymmetric (EC) Keypair</div>
        <div className="flex gap-2 items-center mb-2">
          <label>Curve:</label>
          <select
            value={ecCurve}
            onChange={(e) => setEcCurve(e.target.value)}
            className="p-1 border rounded"
          >
            {EC_CURVES.map((curve) => (
              <option key={curve.value} value={curve.value}>
                {curve.label}
              </option>
            ))}
          </select>
          <button
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleGenEc}
          >
            Generate
          </button>
        </div>
        {ecKeys && (
          <div className="mt-2">
            <div className="font-medium">Public Key:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {ecKeys.publicKey}
            </pre>
            <button
              className="mt-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigator.clipboard.writeText(ecKeys.publicKey)}
            >
              Copy
            </button>
            <div className="font-medium mt-2">Private Key:</div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {ecKeys.privateKey}
            </pre>
            <button
              className="mt-1 px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => navigator.clipboard.writeText(ecKeys.privateKey)}
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyGenerator;
