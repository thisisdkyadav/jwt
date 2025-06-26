import React, { useState } from "react";

function estimateEntropy(str: string) {
  // Simple entropy estimate: log2(unique chars^length)
  const unique = new Set(str).size;
  if (!str) return 0;
  return Math.round(str.length * Math.log2(unique || 1));
}

function getStrength(entropy: number, length: number) {
  if (length < 8 || entropy < 30) return "Weak";
  if (length < 16 || entropy < 60) return "Medium";
  return "Strong";
}

const SecretStrengthChecker = () => {
  const [secret, setSecret] = useState("");
  const entropy = estimateEntropy(secret);
  const length = secret.length;
  const strength = getStrength(entropy, length);

  return (
    <div className="space-y-4">
      <label className="block font-medium">HMAC Secret:</label>
      <input
        className="w-full p-2 border rounded font-mono text-sm"
        type="text"
        value={secret}
        onChange={(e) => setSecret(e.target.value)}
        placeholder="Enter your secret"
      />
      {secret && (
        <div className="mt-2">
          <div>
            <span className="font-medium">Strength:</span>{" "}
            <span
              className={
                strength === "Strong"
                  ? "text-green-700"
                  : strength === "Medium"
                  ? "text-yellow-700"
                  : "text-red-700"
              }
            >
              {strength}
            </span>
          </div>
          <div>
            <span className="font-medium">Length:</span> {length}
          </div>
          <div>
            <span className="font-medium">Entropy (bits):</span> {entropy}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecretStrengthChecker;
