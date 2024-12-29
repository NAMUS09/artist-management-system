const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-100">
      <div className="md:min-w-[25rem] md:max-w-[30rem] border rounded-lg bg-white p-5 shadow-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
