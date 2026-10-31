<?xml version="1.0" encoding="utf-8"?>
<!-- Renders /rss.xml as a readable page when opened in a browser. Colours are Sirene's tokens (tokens.css), copied
     because this file is standalone. Feed readers ignore it. -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" encoding="utf-8" />
	<xsl:template match="/rss/channel">
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<title>RSS feed · <xsl:value-of select="title" /></title>
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<style>
					:root { color-scheme: light dark; --canvas: #faf4ec; --card: #fffaf3; --ink: #2c1822; --soft: #5a4250; --muted: #745d6a; --rose: #a8435a; --thread: #a37632; --tint: #f3e6dc; }
					@media (prefers-color-scheme: dark) { :root { --canvas: #1b1117; --card: #251820; --ink: #f7ece3; --soft: #dcc7c9; --muted: #ab949d; --rose: #ef94a2; --thread: #c99a4c; --tint: #33212b; } }
					body { margin: 0; background: var(--canvas); color: var(--soft); font: 350 18px/30px Georgia, serif; }
					main { max-width: 680px; margin: 0 auto; padding: 64px 16px; }
					h1, h2 { font-family: "Iowan Old Style", Georgia, serif; font-weight: 500; color: var(--ink); margin: 0; }
					h1 { font-size: 40px; line-height: 48px; letter-spacing: -0.03em; }
					h2 { font-size: 22px; line-height: 30px; }
					a { color: var(--rose); text-decoration-color: var(--thread); text-underline-offset: 5px; }
					a:focus-visible { outline: 2px solid var(--rose); outline-offset: 2px; }
					.note { margin: 24px 0 0; padding: 20px 24px; background: var(--tint); border-radius: 10px; font: 400 16px/26px system-ui, sans-serif; }
					.note code { user-select: all; color: var(--ink); }
					hr { height: 2px; border: 0; margin: 48px 0; background: repeating-linear-gradient(90deg, var(--thread) 0 7px, transparent 7px 12px); }
					ol { list-style: none; padding: 0; margin: 0; display: grid; gap: 32px; }
					p { margin: 8px 0 0; }
					.meta { font: 500 12px/18px system-ui, sans-serif; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
				</style>
			</head>
			<body>
				<main>
					<h1>This is an RSS feed</h1>
					<p class="note">
						Paste this page's address, <code><xsl:value-of select="link" />rss.xml</code>,
						into a feed reader (for example NetNewsWire, Feedly or Inoreader) to get new essays from
						<a href="{link}"><xsl:value-of select="title" /></a> as they're published. No account or email needed.
					</p>
					<hr />
					<ol>
						<xsl:for-each select="item">
							<li>
								<h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
								<p><xsl:value-of select="description" /></p>
								<p class="meta"><xsl:value-of select="substring(pubDate, 6, 11)" /></p>
							</li>
						</xsl:for-each>
					</ol>
				</main>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
