import type { TableColumn } from "@/features/dashboard/types/table.types"

export const teacherRequestColumns: TableColumn[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "message", label: "Message" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions", align: "right" },
]
