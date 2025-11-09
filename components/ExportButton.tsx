"use client";

import { Download } from "lucide-react";
import { useState } from "react";

export function ExportButton({ elementId, filename }: { elementId: string; filename: string }) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;

      const element = document.getElementById(elementId);
      if (!element) {
        console.error(`Element with id "${elementId}" not found`);
        return;
      }

      const canvas = await html2canvas(element, {
        backgroundColor: "#0b0b0f",
        scale: 2, // Higher quality
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${filename}-${new Date().toISOString().split("T")[0]}.png`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="glass px-3 py-2 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-colors disabled:opacity-50"
    >
      <Download className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`} />
      {isExporting ? "Exporting..." : "Export"}
    </button>
  );
}
