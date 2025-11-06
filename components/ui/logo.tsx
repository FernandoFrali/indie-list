export default function Logo({ className }: { className?: string }) {
  return (
    <h1 className={`text-white text-4xl font-alt tracking-tight ${className}`}>
      Indie<span className="text-c5">List</span>
    </h1>
  );
}
