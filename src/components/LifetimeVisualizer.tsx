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

function getStatus(iat?: number, nbf?: number, exp?: number) {
  const now = Math.floor(Date.now() / 1000);
  if (exp && now > exp) return "expired";
  if (nbf && now < nbf) return "not yet valid";
  if (iat && now < iat) return "not yet valid";
  return "active";
}

const LifetimeVisualizer = () => {
  const [jwt, setJwt] = useState("");
  const { payload, error } = useMemo(() => {
    if (!jwt) return { payload: null, error: "" };
    const parts = jwt.split(".");
    if (parts.length !== 3) return { payload: null, error: "JWT must have 3 parts (header.payload.signature)" };
    const payload = parseJwtPart(parts[1]);
    return { payload, error: "" };
  }, [jwt]);

  const iat = payload?.iat;
  const nbf = payload?.nbf;
  const exp = payload?.exp;
  const status = getStatus(iat, nbf, exp);

  // Calculate timeline positions (simple linear, not to scale)
  const now = Math.floor(Date.now() / 1000);
  const min = Math.min(iat || now, nbf || now, now);
  const max = Math.max(exp || now, now);
  const percent = (v?: number) => (v ? Math.round(((v - min) / (max - min)) * 100) : 0);

  return (
    <div className="space-y-4">
      <label className="block font-medium">Paste JWT:</label>
      <textarea
        className="w-full p-2 border rounded font-mono text-sm"
        rows={3}
        value={jwt}
        onChange={e => setJwt(e.target.value.trim())}
        placeholder="eyJhbGciOi..."
      />
      {error && <div className="text-red-600">{error}</div>}
      {payload && (
        <div className="space-y-2">
          <div className="font-semibold">Token Timeline</div>
          <div className="relative h-8 bg-gray-200 rounded flex items-center">
            {iat && (
              <div className="absolute left-0" style={{ left: `${percent(iat)}%` }}>
                <div className="w-2 h-2 bg-blue-600 rounded-full" />
                <div className="text-xs">iat</div>
              </div>
            )}
            {nbf && (
              <div className="absolute" style={{ left: `${percent(nbf)}%` }}>
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="text-xs">nbf</div>
              </div>
            )}
            <div className="absolute" style={{ left: `${percent(now)}%` }}>
              <div className="w-2 h-2 bg-green-600 rounded-full" />
              <div className="text-xs">now</div>
            </div>
            {exp && (
              <div className="absolute" style={{ left: `${percent(exp)}%` }}>
                <div className="w-2 h-2 bg-red-600 rounded-full" />
                <div className="text-xs">exp</div>
              </div>
            )}
          </div>
          <div className="mt-2">
            <span className="font-medium">Status:</span> {status === "active" ? <span className="text-green-700">Active</span> : status === "expired" ? <span className="text-red-700">Expired</span> : <span className="text-yellow-700">Not Yet Valid</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default LifetimeVisualizer;
