import type { ReactNode } from "react";
import { DashboardTableHeader } from "./DashboardTableHeader";
import { DashboardTableRow } from "./DashboardTableRow";
import type { TableColumn } from "../types/table.types";

interface DashboardTableProps<T> {
  data: T[] | null;
  columns: TableColumn[];
  renderCell: (column: TableColumn, item: T, index: number) => ReactNode;
  title: string;
}

export const DashboardTable = <T,>({
  data,
  columns,
  renderCell,
  title,
}: DashboardTableProps<T>) => {
  return (
    <div className="hidden md:block glass-panel rounded-2xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-display font-semibold text-white">
          {title}
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <DashboardTableHeader columns={columns} />
          <tbody className="divide-y divide-white/5">
            {data?.map((item, index) => (
              <DashboardTableRow
                key={index}
                item={item}
                index={index}
                columns={columns}
                renderCell={(column, item) => renderCell(column, item, index)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
