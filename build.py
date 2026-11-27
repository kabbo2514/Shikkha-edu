#!/usr/bin/env python3
"""Inline src/styles.css and src/js/*.js into a single distributable index.html."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FILES = [
    "00-data.js", "10-store.js", "20-ui.js", "30-view-auth.js",
    "40-view-learn.js", "45-view-cq.js", "50-view-social.js",
    "55-view-media.js", "60-view-admin.js", "90-app.js",
]

template = (ROOT / "src/index.template.html").read_text(encoding="utf-8")
styles = (ROOT / "src/styles.css").read_text(encoding="utf-8")
js = "\n\n".join((ROOT / "src/js" / f).read_text(encoding="utf-8") for f in FILES)

out = template.replace("/*__STYLES__*/", styles).replace("/*__APP__*/", js)
(ROOT / "index.html").write_text(out, encoding="utf-8")
print(f"built index.html · {len(out):,} chars · {len(FILES)} js files")
