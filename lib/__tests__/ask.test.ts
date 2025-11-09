import { describe, it, expect } from "@jest/globals";
import { normalizeN8n } from "../../app/api/ask/route";

describe("normalizeN8n", () => {
  it("should normalize valid n8n response with all fields", () => {
    const mockN8nResponse = {
      answer: "A short sale typically takes 60-90 days to complete.",
      citations: [
        { title: "Short Sale Guide", chunk: "§1" },
        { title: "Real Estate Timing", chunk: "§2" },
      ],
      confidence: "High",
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result).toEqual({
      ok: true,
      answer: "A short sale typically takes 60-90 days to complete.",
      citations: [
        { title: "Short Sale Guide", chunk: "§1" },
        { title: "Real Estate Timing", chunk: "§2" },
      ],
      confidence: "High",
    });
  });

  it("should normalize response with numeric confidence score", () => {
    const mockN8nResponse = {
      answer: "Davidson County has 847 active listings.",
      sources: [{ name: "MLS Data", content: "Davidson stats" }],
      score: 0.92,
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result.ok).toBe(true);
    expect(result.answer).toBe("Davidson County has 847 active listings.");
    expect(result.confidence).toBe("High"); // 0.92 >= 0.8
    expect(result.citations).toEqual([
      { title: "MLS Data", chunk: "Davidson stats" },
    ]);
  });

  it("should handle response with alternate field names", () => {
    const mockN8nResponse = {
      output: "Williamson County median price is $730K.",
      sources: [{ source: "County Report", text: "Williamson data" }],
      confidence: "medium",
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result.ok).toBe(true);
    expect(result.answer).toBe("Williamson County median price is $730K.");
    expect(result.confidence).toBe("Medium");
  });

  it("should return error when answer field is missing", () => {
    const mockN8nResponse = {
      citations: [{ title: "Some doc", chunk: "§1" }],
      confidence: "High",
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result.ok).toBe(false);
    expect(result.error).toBe("No answer field in n8n response");
  });

  it("should return error for null or invalid input", () => {
    const result = normalizeN8n(null);

    expect(result.ok).toBe(false);
    expect(result.error).toBe("Invalid response from n8n");
  });

  it("should handle response without citations or confidence", () => {
    const mockN8nResponse = {
      answer: "Basic answer without metadata",
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result.ok).toBe(true);
    expect(result.answer).toBe("Basic answer without metadata");
    expect(result.citations).toBeUndefined();
    expect(result.confidence).toBeUndefined();
  });

  it("should normalize low confidence score", () => {
    const mockN8nResponse = {
      answer: "This is a low confidence answer.",
      score: 0.3,
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result.ok).toBe(true);
    expect(result.confidence).toBe("Low"); // 0.3 < 0.5
  });

  it("should normalize medium confidence score", () => {
    const mockN8nResponse = {
      answer: "This is a medium confidence answer.",
      score: 0.65,
    };

    const result = normalizeN8n(mockN8nResponse);

    expect(result.ok).toBe(true);
    expect(result.confidence).toBe("Medium"); // 0.5 <= 0.65 < 0.8
  });
});
