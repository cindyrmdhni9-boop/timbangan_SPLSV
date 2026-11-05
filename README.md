# Timbangan Bintang: Media Pembelajaran PLSV

Media interaktif untuk belajar Persamaan Linear Satu Variabel dengan timbangan, bintang (x), dan bola (+1 / −1). Dibuat dengan HTML, CSS, dan JavaScript murni (tanpa framework).

## Struktur folder

```
timbangan-plsv/
├── index.html      -> kerangka halaman
├── css/style.css   -> tampilan
├── js/app.js       -> logika timbangan
└── README.md
```

Ketiga file harus tetap berada di folder yang sama seperti di atas, karena `index.html` memanggil `css/style.css` dan `js/app.js`.

## Cara membuka di VS Code

1. Ekstrak zip, lalu di VS Code pilih **File → Open Folder** dan buka folder `timbangan-plsv`.
2. Pasang ekstensi **Live Server** (Ritwick Dey) lewat menu Extensions (Ctrl+Shift+X).
3. Klik kanan `index.html`, pilih **Open with Live Server**. Halaman terbuka di browser dan otomatis ter-refresh saat kamu menyimpan perubahan.

Tanpa Live Server, kamu juga bisa langsung klik dua kali `index.html`. Semua fitur tetap jalan.

## Yang perlu kamu ganti

- **Nama dan kelas:** di `index.html`, cari bagian `<section ... id="tentang">`, lalu ganti `cindy,fayya,citra]` dan `[PSPM 24A]`.
- **Contoh soal:** di `js/app.js`, ubah daftar `PRE`. Format `[a, b, c, d]` berarti `ax + b = cx + d`.
- **Warna awal objek:** di `js/app.js`, ubah objek `C`.
- **Batas jumlah objek:** ubah `CAP` di `js/app.js`.
- **Warna tema web:** ubah variabel di bagian `:root` pada `css/style.css`.

## Cara menayangkan ke internet (gratis)

**GitHub Pages**
1. Buat repository baru di GitHub, lalu unggah seluruh isi folder.
2. Buka **Settings → Pages**, pilih branch `main` dan folder `/ (root)`, lalu Save.
3. Tunggu beberapa menit, link web akan muncul di halaman yang sama.

**Netlify**
1. Buka app.netlify.com/drop.
2. Seret folder `timbangan-plsv` ke halaman itu. Link langsung jadi.

## Pemecahan masalah

- **Halaman tampil polos tanpa gaya:** pastikan folder `css` dan `js` ada di samping `index.html`, dan nama file tidak berubah.
- **Font terlihat berbeda saat offline:** normal. Font Fredoka dan Nunito dimuat dari Google Fonts, dan akan memakai font bawaan perangkat bila tidak ada internet.
- **Objek sulit digeser di HP:** area timbangan sengaja tidak bisa di-scroll agar objek bisa diseret. Scroll halaman lewat area di luar timbangan.
- **Gambar karakter tidak muncul:** pastikan file yang dipilih berupa gambar (JPG, PNG, WebP, atau GIF).

## Keaslian karya

Seluruh gambar (timbangan, bintang, bola, maskot) digambar dengan kode SVG buatan sendiri. Satu-satunya sumber luar adalah font Google Fonts (Fredoka dan Nunito) yang berlisensi terbuka (SIL Open Font License). Cantumkan itu di daftar pustaka jika diminta.
