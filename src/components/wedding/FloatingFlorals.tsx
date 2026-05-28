"use client";

const corners = [
  { className: "top-0 right-0 text-blush/35", delay: 0, rotate: 90 },
  { className: "bottom-0 left-0 text-gold/30", delay: 0.5, rotate: -90 },
];

function FloralCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 110C10 80 30 60 50 50C35 45 20 30 15 10C40 15 55 30 60 50C70 30 85 15 110 10C105 30 90 45 75 50C95 60 110 80 110 110"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
      <circle cx="55" cy="58" r="4" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

export function FloatingFlorals() {
  return (
    <div className="pointer-events-none hidden md:block" aria-hidden="true">
      {corners.map((corner, i) => (
        <div
          key={i}
          className={`animate-float fixed z-[3] ${corner.className}`}
          style={{
            transform: `rotate(${corner.rotate}deg)`,
            animationDelay: `${corner.delay}s`,
          }}
        >
          <FloralCorner className="h-28 w-28 lg:h-36 lg:w-36" />
        </div>
      ))}
    </div>
  );
}
