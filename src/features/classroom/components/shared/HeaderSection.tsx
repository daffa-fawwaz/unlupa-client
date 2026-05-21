const HeaderSection = ({
  workspace,
  mainTitle,
  secTitle,
  subtitle,
}: {
  workspace: string;
  mainTitle: string;
  secTitle: string;
  subtitle: string;
}) => {
  return (
    <div className="mb-12 relative">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 text-xs font-medium text-gray-400 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        {workspace}
      </div>

      <h1 className="text-4xl md:text-6xl font-serif font-black text-white mb-5 tracking-tight drop-shadow-lg leading-tight">
        {mainTitle}{" "}
        <span className="bg-clip-text text-transparent bg-linear-to-r from-emerald-400 via-teal-300 to-blue-400">
          {secTitle}
        </span>
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl leading-relaxed font-light mb-8">
        {subtitle}
      </p>
    </div>
  );
};

export default HeaderSection;
