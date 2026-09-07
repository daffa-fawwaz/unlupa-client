import { BookOpen } from "lucide-react";

interface HafalanKosongProps {
  hafalan: string;
  title?: string;
  description?: string;
}

export const HafalanKosong = ({ 
  hafalan, 
  title = "Belum Ada Hafalan",
  description 
}: HafalanKosongProps) => {
  return (
    <div className="col-span-full py-32 text-center border-2 border-dashed border-border rounded-2xl bg-card">
      <div className="w-24 h-24 bg-surface-1 border border-border rounded-full flex items-center justify-center mx-auto mb-6 group cursor-pointer hover:bg-surface-2 hover:scale-110 transition-all duration-300">
        <BookOpen className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <h3 className="text-2xl font-serif text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {description || `${hafalan} ini masih kosong. Mulailah perjalanan menghafalmu dengan menambahkan target hafalan baru.`}
      </p>
    </div>
  );
};
