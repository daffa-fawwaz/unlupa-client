import type { ReactNode } from "react";
import { DashboardTableHeader } from "@/features/dashboard/components/DashboardTableHeader";
import { DashboardTableRow } from "@/features/dashboard/components/DashboardTableRow";
import type { TableColumn } from "@/features/dashboard/types/table.types";

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
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-lg font-display font-semibold text-white">
            {title}
          </h2>
        </div>

        <div className="overflow-x-auto">
          {data && data.length > 0 ? (
            <table className="w-full text-sm">
              <DashboardTableHeader columns={columns} />
              <tbody className="divide-y divide-white/5">
                {data.map((item, index) => (
                  <DashboardTableRow
                    key={index}
                    item={item}
                    index={index}
                    columns={columns}
                    renderCell={(column, item) =>
                      renderCell(column, item, index)
                    }
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-sm">
                Tidak ada teacher request saat ini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data?.length === 0 ? (
          <div className="glass-panel rounded-2xl border border-white/5 p-6 text-center">
            <p className="text-gray-500 text-sm">Tidak ada data</p>
          </div>
        ) : (
          data?.map((item, index) => (
            <div
              key={index}
              className="glass-panel p-4 rounded-xl border border-white/5 space-y-4"
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex justify-between items-start gap-4"
                >
                  {/* Hide label for actions or if it's too obvious, depending on design. For now keep it generic */}
                  {column.key !== "actions" && (
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider shrink-0 mt-1">
                      {column.label}
                    </span>
                  )}

                  <div
                    className={`${column.key === "actions" ? "w-full flex justify-end" : "text-right"}`}
                  >
                    {renderCell(column, item, index)}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};
