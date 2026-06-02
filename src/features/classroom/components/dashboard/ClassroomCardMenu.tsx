import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Edit2, Trash2, MoreVertical } from "lucide-react";

export interface ClassroomCardMenuProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ClassroomCardMenu = ({
  onEdit,
  onDelete,
}: ClassroomCardMenuProps) => {
  // If no actions are provided, do not render the menu button at all
  if (!onEdit && !onDelete) return null;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          onClick={(event) => {
            // Prevent triggering card click when opening the menu
            event.stopPropagation();
          }}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-black/35 text-gray-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white cursor-pointer"
          aria-label="Buka menu kelas"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          onClick={(event) => {
            // Prevent triggering card click when clicking inside menu area
            event.stopPropagation();
          }}
          className="z-50 min-w-36 overflow-hidden rounded-xl border border-white/10 bg-[#0F172A]/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200"
        >
          {onEdit && (
            <DropdownMenu.Item
              onClick={(event) => {
                event.stopPropagation();
                onEdit();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-300 outline-none transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit</span>
            </DropdownMenu.Item>
          )}

          {onDelete && (
            <DropdownMenu.Item
              onClick={(event) => {
                event.stopPropagation();
                onDelete();
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-400 outline-none transition-colors hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
