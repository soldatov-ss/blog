# CodeBlock

Code on a `surface-card` with a `hairline` frame and a filename bar seamed off by a dashed `thread` line.

- **Markup:** `<figure class="sr-code"><div class="sr-code__bar">file · language</div><pre>…</pre></figure>`.
- Syntax colours (map your highlighter's classes): keywords `.k` `teal` bold, strings `.s` `rose`, functions `.f` `gold`, comments `.c` `ink-muted` italic, the rest `ink`. All pass 4.5:1 on `surface-card` in both themes.
- Inline code: plain `<code>` inside `.sr` gets a `surface-tint` chip.
