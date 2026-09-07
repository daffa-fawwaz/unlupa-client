import { Sparkles } from "lucide-react";

export type SlideContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const SlideContainer = ({ children }: SlideContainerProps) => (
  <div className="min-w-full h-full snap-center flex items-center justify-center p-4">
    <div className="bg-card w-full max-w-5xl h-112.5 md:h-125 rounded-2xl p-8 md:p-16 flex flex-col justify-between border border-border relative overflow-hidden group hover:border-border transition-colors duration-500">
      {/* Decorative Particles */}
      <div className="absolute top-12 right-12 opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse">
        <Sparkles className="w-12 h-12 text-primary" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  </div>
);
