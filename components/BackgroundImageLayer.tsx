export default function BackgroundImageLayer({
  src = "/IMG_E0943.JPG",
  opacity = 0.28,
}: {
  src?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity,
        // Gentle vignette so content remains readable
        maskImage: "radial-gradient(ellipse at center, black, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 85%)",
      }}
    />
  );
}


