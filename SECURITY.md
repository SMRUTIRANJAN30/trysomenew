# Security

## Reporting a problem

Please don't open a public issue for a security problem. Email **smrutiranjansahoopikun@gmail.com** with the steps to reproduce it. This is a one-person project, so replies may take a few days.

## How files are handled

- Document tools work on files inside your browser.
- Beam uses encrypted WebRTC between two browsers. The public PeerJS service is used to set up the connection.
- PDF redaction builds a new PDF from page images, so covered text isn't kept. Versions before 24 November 2026 only drew a box over the text. If you redacted a PDF before that date, redact the original again.

## Supported version

Only the newest version on the `main` branch and the live website are supported.
