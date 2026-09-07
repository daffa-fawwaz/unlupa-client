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
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1 border border-border mb-6 text-xs font-medium text-muted-foreground">
        <span className="w-2 h-2 rounded-full bg-primary" />
        {workspace}
      </div>

      <h1 className="text-4xl md:text-6xl font-serif font-black text-foreground mb-5 tracking-tight leading-tight">
        {mainTitle}{" "}
        <span className="text-primary">
          {secTitle}
        </span>
      </h1>
      <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed font-light mb-8">
        {subtitle}
      </p>
    </div>
  );
};

export default HeaderSection;
