function LoadingState({ message = "Loading..." }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default LoadingState;
