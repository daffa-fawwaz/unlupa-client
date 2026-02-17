import type { ReactNode } from "react";
import type { TableColumn } from "@/features/dashboard/types/table.types";

interface TableRowProps<T> {
  item: T;
  index: number;
  columns: TableColumn[];
  renderCell: (column: TableColumn, item: T) => ReactNode;
}

export const DashboardTableRow = <T,>({
  item,
  columns,
  renderCell,
}: TableRowProps<T>) => {
  return (
    <tr className="hover:bg-white/5 transition group border-b border-white/5 last:border-0">
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-6 py-4 ${
            column.align === "right" ? "text-right" : "text-left"
          }`}
        >
          {renderCell(column, item)}
        </td>
      ))}
    </tr>
  );
};
