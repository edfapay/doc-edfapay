import { cn } from "@/lib/utils";
import { 
  Zap, 
  CreditCard, 
  Database, 
  Server, 
  LogOut,
  ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionClick: (section: string) => void;
}

const sections = [
  {
    title: "Getting Started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "installation", label: "Installation" },
    ],
  },
  {
    title: "Core",
    icon: Zap,
    items: [
      { id: "initiate", label: "initiate" },
      { id: "terminalInfo", label: "terminalInfo" },
    ],
  },
  {
    title: "Payment Operations",
    icon: CreditCard,
    items: [
      { id: "purchase", label: "purchase" },
      { id: "authorize", label: "authorize" },
      { id: "capture", label: "capture" },
      { id: "refund", label: "refund" },
      { id: "void", label: "void" },
      { id: "reverse", label: "reverse" },
      { id: "reverseLastTransaction", label: "reverseLastTransaction" },
    ],
  },
  {
    title: "Transaction Queries",
    icon: Database,
    items: [
      { id: "txnHistory", label: "txnHistory" },
      { id: "txnDetail", label: "txnDetail" },
    ],
  },
  {
    title: "Reconciliation",
    icon: Database,
    items: [
      { id: "reconcile", label: "reconcile" },
      { id: "reconciliationHistory", label: "reconciliationHistory" },
      { id: "reconciliationDetail", label: "reconciliationDetail" },
      { id: "reconciliationReceipt", label: "reconciliationReceipt" },
    ],
  },
  {
    title: "Terminal Management",
    icon: Server,
    items: [
      { id: "activateTerminal", label: "activateTerminal" },
      { id: "deActivateTerminal", label: "deActivateTerminal" },
      { id: "syncTerminal", label: "syncTerminal" },
    ],
  },
  {
    title: "Session Management",
    icon: LogOut,
    items: [
      { id: "getSessionList", label: "getSessionList" },
      { id: "logoutCurrentSession", label: "logoutCurrentSession" },
      { id: "logoutSession", label: "logoutSession" },
    ],
  },
];

export const Sidebar = ({ activeSection, onSectionClick }: SidebarProps) => {
  return (
    <nav className="w-64 shrink-0 border-r border-border bg-[hsl(var(--sidebar-bg))] h-screen sticky top-0 overflow-y-auto scrollbar-thin hidden lg:block">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          <div>
            <h1 className="font-semibold text-foreground">EdfaPay SDK</h1>
            <span className="text-xs text-muted-foreground">v1.0.5</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-2">
              {section.icon && <section.icon className="w-4 h-4 text-muted-foreground" />}
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.title}
              </h2>
            </div>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onSectionClick(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-2 group",
                      activeSection === item.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <ChevronRight 
                      className={cn(
                        "w-3 h-3 transition-transform",
                        activeSection === item.id ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                      )} 
                    />
                    <code className="font-mono">{item.label}</code>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
};
