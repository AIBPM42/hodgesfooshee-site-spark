"use client";

import { useState, useEffect } from "react";
import type { ServiceName } from "@/lib/safeKeys";

type ServiceConfig = {
  name: ServiceName;
  label: string;
  description: string;
  icon: string;
};

const services: ServiceConfig[] = [
  {
    name: "manus",
    label: "Manus API",
    description: "Insider Access listings and property data",
    icon: "🏡",
  },
  {
    name: "perplexity",
    label: "Perplexity AI",
    description: "County narratives and market intelligence",
    icon: "🧠",
  },
  {
    name: "openai",
    label: "OpenAI",
    description: "Future AI features and enhancements",
    icon: "🤖",
  },
];

type KeyState = {
  maskedKey: string | null;
  inputValue: string;
  testing: boolean;
  saving: boolean;
  testResult: { success: boolean; message: string } | null;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<Record<ServiceName, KeyState>>({
    manus: { maskedKey: null, inputValue: "", testing: false, saving: false, testResult: null },
    perplexity: { maskedKey: null, inputValue: "", testing: false, saving: false, testResult: null },
    openai: { maskedKey: null, inputValue: "", testing: false, saving: false, testResult: null },
  });

  const [loading, setLoading] = useState(true);

  // Load masked keys on mount
  useEffect(() => {
    async function loadKeys() {
      try {
        const results = await Promise.all(
          services.map(async (service) => {
            const res = await fetch(`/api/admin/keys/${service.name}/get`);
            const data = await res.json();
            return { service: service.name, data };
          })
        );

        setKeys((prev) => {
          const updated = { ...prev };
          results.forEach(({ service, data }) => {
            updated[service as ServiceName].maskedKey = data.maskedKey || null;
          });
          return updated;
        });
      } catch (error) {
        console.error("Failed to load API keys:", error);
      } finally {
        setLoading(false);
      }
    }

    loadKeys();
  }, []);

  const handleInputChange = (service: ServiceName, value: string) => {
    setKeys((prev) => ({
      ...prev,
      [service]: { ...prev[service], inputValue: value, testResult: null },
    }));
  };

  const handleSave = async (service: ServiceName) => {
    const state = keys[service];
    if (!state.inputValue.trim()) return;

    setKeys((prev) => ({
      ...prev,
      [service]: { ...prev[service], saving: true, testResult: null },
    }));

    try {
      const res = await fetch(`/api/admin/keys/${service}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyValue: state.inputValue }),
      });

      const data = await res.json();

      if (data.success) {
        // Reload masked key
        const getRes = await fetch(`/api/admin/keys/${service}/get`);
        const getData = await getRes.json();

        setKeys((prev) => ({
          ...prev,
          [service]: {
            ...prev[service],
            maskedKey: getData.maskedKey,
            inputValue: "",
            saving: false,
            testResult: { success: true, message: "Key saved successfully!" },
          },
        }));
      } else {
        setKeys((prev) => ({
          ...prev,
          [service]: {
            ...prev[service],
            saving: false,
            testResult: { success: false, message: data.error || "Failed to save key" },
          },
        }));
      }
    } catch (error: any) {
      setKeys((prev) => ({
        ...prev,
        [service]: {
          ...prev[service],
          saving: false,
          testResult: { success: false, message: error.message },
        },
      }));
    }
  };

  const handleTest = async (service: ServiceName, useStored: boolean) => {
    setKeys((prev) => ({
      ...prev,
      [service]: { ...prev[service], testing: true, testResult: null },
    }));

    try {
      const body = useStored ? {} : { keyValue: keys[service].inputValue };

      const res = await fetch(`/api/admin/keys/${service}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      setKeys((prev) => ({
        ...prev,
        [service]: {
          ...prev[service],
          testing: false,
          testResult: { success: data.success, message: data.message },
        },
      }));
    } catch (error: any) {
      setKeys((prev) => ({
        ...prev,
        [service]: {
          ...prev[service],
          testing: false,
          testResult: { success: false, message: error.message },
        },
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linen75 flex items-center justify-center">
        <div className="text-xl text-neutral-700">Loading API Keys...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linen75 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="h1 font-display font-bold text-neutral-900">
            API Key Management
          </h1>
          <p className="mt-3 text-neutral-700 text-lg">
            Manage third-party API keys for Manus, Perplexity, and OpenAI integrations.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-1 gap-6">
          {services.map((service) => {
            const state = keys[service.name];

            return (
              <div
                key={service.name}
                className="rounded-3xl bg-[#FBF3E7] border border-black/5 shadow-elev-1 p-6 md:p-8"
              >
                {/* Service Header */}
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{service.icon}</div>
                  <div className="flex-1">
                    <h3 className="h3 font-semibold text-neutral-900">
                      {service.label}
                    </h3>
                    <p className="text-neutral-600 text-sm mt-1">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Current Key Display */}
                <div className="mt-6 p-4 rounded-xl bg-white/60 border border-black/5">
                  <div className="text-sm text-neutral-600 mb-1">Current Key:</div>
                  <div className="font-mono text-neutral-900">
                    {state.maskedKey || <span className="text-neutral-500">No key stored</span>}
                  </div>
                </div>

                {/* Input Field */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    New API Key
                  </label>
                  <input
                    type="password"
                    value={state.inputValue}
                    onChange={(e) => handleInputChange(service.name, e.target.value)}
                    placeholder={`Enter ${service.label} key...`}
                    className="w-full rounded-xl px-4 py-3 bg-white/90 text-neutral-800 placeholder-neutral-500 ring-1 ring-black/10 focus:ring-2 focus:ring-[rgba(228,85,46,.45)] focus:outline-none transition-all"
                  />
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleSave(service.name)}
                    disabled={!state.inputValue.trim() || state.saving}
                    className="px-6 py-2.5 rounded-xl font-medium text-white bg-[linear-gradient(180deg,var(--brand-copper),var(--brand-copper-700))] shadow-[0_10px_28px_rgba(231,106,60,.45)] hover:shadow-[0_14px_36px_rgba(231,106,60,.45)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {state.saving ? "Saving..." : "Save Key"}
                  </button>

                  <button
                    onClick={() => handleTest(service.name, true)}
                    disabled={!state.maskedKey || state.testing}
                    className="px-6 py-2.5 rounded-xl font-medium text-neutral-800 bg-white/90 ring-1 ring-black/10 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Test Stored Key
                  </button>

                  <button
                    onClick={() => handleTest(service.name, false)}
                    disabled={!state.inputValue.trim() || state.testing}
                    className="px-6 py-2.5 rounded-xl font-medium text-neutral-800 bg-white/90 ring-1 ring-black/10 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {state.testing ? "Testing..." : "Test Entered Key"}
                  </button>
                </div>

                {/* Test Result */}
                {state.testResult && (
                  <div
                    className={`mt-4 p-4 rounded-xl border ${
                      state.testResult.success
                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                        : "bg-rose-50 border-rose-200 text-rose-800"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {state.testResult.success ? "✅" : "❌"}
                      </span>
                      <div className="flex-1 text-sm font-medium">
                        {state.testResult.message}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900 underline underline-offset-4 transition-colors"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
