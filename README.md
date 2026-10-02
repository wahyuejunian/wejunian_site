# Website Dosen — Wahyu Eko Junian
Situs statis (tanpa build, tanpa server) untuk GitHub Pages.

## Menambah materi kuliah
Taruh berkas di `materi/<kode-mk>/<nn>/` (nn = 01–16 untuk pertemuan, `umum` untuk RPS/silabus). Kode MK: matdas-1, matdas-2, geomat-1, geomat-2, tepot, inversi, em. Daftar berkas dibuat otomatis oleh GitHub Actions saat push (atau jalankan `python3 tools/build_index.py`).
Nama mata kuliah/topik per pertemuan diatur di `data/courses.json`.

## Menambah ebook
Tulis Markdown (rumus LaTeX didukung: `$..$`, `$$..$$`, `\[..\]`) lalu taruh di `ebook/<id-ebook>/01-judul.md`, `02-….md` (urut nama berkas; judul bab = baris `# …` pertama). Daftarkan ebook baru di `data/ebooks.json`.

## Data realtime dari Google Sheets
1. Buat Google Sheets dengan header kolom persis seperti `data/publications.csv` (judul, link, jurnal, tahun) dan `data/students.csv` (angkatan, nama, judul, link, pembimbing1, pembimbing2, pembimbing3, status). Status: `Lulus` atau `Berjalan`. Kedua berkas CSV itu bisa langsung diimpor (File → Import).
2. Per sheet: File → Share → Publish to web → pilih sheet-nya dan format **CSV** → Publish → salin tautannya.
3. Tempel ke `data/site.json` pada `sheets.penelitian` dan `sheets.mahasiswa`.
Perubahan di sheet muncul di website setelah cache Google (beberapa menit). Jika URL kosong atau gagal dimuat, situs memakai CSV di folder `data/`.

## Deploy
Repo → Settings → Pages → Source: **GitHub Actions**.
