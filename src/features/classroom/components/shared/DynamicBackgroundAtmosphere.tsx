const DynamicBackgroundAtmosphere = () => {
  return (
    <>
      <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-blue-900/10 via-[#090A0F] to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
};

export default DynamicBackgroundAtmosphere;
