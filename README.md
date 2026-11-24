# trysomenew

Free tools for PDFs, images, text and code that run in your browser.

**[Open trysomenew](https://trysomenew.netlify.app)**

[![License: MIT](https://img.shields.io/badge/License-MIT-1f5f4a.svg)](LICENSE) ![Next.js 16](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

## Tools

| Group | Examples |
|---|---|
| PDF | Merge, split, rotate, compress, redact, watermark, page numbers, PDF to image |
| Image | Resize, crop, compress, convert, rotate, filters, watermark, image to PDF |
| OCR | Text from images and scanned PDFs (Tesseract.js) |
| Developer | JSON, XML, YAML, CSV, SQL, regex, JWT, Base64, UUID, cron, hashes |
| Text | Word counter, case, clean up, find and replace, compare |
| SVG and colour | SVG viewer and optimiser, contrast checker, palettes, gradients |
| QR and barcode | Create and scan |
| Business | Invoice, receipt, calculators, signatures |
| Study | Summaries, notes, flashcards and quizzes |
| Beam | Send text and files between phone and PC |

The study tools use word-matching rules in the browser, not a large AI model, so check their results.

## Privacy

- Document tools process files in your browser and don't upload them.
- OCR and some PDF features download program files from a public CDN. Your document isn't sent.
- Beam connects two browsers with encrypted WebRTC and uses the public PeerJS service to find each other.
- Speech features may use your browser maker's online service.
- Redaction turns pages into images and builds a new PDF, so covered text isn't kept. Always check the result before sharing it.

## Run locally

You need Node.js 20.9 or newer.

```bash
git clone https://github.com/SMRUTIRANJAN30/trysomenew.git
cd trysomenew/apps/web
npm install
npm run dev
```

Open <http://localhost:3000>.

| Command | Purpose |
|---|---|
| `npm run build` | Production build |
| `npm test` | Tests |
| `npm run lint` | Lint |

## Project structure

```
apps/
  web/     Next.js website (this is what is deployed)
  api/     FastAPI experiment, not deployed or used by the website
  worker/  Background worker experiment, not deployed
```

`docker-compose.yml` is a draft and can't be used yet, because its Dockerfiles aren't included.

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md). Please report security problems privately, as described in [SECURITY.md](SECURITY.md).

## Author

**Smrutiranjan Sahoo**, Electronics and Communication Engineering
[GitHub](https://github.com/SMRUTIRANJAN30) · [Email](mailto:smrutiranjansahoopikun@gmail.com)

## License

[MIT](LICENSE)
