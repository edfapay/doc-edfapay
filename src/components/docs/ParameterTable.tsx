interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
}

interface ParameterTableProps {
  parameters: Parameter[];
}

export const ParameterTable = ({ parameters }: ParameterTableProps) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden my-4">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50 border-b border-border">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Parameter
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Type
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
              Required
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {parameters.map((param) => (
            <tr key={param.name} className="hover:bg-muted/30 transition-colors">
              <td className="px-4 py-3">
                <code className="text-sm text-primary font-medium">{param.name}</code>
              </td>
              <td className="px-4 py-3">
                <code className="text-sm text-muted-foreground">{param.type}</code>
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                {param.required ? (
                  <span className="text-xs font-medium text-[hsl(var(--method-delete))]">Required</span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    Optional{param.defaultValue && <span className="ml-1">({param.defaultValue})</span>}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-foreground/80">{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
