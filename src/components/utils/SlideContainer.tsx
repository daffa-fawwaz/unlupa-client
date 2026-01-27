import { Sparkles } from "lucide-react";

export type SlideContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const SlideContainer = ({ children }: SlideContainerProps) => (
  <div className="min-w-full h-full snap-center flex items-center justify-center p-4">
    <div className="vanishing-card w-full max-w-5xl h-112.5 md:h-125 rounded-[2rem] p-8 md:p-16 flex flex-col justify-between border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors duration-500">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-1000" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-accent/10 transition-all duration-1000 delay-100" />

      {/* Decorative Particles */}
      <div className="absolute top-12 right-12 opacity-20 group-hover:opacity-40 transition-opacity duration-700 animate-pulse">
        <Sparkles className="w-12 h-12 text-white" />
      </div>

      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  </div>
);
