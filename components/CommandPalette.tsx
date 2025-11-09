"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command } from "lucide-react";

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  items: CommandItem[];
}

export function CommandPalette({ items }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (!isOpen) return;

      // Escape to close
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }

      // Arrow keys to navigate
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filteredItems.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      // Enter to select
      if (e.key === "Enter" && filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setIsOpen(false);
        setQuery("");
        setSelectedIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, query, selectedIndex, filteredItems]);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="glass px-3 py-2 rounded-2xl flex items-center gap-2 hover:bg-white/10 transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm">Search</span>
        <kbd className="px-2 py-1 text-xs bg-white/10 rounded">
          <Command className="w-3 h-3 inline" />K
        </kbd>
      </button>

      {/* Command palette modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -20 }}
              className="glass p-2 w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <Search className="w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Search dashboard, charts, metrics..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-white/40"
                  autoFocus
                />
                <kbd className="px-2 py-1 text-xs bg-white/10 rounded">ESC</kbd>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto py-2">
                {filteredItems.length === 0 ? (
                  <div className="px-4 py-8 text-center text-white/50">
                    No results found for "{query}"
                  </div>
                ) : (
                  filteredItems.map((item, index) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                        setQuery("");
                        setSelectedIndex(0);
                      }}
                      className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-white/10 transition-colors ${
                        index === selectedIndex ? "bg-white/10" : ""
                      }`}
                    >
                      {item.icon && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hodges-orange to-hodges-purple flex items-center justify-center flex-shrink-0">
                          {item.icon}
                        </div>
                      )}
                      <div className="text-left flex-1">
                        <div className="text-sm font-medium text-white">{item.title}</div>
                        {item.description && (
                          <div className="text-xs text-white/50 mt-0.5">{item.description}</div>
                        )}
                      </div>
                      {index === selectedIndex && (
                        <kbd className="px-2 py-1 text-xs bg-white/10 rounded">↵</kbd>
                      )}
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
