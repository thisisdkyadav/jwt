import React, { useState, useMemo } from "react";
import { base64url } from "jose";

function parseJwtPart(part: string) {
  try {
    const bytes = base64url.decode(part);
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function formatTimestamp(ts?: number) {
  if (!ts) return "-";
  try {
    return new Date(ts * 1000).toLocaleString();
  } catch {
    return "Invalid";
  }
}

const TokenDecoder = () => {
  const [jwt, setJwt] = useState("");

  const { header, payload, signature, error } = useMemo(() => {
    if (!jwt) return { header: null, payload: null, signature: "", error: "" };
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      return {
        header: null,
        payload: null,
        signature: "",
        error: "JWT must have 3 parts (header.payload.signature)",
      };
    }
    const header = parseJwtPart(parts[0]);
    const payload = parseJwtPart(parts[1]);
    const signature = parts[2];
    return { header, payload, signature, error: "" };
  }, [jwt]);

  return (
    <div className="space-y-4">
      <label className="block font-medium">Paste JWT:</label>
      <textarea
        className="w-full p-2 border rounded font-mono text-sm"
        rows={3}
        value={jwt}
        onChange={(e) => setJwt(e.target.value.trim())}
        placeholder="eyJhbGciOi..."
      />
      {error && <div className="text-red-600">{error}</div>}
      {header && (
        <div>
          <div className="font-semibold">Header</div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(header, null, 2)}
          </pre>
        </div>
      )}
      {payload && (
        <div>
          <div className="font-semibold">Payload</div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
          <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium">exp:</span>{" "}
              {formatTimestamp(payload.exp)}
            </div>
            <div>
              <span className="font-medium">iat:</span>{" "}
              {formatTimestamp(payload.iat)}
            </div>
            <div>
              <span className="font-medium">nbf:</span>{" "}
              {formatTimestamp(payload.nbf)}
            </div>
          </div>
        </div>
      )}
      {signature && (
        <div>
          <div className="font-semibold">Signature</div>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {signature}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TokenDecoder;
