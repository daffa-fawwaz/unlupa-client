import type { TableColumn } from "../types/table.types";

interface DashboardTableHeaderProps {
  columns: TableColumn[];
}

export const DashboardTableHeader = ({
  columns,
}: DashboardTableHeaderProps) => {
  return (
    <thead className="bg-white/5 border-b border-white/5">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-6 py-4 font-medium text-gray-400 uppercase tracking-wider ${
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
