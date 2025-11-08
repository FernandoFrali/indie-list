export default function Logo({ className }: { className?: string }) {
  return (
    <a className={`text-white text-4xl font-alt tracking-tight ${className}`} href="/">
      Indie<span className="text-c5">List</span>
    </a>
  );
}
