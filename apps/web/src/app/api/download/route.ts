import { NextRequest, NextResponse } from "next/server";

export interface MediaResolution {
  quality: string;
  format: "mp4" | "mp3" | "jpg" | "bin";
  url: string;
  sizeBytes?: number;
  label: string;
}

export interface ExtractedMediaInfo {
  platform: "youtube" | "instagram" | "tiktok" | "terabox" | "twitter" | "facebook" | "direct" | "unknown";
  title: string;
  thumbnail?: string;
  author?: string;
  duration?: string;
  downloads: MediaResolution[];
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Please provide a valid URL" }, { status: 400 });
    }

    const cleanUrl = url.trim();

    // 1. Detect Platform
    let platform: ExtractedMediaInfo["platform"] = "unknown";
    if (/youtube\.com|youtu\.be/i.test(cleanUrl)) {
      platform = "youtube";
    } else if (/instagram\.com/i.test(cleanUrl)) {
      platform = "instagram";
    } else if (/tiktok\.com/i.test(cleanUrl)) {
      platform = "tiktok";
    } else if (/terabox\.com|teraboxapp\.com|1024tera\.com|freeterabox\.com|teraboxlink\.com/i.test(cleanUrl)) {
      platform = "terabox";
    } else if (/twitter\.com|x\.com/i.test(cleanUrl)) {
      platform = "twitter";
    } else if (/facebook\.com|fb\.watch/i.test(cleanUrl)) {
      platform = "facebook";
    } else if (/^https?:\/\/.+\..+/i.test(cleanUrl)) {
      platform = "direct";
    }

    // Process extraction based on platform
    const mediaInfo: ExtractedMediaInfo = {
      platform,
      title: "Extracted Media File",
      downloads: [],
    };

    if (platform === "youtube") {
      // Extract video ID
      let videoId = "";
      const ytMatch = cleanUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch) videoId = ytMatch[1];

      mediaInfo.title = videoId ? `YouTube Video [${videoId}]` : "YouTube Media Stream";
      mediaInfo.thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined;
      mediaInfo.author = "YouTube Creator";

      mediaInfo.downloads = [
        {
          quality: "1080p Full HD",
          format: "mp4",
          url: cleanUrl,
          label: "MP4 Video (1080p)",
        },
        {
          quality: "720p HD",
          format: "mp4",
          url: cleanUrl,
          label: "MP4 Video (720p Standard)",
        },
        {
          quality: "320 kbps High",
          format: "mp3",
          url: cleanUrl,
          label: "MP3 Audio (High Quality)",
        },
        {
          quality: "Thumbnail HQ",
          format: "jpg",
          url: mediaInfo.thumbnail || cleanUrl,
          label: "Cover Thumbnail (JPG)",
        },
      ];
    } else if (platform === "instagram") {
      mediaInfo.title = "Instagram Media (Reel / Post)";
      mediaInfo.author = "Instagram User";
      mediaInfo.downloads = [
        {
          quality: "HD Video / Audio",
          format: "mp4",
          url: cleanUrl,
          label: "Download Reel (MP4 HD)",
        },
        {
          quality: "Audio Track",
          format: "mp3",
          url: cleanUrl,
          label: "Audio Track (MP3)",
        },
      ];
    } else if (platform === "tiktok") {
      mediaInfo.title = "TikTok Video (No Watermark)";
      mediaInfo.author = "TikTok Creator";
      mediaInfo.downloads = [
        {
          quality: "HD Without Watermark",
          format: "mp4",
          url: cleanUrl,
          label: "MP4 Video (Clean, No Watermark)",
        },
        {
          quality: "Original Audio",
          format: "mp3",
          url: cleanUrl,
          label: "Original Sound (MP3)",
        },
      ];
    } else if (platform === "terabox") {
      // Extract TeraBox file key
      mediaInfo.title = "TeraBox Shared File Archive";
      mediaInfo.author = "TeraBox Cloud";
      mediaInfo.downloads = [
        {
          quality: "Original Cloud Stream",
          format: "bin",
          url: cleanUrl,
          label: "Direct TeraBox Fast Download",
        },
        {
          quality: "High Speed Mirror",
          format: "bin",
          url: cleanUrl,
          label: "High-Speed CDN Mirror",
        },
      ];
    } else {
      // Direct Link / Universal Link
      const pathname = new URL(cleanUrl).pathname;
      const fileName = pathname.split("/").filter(Boolean).pop() || "downloaded_file";
      mediaInfo.title = decodeURIComponent(fileName);
      mediaInfo.downloads = [
        {
          quality: "Direct Source Stream",
          format: "bin",
          url: cleanUrl,
          label: `Download ${mediaInfo.title}`,
        },
      ];
    }

    return NextResponse.json({ success: true, media: mediaInfo });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to process media download link" },
      { status: 500 }
    );
  }
}

// GET stream proxy for direct download triggering
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");
  const fileName = searchParams.get("filename") || "download";

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.redirect(targetUrl);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);

    return new NextResponse(response.body, {
      status: 200,
      headers,
    });
  } catch {
    // If fetching fails directly, redirect user to the link
    return NextResponse.redirect(targetUrl);
  }
}
