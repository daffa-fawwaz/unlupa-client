import type { TableColumn } from "@/features/dashboard/types/table.types";

interface DashboardTableHeaderProps {
  columns: TableColumn[];
}

export const DashboardTableHeader = ({
  columns,
}: DashboardTableHeaderProps) => {
  return (
    <thead className="bg-surface-1 border-b border-border">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-4 font-medium text-muted-foreground uppercase tracking-wider ${
              column.align === "right" ? "text-right" : "text-left"
            }`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
};
