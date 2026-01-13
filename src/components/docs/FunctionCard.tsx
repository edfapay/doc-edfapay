import { CodeBlock } from "./CodeBlock";
import { MethodBadge } from "./MethodBadge";
import { ParameterTable } from "./ParameterTable";

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface FunctionCardProps {
  id: string;
  name: string;
  description: string;
  category: "core" | "payment" | "query" | "terminal" | "session";
  signature: string;
  parameters: Parameter[];
  example: string;
  returnType?: string;
  notes?: string[];
}

export const FunctionCard = ({
  id,
  name,
  description,
  category,
  signature,
  parameters,
  example,
  returnType,
  notes,
}: FunctionCardProps) => {
  return (
    <section
      id={id}
      className="scroll-mt-24 border border-border rounded-xl bg-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6 border-b border-border bg-gradient-to-r from-muted/30 to-transparent">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            <MethodBadge type={category} />
          </div>
          {returnType && (
            <code className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-md">
              → {returnType}
            </code>
          )}
        </div>
        <p className="mt-3 text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
            Signature
          </h4>
          <CodeBlock code={signature} language="kotlin" />
        </div>

        {parameters.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
              Parameters
            </h4>
            <ParameterTable parameters={parameters} />
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider">
            Example
          </h4>
          <CodeBlock code={example} language="kotlin" title="Usage Example" />
        </div>

        {notes && notes.length > 0 && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-primary mb-2">Notes</h4>
            <ul className="space-y-1">
              {notes.map((note, idx) => (
                <li key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
