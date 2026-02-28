"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function InstagramEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <div ref={containerRef} className="flex justify-center">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          maxWidth: 540,
          width: "100%",
          background: "white",
          border: 0,
          borderRadius: 16,
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
