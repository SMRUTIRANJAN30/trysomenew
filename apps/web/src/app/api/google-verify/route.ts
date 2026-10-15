export async function GET() {
  return new Response("google-site-verification: google92f69f2009533ddb.html\n", {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
