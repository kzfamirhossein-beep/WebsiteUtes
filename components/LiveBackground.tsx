export default function LiveBackground() {
  // Subtle animated gradient mesh with a center mask for elegance
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-80"
    >
      <div
        className="h-full w-full animate-gradient"
        style={{
          backgroundImage:
            "radial-gradient(1200px_600px_at_10%_-10%, rgba(160,124,0,0.30), transparent 60%)," +
            "radial-gradient(1000px_500px_at_110%_20%, rgba(160,124,0,0.22), transparent 60%)," +
            "radial-gradient(800px_600px_at_50%_120%, rgba(255,255,255,0.08), transparent 60%)",
          backgroundSize: "200% 200%",
          backgroundPosition: "0% 50%",
          filter: "saturate(120%)",
        }}
      />
    </div>
  );
}


