/* ============================================================
   TABUNGANKU - app.js
   Full Application Logic
   ============================================================ */

// ============================================================
// DATA STORE
// ============================================================
const DB_KEY = 'tabunganku_v1';
let db = {
    user: { nama: 'Admin Demo', email: 'admin@tabunganku.com', telp: '081234567890', since: '2025' },
    transaksi: [],
    tabungan: [],
    anggaran: [],
    nextId: 1
};

// ============================================================
// AUTH (Login Page)
// ============================================================
function doLogin() {
    const email = (document.getElementById('email') || {}).value || '';
    const pass = (document.getElementById('password') || {}).value || '';
    const alert = document.getElementById('login-alert');
    if (!email || !pass) {
        showAlert(alert, 'Email dan password wajib diisi.', 'error'); return;
    }
    if (email.length < 3 || pass.length < 3) {
        showAlert(alert, 'Email atau password salah.', 'error'); return;
    }
    // Simulate login
    localStorage.setItem('tk_logged', '1');
    localStorage.setItem('tk_user', email);
    showAlert(alert, 'Login berhasil! Mengalihkan...', 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 900);
}

function demoLogin() {
    localStorage.setItem('tk_logged', '1');
    localStorage.setItem('tk_user', 'demo');
    loadDemoData();
    window.location.href = 'index.html';
}

function doLogout() {
    if (confirm('Yakin ingin keluar?')) {
        localStorage.removeItem('tk_logged');
        window.location.href = 'login.html';
    }
}

function togglePassword() {
    const inp = document.getElementById('password');
    const icon = document.getElementById('eye-icon');
    if (!inp) return;
    if (inp.type === 'password') {
        inp.type = 'text';
        icon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    } else {
        inp.type = 'password';
        icon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>`;
    }
}

function showAlert(el, msg, type) {
    if (!el) return;
    el.className = `alert alert-${type}`;
    el.textContent = msg;
    el.classList.remove('hidden');
}

// Auth guard for index.html
function checkAuth() {
    if (!localStorage.getItem('tk_logged')) {
        window.location.href = 'login.html';
    }
}

// ============================================================
// LOCAL STORAGE
// ============================================================
function saveDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function loadDB() {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
        try { db = JSON.parse(raw); } catch (e) { /* use default */ }
    }
}

function loadDemoData() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    db.transaksi = [
        { id: 1, tipe: 'masuk', ket: 'Gaji Bulan Ini', kat: 'Gaji', jumlah: 8000000, tgl: `${y}-${m}-01`, catatan: '' },
        { id: 2, tipe: 'keluar', ket: 'Belanja Bulanan', kat: 'Belanja', jumlah: 1200000, tgl: `${y}-${m}-03`, catatan: '' },
        { id: 3, tipe: 'keluar', ket: 'Listrik & Air', kat: 'Tagihan', jumlah: 450000, tgl: `${y}-${m}-05`, catatan: '' },
        { id: 4, tipe: 'keluar', ket: 'Makan Siang', kat: 'Makanan', jumlah: 85000, tgl: `${y}-${m}-06`, catatan: '' },
        { id: 5, tipe: 'masuk', ket: 'Freelance Design', kat: 'Bisnis', jumlah: 2500000, tgl: `${y}-${m}-08`, catatan: '' },
        { id: 6, tipe: 'keluar', ket: 'Transportasi Ojek', kat: 'Transportasi', jumlah: 120000, tgl: `${y}-${m}-09`, catatan: '' },
        { id: 7, tipe: 'keluar', ket: 'Nonton Bioskop', kat: 'Hiburan', jumlah: 75000, tgl: `${y}-${m}-10`, catatan: '' },
        { id: 8, tipe: 'keluar', ket: 'Kursus Online', kat: 'Pendidikan', jumlah: 300000, tgl: `${y}-${m}-11`, catatan: '' },
    ];
    db.tabungan = [
        { id: 1, nama: 'Beli Laptop Baru', emoji: '', target: 12000000, terkumpul: 4500000, deadline: `${y}-12-31` },
        { id: 2, nama: 'Liburan Keluarga', emoji: '', target: 20000000, terkumpul: 8000000, deadline: `${y + 1}-06-30` },
        { id: 3, nama: 'Dana Darurat', emoji: '', target: 30000000, terkumpul: 30000000, deadline: `${y}-06-30` },
    ];
    db.anggaran = [
        { id: 1, kat: 'Makanan', batas: 1500000, bulan: `${y}-${m}` },
        { id: 2, kat: 'Transportasi', batas: 500000, bulan: `${y}-${m}` },
        { id: 3, kat: 'Hiburan', batas: 300000, bulan: `${y}-${m}` },
        { id: 4, kat: 'Tagihan', batas: 600000, bulan: `${y}-${m}` },
    ];
    db.nextId = 20;
    saveDB();
}

// ============================================================
// NAVIGATION
// ============================================================
let currentPage = 'dashboard';

function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.bn-item').forEach(n => n.classList.remove('active'));

    // Show target page
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');

    // Highlight nav
    document.querySelectorAll(`[data-page="${page}"]`).forEach(n => n.classList.add('active'));

    currentPage = page;
    closeSidebar();

    // Render page content
    if (page === 'dashboard') renderDashboard();
    if (page === 'transaksi') renderTransaksi();
    if (page === 'tabungan') renderTabungan();
    if (page === 'anggaran') renderAnggaran();
    if (page === 'laporan') renderLaporan();
    if (page === 'profil') renderProfil();
}

// ============================================================
// SIDEBAR
// ============================================================
function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
}

// ============================================================
// MODALS
// ============================================================
function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('hidden');
    // Defaults
    if (id === 'modal-transaksi') {
        document.getElementById('transTgl').value = todayISO();
        document.getElementById('editTransId').value = '';
        document.getElementById('modalTransTitle').textContent = 'Tambah Transaksi';
        setTransType('masuk');
        clearFields(['transJumlah', 'transKet', 'transCatatan']);
        document.getElementById('transKat').value = '';
    }
    if (id === 'modal-tabungan') {
        document.getElementById('editTabId').value = '';
        document.getElementById('modalTabTitle').textContent = 'Buat Target Tabungan';
        clearFields(['tabNama', 'tabTarget', 'tabTerkumpul', 'tabDeadline']);
        selectEmoji(document.querySelector('.emoji-opt'), '');
    }
    if (id === 'modal-anggaran') {
        document.getElementById('editAngId').value = '';
        document.getElementById('angBulan').value = currentMonthISO();
        clearFields(['angBatas']);
    }
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add('hidden');
}

function clearFields(ids) {
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
}

// ============================================================
// TRANSAKSI
// ============================================================
let activeTransFilter = 'semua';

function setTransType(type) {
    const btnMasuk = document.getElementById('typeMasuk');
    const btnKeluar = document.getElementById('typeKeluar');
    btnMasuk.classList.toggle('active', type === 'masuk');
    btnKeluar.classList.toggle('active', type === 'keluar');
    btnMasuk.classList.toggle('masuk-active', type === 'masuk');
    btnKeluar.classList.toggle('keluar-active', type === 'keluar');
    btnMasuk.dataset.type = 'masuk';
    btnKeluar.dataset.type = 'keluar';
}

function getTransType() {
    return document.getElementById('typeMasuk').classList.contains('active') ? 'masuk' : 'keluar';
}

function saveTransaksi() {
    const jumlah = parseFloat(document.getElementById('transJumlah').value);
    const ket = document.getElementById('transKet').value.trim();
    const kat = document.getElementById('transKat').value;
    const tgl = document.getElementById('transTgl').value;
    const catatan = document.getElementById('transCatatan').value.trim();
    const tipe = getTransType();
    const editId = document.getElementById('editTransId').value;

    if (!jumlah || jumlah <= 0) { showToast('Jumlah harus lebih dari 0', 'error'); return; }
    if (!ket) { showToast('Keterangan wajib diisi', 'error'); return; }
    if (!kat) { showToast('Pilih kategori', 'error'); return; }
    if (!tgl) { showToast('Tanggal wajib diisi', 'error'); return; }

    if (editId) {
        const idx = db.transaksi.findIndex(t => t.id == editId);
        if (idx > -1) db.transaksi[idx] = { id: parseInt(editId), tipe, ket, kat, jumlah, tgl, catatan };
        showToast('Transaksi diperbarui');
    } else {
        db.transaksi.unshift({ id: db.nextId++, tipe, ket, kat, jumlah, tgl, catatan });
        showToast('Transaksi ditambahkan');
    }
    saveDB();
    closeModal('modal-transaksi');
    if (currentPage === 'transaksi') renderTransaksi();
    if (currentPage === 'dashboard') renderDashboard();
    checkAnggaranAlert();
}

function editTransaksi(id) {
    const t = db.transaksi.find(t => t.id === id);
    if (!t) return;
    openModal('modal-transaksi');
    document.getElementById('editTransId').value = t.id;
    document.getElementById('modalTransTitle').textContent = 'Edit Transaksi';
    setTransType(t.tipe);
    document.getElementById('transJumlah').value = t.jumlah;
    document.getElementById('transKet').value = t.ket;
    document.getElementById('transKat').value = t.kat;
    document.getElementById('transTgl').value = t.tgl;
    document.getElementById('transCatatan').value = t.catatan || '';
}

function deleteTransaksi(id) {
    if (!confirm('Hapus transaksi ini?')) return;
    db.transaksi = db.transaksi.filter(t => t.id !== id);
    saveDB();
    showToast('Transaksi dihapus');
    if (currentPage === 'transaksi') renderTransaksi();
    if (currentPage === 'dashboard') renderDashboard();
}

function filterTrans(type, el) {
    activeTransFilter = type;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderTransaksi();
}

function renderTransaksi() {
    const listEl = document.getElementById('transaksiList');
    if (!listEl) return;

    const filterMonth = document.getElementById('filterMonth').value;
    const search = (document.getElementById('searchTrans').value || '').toLowerCase();

    let list = db.transaksi.filter(t => {
        if (activeTransFilter !== 'semua' && t.tipe !== activeTransFilter) return false;
        if (filterMonth && !t.tgl.startsWith(filterMonth)) return false;
        if (search && !t.ket.toLowerCase().includes(search) && !t.kat.toLowerCase().includes(search)) return false;
        return true;
    });

    if (list.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#92BDF9" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="#92BDF9" stroke-width="2" stroke-linecap="round"/></svg><p>Tidak ada transaksi ditemukan.</p></div>`;
        return;
    }

    // const catIcons = { Gaji: '💰', Bisnis: '🏢', Investasi: '📈', Bonus: '🎁', Makanan: '🍔', Transportasi: '🚌', Belanja: '🛒', Tagihan: '⚡', Kesehatan: '💊', Hiburan: '🎬', Pendidikan: '📚', Lainnya: '📌' };

    listEl.innerHTML = list.map(t => `
    <div class="trans-item">
      <div class="trans-icon ${t.tipe}">${catIcons[t.kat] || ''}</div>
      <div class="trans-info">
        <div class="trans-ket">${escHtml(t.ket)}</div>
        <div class="trans-meta">${escHtml(t.kat)} ${t.catatan ? '· ' + escHtml(t.catatan) : ''}</div>
      </div>
      <div class="trans-right">
        <div class="trans-amt ${t.tipe}">${t.tipe === 'masuk' ? '+' : '-'}${formatRp(t.jumlah)}</div>
        <div class="trans-tgl">${formatDate(t.tgl)}</div>
      </div>
      <div class="trans-actions">
        <button class="icon-btn icon-btn-edit" onclick="editTransaksi(${t.id})" title="Edit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
        <button class="icon-btn icon-btn-del" onclick="deleteTransaksi(${t.id})" title="Hapus">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2"/></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// TARGET TABUNGAN
// ============================================================
let selectedEmoji = '';

function selectEmoji(el, emoji) {
    document.querySelectorAll('.emoji-opt').forEach(e => e.classList.remove('active'));
    el.classList.add('active');
    selectedEmoji = emoji;
    document.getElementById('tabEmoji').value = emoji;
}

function saveTabungan() {
    const nama = document.getElementById('tabNama').value.trim();
    const target = parseFloat(document.getElementById('tabTarget').value);
    const terkumpul = parseFloat(document.getElementById('tabTerkumpul').value) || 0;
    const deadline = document.getElementById('tabDeadline').value;
    const emoji = document.getElementById('tabEmoji').value || '';
    const editId = document.getElementById('editTabId').value;

    if (!nama) { showToast('Nama target wajib diisi', 'error'); return; }
    if (!target || target <= 0) { showToast('Target jumlah harus lebih dari 0', 'error'); return; }

    if (editId) {
        const idx = db.tabungan.findIndex(t => t.id == editId);
        if (idx > -1) db.tabungan[idx] = { id: parseInt(editId), nama, emoji, target, terkumpul, deadline };
        showToast('Target diperbarui');
    } else {
        db.tabungan.push({ id: db.nextId++, nama, emoji, target, terkumpul, deadline });
        showToast('Target ditambahkan');
    }
    saveDB();
    closeModal('modal-tabungan');
    renderTabungan();
    updateBadges();
}

function editTabungan(id) {
    const t = db.tabungan.find(t => t.id === id);
    if (!t) return;
    openModal('modal-tabungan');
    document.getElementById('editTabId').value = t.id;
    document.getElementById('modalTabTitle').textContent = 'Edit Target';
    document.getElementById('tabNama').value = t.nama;
    document.getElementById('tabTarget').value = t.target;
    document.getElementById('tabTerkumpul').value = t.terkumpul;
    document.getElementById('tabDeadline').value = t.deadline || '';
    selectEmoji(
        document.querySelector(`.emoji-opt[onclick*="${t.emoji}"]`) || document.querySelector('.emoji-opt'),
        t.emoji
    );
}

function deleteTabungan(id) {
    if (!confirm('Hapus target ini?')) return;
    db.tabungan = db.tabungan.filter(t => t.id !== id);
    saveDB();
    showToast('Target dihapus');
    renderTabungan();
    updateBadges();
}

function openSetor(id) {
    const t = db.tabungan.find(t => t.id === id);
    if (!t) return;
    document.getElementById('setorTabId').value = id;
    document.getElementById('setorTabNama').textContent = t.emoji + ' ' + t.nama;
    document.getElementById('setorJumlah').value = '';
    document.getElementById('modal-setor').classList.remove('hidden');
}

function doSetor() {
    const id = parseInt(document.getElementById('setorTabId').value);
    const jumlah = parseFloat(document.getElementById('setorJumlah').value);
    if (!jumlah || jumlah <= 0) { showToast('Jumlah setor harus lebih dari 0', 'error'); return; }
    const idx = db.tabungan.findIndex(t => t.id === id);
    if (idx === -1) return;
    db.tabungan[idx].terkumpul += jumlah;
    if (db.tabungan[idx].terkumpul > db.tabungan[idx].target) db.tabungan[idx].terkumpul = db.tabungan[idx].target;
    saveDB();
    showToast('Setoran berhasil!');
    closeModal('modal-setor');
    renderTabungan();
    if (currentPage === 'dashboard') renderDashboard();
}

function renderTabungan() {
    const grid = document.getElementById('tabunganGrid');
    if (!grid) return;
    if (db.tabungan.length === 0) {
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><svg width="56" height="56" viewBox="0 0 24 24" fill="none"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7 7-7z" stroke="#92BDF9" stroke-width="1.5"/></svg><p>Belum ada target tabungan.<br/>Buat target pertama Anda sekarang!</p></div>`;
        return;
    }
    const today = new Date();
    grid.innerHTML = db.tabungan.map(t => {
        const pct = Math.min(100, Math.round((t.terkumpul / t.target) * 100));
        const done = t.terkumpul >= t.target;
        const late = t.deadline && new Date(t.deadline) < today && !done;
        const badge = done ? '<span class="tc-badge tercapai">✓ Tercapai</span>' : late ? '<span class="tc-badge terlambat">Terlambat</span>' : '<span class="tc-badge aktif">Aktif</span>';
        const deadlineText = t.deadline ? `Target: ${formatDate(t.deadline)}` : 'Tanpa deadline';
        return `
    <div class="target-card ${done ? 'completed' : ''}">
      <div class="tc-header">
        <div class="tc-title">
          <div class="tc-emoji">${t.emoji}</div>
          <div>
            <div class="tc-name">${escHtml(t.nama)}</div>
            <div class="tc-deadline">${deadlineText}</div>
          </div>
        </div>
        ${badge}
      </div>
      <div class="tc-amounts">
        <div class="tc-collected">${formatRp(t.terkumpul)}</div>
        <div class="tc-target">dari ${formatRp(t.target)}</div>
      </div>
      <div class="tc-progress-wrap">
        <div class="tc-progress-bar">
          <div class="tc-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="tc-pct-text">${pct}% terkumpul</div>
      </div>
      <div class="tc-footer">
        ${!done ? `<button class="btn-primary" onclick="openSetor(${t.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>Setor</button>` : '<div></div>'}
        <button class="btn-outline" onclick="editTabungan(${t.id})">Edit</button>
        <button class="icon-btn icon-btn-del" onclick="deleteTabungan(${t.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
      </div>
    </div>`;
    }).join('');
}

// ============================================================
// ANGGARAN
// ============================================================
function saveAnggaran() {
    const kat = document.getElementById('angKat').value;
    const batas = parseFloat(document.getElementById('angBatas').value);
    const bulan = document.getElementById('angBulan').value;
    const editId = document.getElementById('editAngId').value;

    if (!batas || batas <= 0) { showToast('Batas anggaran harus lebih dari 0', 'error'); return; }
    if (!bulan) { showToast('Pilih bulan', 'error'); return; }

    if (editId) {
        const idx = db.anggaran.findIndex(a => a.id == editId);
        if (idx > -1) db.anggaran[idx] = { id: parseInt(editId), kat, batas, bulan };
        showToast('Anggaran diperbarui');
    } else {
        db.anggaran.push({ id: db.nextId++, kat, batas, bulan });
        showToast('Anggaran ditambahkan');
    }
    saveDB();
    closeModal('modal-anggaran');
    renderAnggaran();
}

function editAnggaran(id) {
    const a = db.anggaran.find(a => a.id === id);
    if (!a) return;
    openModal('modal-anggaran');
    document.getElementById('editAngId').value = a.id;
    document.getElementById('angKat').value = a.kat;
    document.getElementById('angBatas').value = a.batas;
    document.getElementById('angBulan').value = a.bulan;
}

function deleteAnggaran(id) {
    if (!confirm('Hapus anggaran ini?')) return;
    db.anggaran = db.anggaran.filter(a => a.id !== id);
    saveDB();
    showToast('Anggaran dihapus');
    renderAnggaran();
}

function getSpentByKat(kat, bulan) {
    return db.transaksi
        .filter(t => t.tipe === 'keluar' && t.kat === kat && t.tgl.startsWith(bulan))
        .reduce((s, t) => s + t.jumlah, 0);
}

// const catIcons2 = { Makanan: '🍔', Transportasi: '🚌', Belanja: '🛒', Tagihan: '⚡', Kesehatan: '💊', Hiburan: '🎬', Pendidikan: '📚', Lainnya: '📌' };

function renderAnggaran() {
    const listEl = document.getElementById('anggaranList');
    if (!listEl) return;
    if (db.anggaran.length === 0) {
        listEl.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none"><line x1="12" y1="1" x2="12" y2="23" stroke="#92BDF9" stroke-width="1.5" stroke-linecap="round"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="#92BDF9" stroke-width="1.5" stroke-linecap="round"/></svg><p>Belum ada anggaran. Buat anggaran untuk mengontrol pengeluaran Anda!</p></div>`;
        return;
    }
    listEl.innerHTML = db.anggaran.map(a => {
        const spent = getSpentByKat(a.kat, a.bulan);
        const pct = Math.min(100, Math.round((spent / a.batas) * 100));
        const sisa = a.batas - spent;
        const isOver = spent > a.batas;
        const isWarning = pct >= 75 && !isOver;
        const fillClass = isOver ? 'over' : isWarning ? 'warning' : '';
        const [yyyy, mm] = a.bulan.split('-');
        const bulanNama = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][parseInt(mm) - 1];
        return `
    <div class="anggaran-item">
      <div class="ai-header">
        <div class="ai-cat">
          <div class="ai-cat-icon">${catIcons2[a.kat] || ''}</div>
          <div>
            <div class="ai-cat-name">${a.kat}</div>
            <div class="ai-cat-period">${bulanNama} ${yyyy}</div>
          </div>
        </div>
        <div class="ai-right">
          <div class="ai-batas">${formatRp(a.batas)}</div>
          <div class="ai-sisa ${isOver ? 'over' : ''}">${isOver ? '⚠ Melebihi ' + formatRp(Math.abs(sisa)) : 'Sisa: ' + formatRp(sisa)}</div>
        </div>
      </div>
      <div class="ai-progress"><div class="ai-progress-fill ${fillClass}" style="width:${pct}%"></div></div>
      <div class="ai-footer">
        <span>Terpakai: ${formatRp(spent)} (${pct}%)</span>
        <div style="display:flex;gap:8px">
          <button class="icon-btn icon-btn-edit" onclick="editAnggaran(${a.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
          <button class="icon-btn icon-btn-del" onclick="deleteAnggaran(${a.id})"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2"/><path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>
        </div>
      </div>
    </div>`;
    }).join('');
}

function checkAnggaranAlert() {
    const m = currentMonthISO();
    db.anggaran.forEach(a => {
        if (a.bulan !== m) return;
        const spent = getSpentByKat(a.kat, m);
        if (spent > a.batas) addNotif(`⚠️ Anggaran ${a.kat} melebihi batas! (${formatRp(spent)} / ${formatRp(a.batas)})`);
    });
}

// ============================================================
// LAPORAN
// ============================================================
let pieChartInstance = null;

function renderLaporan() {
    const bulan = parseInt(document.getElementById('laporanBulan').value);
    const tahun = document.getElementById('laporanTahun').value;

    let list = db.transaksi.filter(t => {
        const d = new Date(t.tgl);
        if (d.getFullYear() != tahun) return false;
        if (bulan > 0 && (d.getMonth() + 1) !== bulan) return false;
        return true;
    });

    const totalMasuk = list.filter(t => t.tipe === 'masuk').reduce((s, t) => s + t.jumlah, 0);
    const totalKeluar = list.filter(t => t.tipe === 'keluar').reduce((s, t) => s + t.jumlah, 0);
    const net = totalMasuk - totalKeluar;

    document.getElementById('laporanSummary').innerHTML = `
    <div class="ls-card"><div class="ls-label">Total Pemasukan</div><div class="ls-value masuk">${formatRp(totalMasuk)}</div></div>
    <div class="ls-card"><div class="ls-label">Total Pengeluaran</div><div class="ls-value keluar">${formatRp(totalKeluar)}</div></div>
    <div class="ls-card"><div class="ls-label">Selisih Bersih</div><div class="ls-value net ${net >= 0 ? '' : 'keluar'}">${net >= 0 ? '+' : '-'}${formatRp(Math.abs(net))}</div></div>
  `;

    // Pie chart
    const keluarByKat = {};
    list.filter(t => t.tipe === 'keluar').forEach(t => { keluarByKat[t.kat] = (keluarByKat[t.kat] || 0) + t.jumlah; });
    const pieLabels = Object.keys(keluarByKat);
    const pieData = Object.values(keluarByKat);
    const pieColors = ['#1941BA', '#316FF6', '#92BDF9', '#04125c', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

    const pieCanvas = document.getElementById('pieChart');
    if (pieCanvas) {
        if (pieChartInstance) pieChartInstance.destroy();
        if (pieLabels.length > 0) {
            pieChartInstance = new Chart(pieCanvas, {
                type: 'doughnut',
                data: {
                    labels: pieLabels,
                    datasets: [{ data: pieData, backgroundColor: pieColors, borderWidth: 0, hoverOffset: 6 }]
                },
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'right', labels: { font: { family: 'Arial', size: 11 }, color: '#04125c', padding: 12 } },
                        tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${formatRp(ctx.raw)}` } }
                    },
                    cutout: '60%'
                }
            });
        } else {
            pieChartInstance = new Chart(pieCanvas, {
                type: 'doughnut',
                data: { labels: ['Tidak ada data'], datasets: [{ data: [1], backgroundColor: ['#e0e7ff'], borderWidth: 0 }] },
                options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
            });
        }
    }

    // Table
    const tbody = document.getElementById('laporanTableBody');
    if (tbody) {
        if (list.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:#6b7cb5">Tidak ada transaksi.</td></tr>';
        } else {
            tbody.innerHTML = list.map(t => `
        <tr>
          <td>${formatDate(t.tgl)}</td>
          <td>${escHtml(t.ket)}</td>
          <td>${escHtml(t.kat)}</td>
          <td><span class="badge-${t.tipe}">${t.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}</span></td>
          <td style="font-weight:700;color:${t.tipe === 'masuk' ? '#22c55e' : '#ef4444'}">${t.tipe === 'masuk' ? '+' : '-'}${formatRp(t.jumlah)}</td>
        </tr>
      `).join('');
        }
    }
}

function printReport() {
    window.print();
}

// ============================================================
// DASHBOARD
// ============================================================
let finChartInstance = null;

function renderDashboard() {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const mStr = String(m + 1).padStart(2, '0');
    const thisMonth = `${y}-${mStr}`;

    const allMasuk = db.transaksi.filter(t => t.tipe === 'masuk').reduce((s, t) => s + t.jumlah, 0);
    const allKeluar = db.transaksi.filter(t => t.tipe === 'keluar').reduce((s, t) => s + t.jumlah, 0);
    const monthMasuk = db.transaksi.filter(t => t.tipe === 'masuk' && t.tgl.startsWith(thisMonth)).reduce((s, t) => s + t.jumlah, 0);
    const monthKeluar = db.transaksi.filter(t => t.tipe === 'keluar' && t.tgl.startsWith(thisMonth)).reduce((s, t) => s + t.jumlah, 0);
    const saldo = allMasuk - allKeluar;
    const totalTab = db.tabungan.reduce((s, t) => s + t.terkumpul, 0);

    document.getElementById('totalSaldo').textContent = formatRp(saldo);
    document.getElementById('totalMasuk').textContent = formatRp(monthMasuk);
    document.getElementById('totalKeluar').textContent = formatRp(monthKeluar);
    document.getElementById('totalTabungan').textContent = formatRp(totalTab);

    document.getElementById('masukChange').textContent = `Bulan ${bulanNama(m + 1)}`;
    document.getElementById('keluarChange').textContent = `Bulan ${bulanNama(m + 1)}`;
    document.getElementById('tabunganChange').textContent = `${db.tabungan.length} target aktif`;

    // Greeting
    const h = now.getHours();
    const greeting = h < 11 ? 'Selamat Pagi' : h < 15 ? 'Selamat Siang' : h < 18 ? 'Selamat Sore' : 'Selamat Malam';
    document.getElementById('greetingTitle').textContent = greeting + '! ';
    document.getElementById('greetingName').textContent = `Semoga hari ${db.user.nama} menyenangkan `;

    // Top spending
    const spendByKat = {};
    db.transaksi.filter(t => t.tipe === 'keluar' && t.tgl.startsWith(thisMonth)).forEach(t => { spendByKat[t.kat] = (spendByKat[t.kat] || 0) + t.jumlah; });
    const sortedSpend = Object.entries(spendByKat).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const topList = document.getElementById('topSpendingList');
    if (topList) {
        topList.innerHTML = sortedSpend.length > 0
            ? sortedSpend.map(([k, v]) => `<div class="qs-item"><div class="qs-item-cat"><div class="qs-cat-dot"></div>${k}</div><div class="qs-item-amt">${formatRp(v)}</div></div>`).join('')
            : '<div class="qs-empty">Belum ada pengeluaran bulan ini</div>';
    }

    // Quick targets
    const qtList = document.getElementById('quickTargetList');
    if (qtList) {
        if (db.tabungan.length === 0) {
            qtList.innerHTML = '<div class="qs-empty">Belum ada target</div>';
        } else {
            qtList.innerHTML = db.tabungan.slice(0, 3).map(t => {
                const pct = Math.min(100, Math.round((t.terkumpul / t.target) * 100));
                return `<div class="qt-item"><div class="qt-header"><span class="qt-name">${t.emoji} ${t.nama}</span><span class="qt-pct">${pct}%</span></div><div class="qt-bar"><div class="qt-fill" style="width:${pct}%"></div></div></div>`;
            }).join('');
        }
    }

    // Recent transactions
    const recentEl = document.getElementById('recentTransList');
    if (recentEl) {
        const recent = db.transaksi.slice(0, 5);
        if (recent.length === 0) {
            recentEl.innerHTML = `<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="#92BDF9" stroke-width="1.5"/><rect x="9" y="3" width="6" height="4" rx="1" stroke="#92BDF9" stroke-width="1.5"/></svg><p>Belum ada transaksi.</p></div>`;
        } else {
            // const catIcons = { Gaji: '💰', Bisnis: '🏢', Investasi: '📈', Bonus: '🎁', Makanan: '🍔', Transportasi: '🚌', Belanja: '🛒', Tagihan: '⚡', Kesehatan: '💊', Hiburan: '🎬', Pendidikan: '📚', Lainnya: '📌' };
            recentEl.innerHTML = recent.map(t => `
        <div class="trans-item">
          <div class="trans-icon ${t.tipe}">${catIcons[t.kat] || '💳'}</div>
          <div class="trans-info"><div class="trans-ket">${escHtml(t.ket)}</div><div class="trans-meta">${escHtml(t.kat)}</div></div>
          <div class="trans-right">
            <div class="trans-amt ${t.tipe}">${t.tipe === 'masuk' ? '+' : '-'}${formatRp(t.jumlah)}</div>
            <div class="trans-tgl">${formatDate(t.tgl)}</div>
          </div>
        </div>
      `).join('');
        }
    }

    renderChart();
}

function renderChart() {
    const yearEl = document.getElementById('chartYear');
    if (!yearEl) return;
    const year = parseInt(yearEl.value);

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const masukData = Array(12).fill(0);
    const keluarData = Array(12).fill(0);

    db.transaksi.forEach(t => {
        const d = new Date(t.tgl);
        if (d.getFullYear() !== year) return;
        const mi = d.getMonth();
        if (t.tipe === 'masuk') masukData[mi] += t.jumlah;
        if (t.tipe === 'keluar') keluarData[mi] += t.jumlah;
    });

    const canvas = document.getElementById('financeChart');
    if (!canvas) return;
    if (finChartInstance) finChartInstance.destroy();

    finChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                { label: 'Pemasukan', data: masukData, backgroundColor: 'rgba(34,197,94,0.8)', borderRadius: 6, borderSkipped: false },
                { label: 'Pengeluaran', data: keluarData, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 6, borderSkipped: false }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { labels: { font: { family: 'Arial', size: 11 }, color: '#04125c' } },
                tooltip: { callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatRp(ctx.raw)}` } }
            },
            scales: {
                x: { grid: { display: false }, ticks: { font: { family: 'Arial' }, color: '#6b7cb5' } },
                y: { grid: { color: '#f0f5ff' }, ticks: { font: { family: 'Arial' }, color: '#6b7cb5', callback: v => 'Rp ' + formatK(v) } }
            }
        }
    });
}

// ============================================================
// PROFIL
// ============================================================
function renderProfil() {
    const el = name => document.getElementById(name);
    if (el('profilNama')) el('profilNama').value = db.user.nama;
    if (el('profilEmail')) el('profilEmail').value = db.user.email;
    if (el('profilTelp')) el('profilTelp').value = db.user.telp || '';
    if (el('profilAvatar')) el('profilAvatar').textContent = initials(db.user.nama);
    if (el('statsTrans')) el('statsTrans').textContent = db.transaksi.length;
    if (el('statsTarget')) el('statsTarget').textContent = db.tabungan.length;
    if (el('statsAnggaran')) el('statsAnggaran').textContent = db.anggaran.length;
    if (el('statsSince')) el('statsSince').textContent = db.user.since || '2025';
}

function saveProfile() {
    db.user.nama = document.getElementById('profilNama').value.trim() || db.user.nama;
    db.user.email = document.getElementById('profilEmail').value.trim() || db.user.email;
    db.user.telp = document.getElementById('profilTelp').value.trim();
    saveDB();
    updateUserUI();
    showToast('Profil berhasil disimpan!');
}

function changeAvatar(input) {
    if (!input.files || !input.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
        const av = document.getElementById('profilAvatar');
        if (av) av.innerHTML = `<img src="${e.target.result}" alt="Avatar"/>`;
    };
    reader.readAsDataURL(input.files[0]);
}

function updateUserUI() {
    const name = db.user.nama;
    const av = initials(name);
    ['sidebarAvatar', 'navAvatar'].forEach(id => {
        const el = document.getElementById(id); if (el) el.textContent = av;
    });
    const sn = document.getElementById('sidebarName');
    if (sn) sn.textContent = name;
}

// ============================================================
// NOTIFICATIONS
// ============================================================
let notifications = [];

function addNotif(msg) {
    notifications.unshift({ msg, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) });
    if (notifications.length > 10) notifications.pop();
    document.getElementById('notifDot').style.display = 'block';
    renderNotif();
}

function renderNotif() {
    const nl = document.getElementById('notifList');
    if (!nl) return;
    if (notifications.length === 0) {
        nl.innerHTML = '<div class="notif-item" style="color:#6b7cb5">Tidak ada notifikasi</div>';
    } else {
        nl.innerHTML = notifications.map(n => `
      <div class="notif-item">
        <div>${n.msg}</div>
        <div class="notif-time">${n.time}</div>
      </div>`).join('');
    }
}

function toggleNotif() {
    const dd = document.getElementById('notifDropdown');
    dd.classList.toggle('hidden');
    document.getElementById('notifDot').style.display = 'none';
    renderNotif();
}

// Close notif dropdown on outside click
document.addEventListener('click', e => {
    const dd = document.getElementById('notifDropdown');
    const btn = document.querySelector('.notif-btn');
    if (dd && !dd.classList.contains('hidden') && btn && !btn.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.add('hidden');
    }
});

// ============================================================
// BADGES
// ============================================================
function updateBadges() {
    const activeTargets = db.tabungan.filter(t => t.terkumpul < t.target).length;
    const badge = document.getElementById('navBadgeTabungan');
    if (badge) {
        badge.textContent = activeTargets;
        badge.style.display = activeTargets > 0 ? 'block' : 'none';
    }
}

// ============================================================
// TOAST
// ============================================================
let toastTimer;
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    const m = document.getElementById('toastMsg');
    if (!t || !m) return;
    m.textContent = msg;
    t.className = `toast toast-${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.add('hidden'); }, 2800);
}

// ============================================================
// HELPERS
// ============================================================
function formatRp(n) {
    if (!n || isNaN(n)) return 'Rp 0';
    return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}
function formatK(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'jt';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'rb';
    return n.toString();
}
function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function todayISO() {
    const d = new Date();
    return d.toISOString().split('T')[0];
}
function currentMonthISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function initials(name) {
    if (!name) return 'U';
    return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}
function bulanNama(n) {
    return ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][n] || '';
}

// Navbar date
function updateNavbarDate() {
    const el = document.getElementById('navbarDate');
    if (!el) return;
    const d = new Date();
    el.textContent = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

// Filter month default
function setDefaultFilterMonth() {
    const el = document.getElementById('filterMonth');
    if (el) el.value = currentMonthISO();
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const isLoginPage = document.body.classList.contains('login-body');

    if (isLoginPage) {
        // Login page: allow Enter key
        document.addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
        return; // Don't init app on login page
    }

    // App page
    checkAuth();
    loadDB();
    setDefaultFilterMonth();
    updateNavbarDate();
    updateUserUI();
    updateBadges();
    navigateTo('dashboard');

    // Set default laporan year
    const lyEl = document.getElementById('laporanTahun');
    if (lyEl) lyEl.value = new Date().getFullYear();

    // Chart year
    const cyEl = document.getElementById('chartYear');
    if (cyEl) cyEl.value = new Date().getFullYear();

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) overlay.classList.add('hidden');
        });
    });

    // Escape key closes modals
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
        }
    });
});