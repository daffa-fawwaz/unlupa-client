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
    <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/2">
      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 group cursor-pointer hover:bg-amber-500/20 hover:scale-110 transition-all duration-300">
        <BookOpen className="w-10 h-10 text-gray-600 group-hover:text-amber-500 transition-colors" />
      </div>
      <h3 className="text-2xl font-serif text-white mb-2">{title}</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        {description || `${hafalan} ini masih kosong. Mulailah perjalanan menghafalmu dengan menambahkan target hafalan baru.`}
      </p>
    </div>
  );
};
