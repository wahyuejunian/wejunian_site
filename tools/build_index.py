"""Memindai folder materi/ dan ebook/ lalu menulis data/files.json.
Jalankan: python3 tools/build_index.py  (GitHub Actions menjalankannya otomatis saat push)"""
import json, os, re
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ls = lambda d: sorted(x for x in os.listdir(d) if not x.startswith('.')) if os.path.isdir(d) else []
out = {"materi": {}, "bab": {}}
for c in ls(f"{R}/materi"):
    out["materi"][c] = {k: [{"n": f, "p": f"materi/{c}/{k}/{f}"} for f in ls(f"{R}/materi/{c}/{k}") if os.path.isfile(f"{R}/materi/{c}/{k}/{f}")] for k in ls(f"{R}/materi/{c}")}
for b in ls(f"{R}/ebook"):
    out["bab"][b] = []
    for f in ls(f"{R}/ebook/{b}"):
        if f.endswith(".md"):
            m = re.search(r"^#\s+(.+)$", open(f"{R}/ebook/{b}/{f}", encoding="utf8").read(), re.M)
            out["bab"][b].append({"judul": m.group(1).strip() if m else f, "file": f"ebook/{b}/{f}"})
json.dump(out, open(f"{R}/data/files.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("OK:", sum(len(v) for c in out["materi"].values() for v in c.values()), "berkas materi,", sum(map(len, out["bab"].values())), "bab ebook")
