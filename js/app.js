"use strict";
/* ============================================================
   Timbangan Bintang: logika aplikasi PLSV
   Jenis objek:  x = bintang (+x)   nx = bintang negatif (−x)
                 p = bola +1        n  = bola −1
   Setiap objek di piringan: {id, t (jenis), s ("L"/"R"), x, y}
   (x,y) adalah posisi relatif terhadap titik gantung piringan.
   ============================================================ */

/* ---------- Pengaturan yang boleh kamu ubah ---------- */
var CAP = 48;                         // maksimal objek di seluruh timbangan
var PRE = [                           // contoh soal: [a, b, c, d] untuk ax + b = cx + d
  [1, 3, 0, 7], [1, -2, 0, 5], [2, 0, 0, 10], [2, 3, 0, 11],
  [3, -2, 0, 10], [4, 5, 0, 21], [2, 1, 1, 6]
];
var C = { x: "#f2b134", nx: "#9b5de5", p: "#2f80ed", n: "#e5484d" };  // warna awal

/* ---------- Keadaan (state) ---------- */
var items = [], X = 4, drag = null, deg = 0, uid = 0;
var MOUTH = { "": "M35 64 Q50 76 65 64", ok: "M30 60 Q50 88 70 60 Z", bad: "M36 72 Q50 60 64 72" };

function $(id) { return document.getElementById(id); }
var svg = $("svg");

/* ---------- Fungsi bantu ---------- */
// Menulis ruas persamaan, misalnya sideTxt(2,3) -> "2x + 3"
function sideTxt(a, b) {
  var t = a ? (a === 1 ? "x" : a === -1 ? "−x" : (a < 0 ? "−" + (-a) : a) + "x") : "";
  if (b > 0) t += (a ? " + " : "") + b;
  else if (b < 0) t += (a ? " − " : "−") + (-b);
  return t || "0";
}
function cnt(s, t) { return items.filter(function (i) { return i.s === s && i.t === t; }).length; }
function ab(s) { return { a: cnt(s, "x") - cnt(s, "nx"), b: cnt(s, "p") - cnt(s, "n") }; }
function tot(s) { var v = ab(s); return v.a * X + v.b; }       // berat total sisi s
function ink(h) {                                               // warna teks agar terbaca di atas warna h
  var r = parseInt(h.substr(1, 2), 16), g = parseInt(h.substr(3, 2), 16), b = parseInt(h.substr(5, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? "#1b2b3a" : "#fff";
}
function star(R) {                                              // titik-titik poligon bintang
  var p = [];
  for (var k = 0; k < 10; k++) {
    var a = -Math.PI / 2 + k * Math.PI / 5, r = k % 2 ? R * 0.45 : R;
    p.push((r * Math.cos(a)).toFixed(1) + "," + (r * Math.sin(a) + 1).toFixed(1));
  }
  return p.join(" ");
}

/* ---------- Menggambar objek ---------- */
function it(t, cx, cy, id, sc) {
  var g = '<g class="it" data-id="' + id + '" data-t="' + t + '" transform="translate(' + cx + ',' + cy + ') scale(' + (sc || 1) + ')" style="cursor:grab"><circle r="17" fill="transparent"/>';
  if (t === "x" || t === "nx") {
    g += '<polygon points="' + star(17) + '" fill="' + C[t] + '" stroke="rgba(0,0,0,.3)" stroke-width="1" stroke-linejoin="round"/>';
    if (t === "nx") g += '<text y="6" text-anchor="middle" font-weight="800" font-size="16" fill="' + ink(C.nx) + '">−</text>';
  } else {
    g += '<circle r="12" fill="' + C[t] + '" stroke="rgba(0,0,0,.25)"/><text y="4" text-anchor="middle" font-weight="800" font-size="11" fill="' + ink(C[t]) + '">' + (t === "p" ? "+1" : "−1") + '</text>';
  }
  return g + "</g>";
}
function panHTML(s) {
  var h = '<line x1="0" y1="0" x2="-95" y2="100" stroke="#6f879d" stroke-width="3"/><line x1="0" y1="0" x2="95" y2="100" stroke="#6f879d" stroke-width="3"/><rect x="-105" y="100" width="210" height="12" rx="6" fill="#4d6580"/>';
  items.forEach(function (i) { if (i.s === s) h += it(i.t, i.x, i.y, i.id); });
  return h;
}
function drawTray() {
  $("tray").innerHTML = it("x", 150, 402, "", 1.4) + it("nx", 250, 402, "", 1.4) + it("p", 390, 402, "", 1.4) + it("n", 490, 402, "", 1.4);
}

/* ---------- Timbangan miring ---------- */
function center(s) {                                            // titik gantung piringan saat ini
  var r = deg * Math.PI / 180, d = s === "L" ? -1 : 1;
  return { x: 320 + d * 220 * Math.cos(r), y: 120 + d * 220 * Math.sin(r) };
}
function tilt(diff) {
  deg = -Math.max(-16, Math.min(16, diff * 2.5));
  $("beam").style.transform = "rotate(" + deg + "deg)";
  ["L", "R"].forEach(function (s) {
    var c = center(s);
    $("pan" + s).style.transform = "translate(" + c.x + "px," + c.y + "px)";
  });
}

/* ---------- Pesan & karakter ---------- */
function msg(t, c) {
  $("msg").textContent = t;
  $("msg").className = c || "";
  var m = document.getElementById("mouth");                      // ubah ekspresi maskot bawaan
  if (m) { m.setAttribute("d", MOUTH[c || ""]); m.setAttribute("fill", c === "ok" ? "#fff" : "none"); }
}

/* ---------- Menggambar ulang semuanya ---------- */
function render() {
  $("panL").innerHTML = panHTML("L");
  $("panR").innerHTML = panHTML("R");
  var L = ab("L"), R = ab("R"), diff = tot("L") - tot("R");
  if (Math.abs(diff) < 1e-9) diff = 0;
  tilt(diff);
  $("eq").textContent = sideTxt(L.a, L.b) + " = " + sideTxt(R.a, R.b);
  if (diff !== 0) msg(diff > 0 ? "Timbangan miring ke kiri. Sisi kiri lebih berat." : "Timbangan miring ke kanan. Sisi kanan lebih berat.", "bad");
  else if (L.a === 1 && L.b === 0 && R.a === 0) msg("Hebat! x = " + R.b + ". Bintangnya sudah sendirian dan timbangan seimbang.", "ok");
  else msg(items.length ? "Seimbang! Terus susun sampai bintang sendirian di kiri." : "Seret bintang atau bola dari nampan ke piringan.");
}

/* ---------- Menambah objek ---------- */
function slot(s) {                                              // cari tempat kosong di piringan
  for (var j = 0; j < 40; j++) {
    var sx = -91 + (j % 8) * 26, sy = 84 - Math.floor(j / 8) * 28;
    var used = items.some(function (i) { return i.s === s && Math.abs(i.x - sx) < 22 && Math.abs(i.y - sy) < 22; });
    if (!used) return { x: sx, y: sy };
  }
  return { x: 0, y: 60 };
}
function addItem(t, s, x, y) {
  var p = x == null ? slot(s) : { x: x, y: y };
  items.push({ id: ++uid, t: t, s: s, x: p.x, y: p.y });
}
function rm(s, t) {
  var k = items.findIndex(function (i) { return i.s === s && i.t === t; });
  if (k > -1) items.splice(k, 1);
}

/* ---------- Seret dan lepas ---------- */
function ghostDraw() { $("ghost").innerHTML = drag ? it(drag.t, drag.x, drag.y, "", 1.2) : ""; }
function pt(e) {                                                // koordinat pointer dalam sistem SVG
  var p = svg.createSVGPoint();
  p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}
svg.addEventListener("pointerdown", function (e) {
  var el = e.target.closest(".it");
  if (!el) return;
  e.preventDefault();
  var id = el.dataset.id, t = el.dataset.t;
  if (id) items = items.filter(function (i) { return String(i.id) !== id; });   // angkat objek dari piringan
  var p = pt(e);
  drag = { t: t, x: p.x, y: p.y };
  render(); ghostDraw();
  window.addEventListener("pointermove", mv);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
});
function mv(e) { var p = pt(e); drag.x = p.x; drag.y = p.y; ghostDraw(); }
function up(e) {
  window.removeEventListener("pointermove", mv);
  window.removeEventListener("pointerup", up);
  window.removeEventListener("pointercancel", up);
  var p = pt(e), side = null, c = null;
  ["L", "R"].forEach(function (s) {
    var q = center(s);
    if (Math.abs(p.x - q.x) < 120 && p.y > q.y - 110 && p.y < q.y + 125) { side = s; c = q; }
  });
  if (side) {
    if (items.length >= CAP) { drag = null; ghostDraw(); render(); msg("Piringan sudah penuh. Sederhanakan dulu.", "bad"); return; }
    addItem(drag.t, side, Math.max(-90, Math.min(90, p.x - c.x)), Math.max(-10, Math.min(84, p.y - c.y)));
  }
  drag = null; ghostDraw(); render();                            // lepas di luar piringan = terhapus
}

/* ---------- Tombol operasi ---------- */
function zero() {                                               // buang pasangan +1/−1 dan x/−x
  ["L", "R"].forEach(function (s) {
    [["p", "n"], ["x", "nx"]].forEach(function (pr) {
      while (cnt(s, pr[0]) > 0 && cnt(s, pr[1]) > 0) { rm(s, pr[0]); rm(s, pr[1]); }
    });
  });
}
$("zero").onclick = function () { zero(); render(); };
$("clear").onclick = function () { items = []; render(); };
$("tidy").onclick = function () {
  var old = items; items = [];
  ["L", "R"].forEach(function (s) {
    ["x", "nx", "p", "n"].forEach(function (t) { old.forEach(function (i) { if (i.s === s && i.t === t) addItem(t, s); }); });
  });
  render();
};
$("mul").onclick = function () {
  var n = +$("n").value;
  if (!(n >= 2 && n <= 10)) { msg("Isi angka antara 2 sampai 10.", "bad"); return; }
  if (items.length * n > CAP) { msg("Hasil kali terlalu banyak untuk piringan. Sederhanakan dulu.", "bad"); return; }
  var copy = items.slice();
  for (var k = 1; k < n; k++) copy.forEach(function (i) { addItem(i.t, i.s); });
  render();
};
$("div").onclick = function () {
  var n = +$("n").value;
  if (!(n >= 2 && n <= 10)) { msg("Isi angka antara 2 sampai 10.", "bad"); return; }
  zero();
  var ok = true;
  ["L", "R"].forEach(function (s) { ["x", "nx", "p", "n"].forEach(function (t) { if (cnt(s, t) % n) ok = false; }); });
  if (!ok) { render(); msg("Tidak bisa dibagi " + n + " secara merata. Coba angka lain.", "bad"); return; }
  var seen = {}, out = [];
  items.forEach(function (i) {
    var k = i.s + i.t; seen[k] = (seen[k] || 0) + 1;
    if (seen[k] <= cnt(i.s, i.t) / n) out.push(i);
  });
  items = out; render();
};

/* ---------- Membuat soal ---------- */
function build() {
  var a = Math.round(+$("qa").value), b = Math.round(+$("qb").value),
      c = Math.round(+$("qc").value), d = Math.round(+$("qd").value);
  if ([a, b, c, d].some(isNaN)) { msg("Isi keempat kotak dengan angka.", "bad"); return; }
  if (Math.abs(a) + Math.abs(b) + Math.abs(c) + Math.abs(d) > CAP) {
    msg("Angka terlalu besar. Jumlah semua angka (tanpa tanda) maksimal " + CAP + ".", "bad"); return;
  }
  items = [];
  function fill(s, k, u) {
    var i;
    for (i = 0; i < Math.abs(k); i++) addItem(k > 0 ? "x" : "nx", s);
    for (i = 0; i < Math.abs(u); i++) addItem(u > 0 ? "p" : "n", s);
  }
  fill("L", a, b); fill("R", c, d);
  if (a !== c) X = (d - b) / (a - c);                            // nilai x supaya timbangan seimbang
  render();
  if (a === c) msg("Banyak x di kedua sisi sama, jadi soal ini tidak punya satu jawaban tunggal.", "bad");
  else if (X <= 0 || X !== Math.round(X)) msg("Jawaban soal ini bukan bilangan bulat positif, jadi timbangan memakai x = " + X.toFixed(2) + ".", "bad");
}
$("build").onclick = build;
$("lvl").onchange = function () {
  var p = PRE[+this.value];
  ["qa", "qb", "qc", "qd"].forEach(function (id, i) { $(id).value = p[i]; });
  build();
};
$("show").onchange = function () { if (this.checked) msg("Kunci jawaban: x = " + X + "."); else render(); };
PRE.forEach(function (p, i) {
  var o = document.createElement("option");
  o.value = i; o.textContent = (i + 1) + ". " + sideTxt(p[0], p[1]) + " = " + sideTxt(p[2], p[3]);
  $("lvl").appendChild(o);
});

/* ---------- Warna objek ---------- */
["x", "nx", "p", "n"].forEach(function (t) {
  var el = $("c_" + t);
  el.value = C[t];
  el.oninput = function () { C[t] = el.value; drawTray(); render(); };
});

/* ---------- Karakter (maskot bawaan atau gambar unggahan) ---------- */
var DEF = '<svg viewBox="0 0 100 100" aria-label="Karakter maskot"><line x1="50" y1="22" x2="50" y2="10" stroke="#2b3f55" stroke-width="3"/>' +
  '<polygon points="' + star(9).split(" ").map(function (q) { var a = q.split(","); return (+a[0] + 50) + "," + (+a[1] + 8); }).join(" ") + '" fill="#f2b134"/>' +
  '<ellipse cx="50" cy="60" rx="38" ry="34" fill="#7bd3c4" stroke="#2b3f55" stroke-width="3"/>' +
  '<circle cx="37" cy="52" r="6" fill="#1b2b3a"/><circle cx="63" cy="52" r="6" fill="#1b2b3a"/>' +
  '<circle cx="39" cy="50" r="2" fill="#fff"/><circle cx="65" cy="50" r="2" fill="#fff"/>' +
  '<circle cx="27" cy="64" r="5" fill="#ff9aa2" opacity=".7"/><circle cx="73" cy="64" r="5" fill="#ff9aa2" opacity=".7"/>' +
  '<path id="mouth" d="' + MOUTH[""] + '" fill="none" stroke="#1b2b3a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function defChar() { $("mas").innerHTML = DEF; render(); }
$("defchar").onclick = defChar;
$("up").onchange = function () {
  var f = this.files[0];
  if (!f) return;
  if (!/^image\//.test(f.type)) { msg("File harus berupa gambar.", "bad"); return; }
  var r = new FileReader();
  r.onload = function () {
    var im = new Image();
    im.alt = "Karakter buatanmu"; im.src = r.result;
    $("mas").innerHTML = ""; $("mas").appendChild(im);
  };
  r.readAsDataURL(f);
};

/* ---------- Mulai ---------- */
drawTray();
defChar();
build();
