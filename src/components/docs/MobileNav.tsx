import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onSectionClick: (section: string) => void;
}

const allItems = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "initiate", label: "initiate" },
  { id: "terminalInfo", label: "terminalInfo" },
  { id: "purchase", label: "purchase" },
  { id: "authorize", label: "authorize" },
  { id: "capture", label: "capture" },
  { id: "refund", label: "refund" },
  { id: "void", label: "void" },
  { id: "reverse", label: "reverse" },
  { id: "txnHistory", label: "txnHistory" },
  { id: "txnDetail", label: "txnDetail" },
  { id: "reconcile", label: "reconcile" },
  { id: "activateTerminal", label: "activateTerminal" },
  { id: "deActivateTerminal", label: "deActivateTerminal" },
  { id: "syncTerminal", label: "syncTerminal" },
  { id: "getSessionList", label: "getSessionList" },
  { id: "logoutCurrentSession", label: "logoutCurrentSession" },
  { id: "logoutSession", label: "logoutSession" },
];

export const MobileNav = ({ onSectionClick }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (id: string) => {
    onSectionClick(id);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <span className="font-semibold">EdfaPay SDK</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-background pt-16 transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="p-4 overflow-y-auto h-full">
          <ul className="space-y-1">
            {allItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleClick(item.id)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <code className="font-mono text-sm">{item.label}</code>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
