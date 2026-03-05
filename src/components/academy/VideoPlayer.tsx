"use client";

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function getVimeoEmbedUrl(url: string): string | null {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title }: VideoPlayerProps) {
  const youtubeEmbed = getYouTubeEmbedUrl(url);
  const vimeoEmbed = getVimeoEmbedUrl(url);

  if (youtubeEmbed) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={youtubeEmbed}
          title={title || "וידאו"}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vimeoEmbed) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={vimeoEmbed}
          title={title || "וידאו"}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideo(url)) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <video
          src={url}
          controls
          className="w-full h-full"
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
      <p className="text-text-secondary text-sm">פורמט וידאו לא נתמך</p>
    </div>
  );
}
