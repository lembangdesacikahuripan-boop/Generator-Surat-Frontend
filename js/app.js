// Guard: redirect ke login kalau belum ada session
(async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => {
                l.classList.remove('border-l-4', 'border-accent', 'bg-secondary', 'text-white', 'font-semibold', 'active');
                l.classList.add('text-gray-300', 'hover:text-white', 'hover:bg-[#354f52]');
                const icon = l.querySelector('.material-symbols-outlined');
                if (icon) icon.removeAttribute('data-weight');
            });

            link.classList.add('border-l-4', 'border-accent', 'bg-secondary', 'text-white', 'font-semibold', 'active');
            link.classList.remove('text-gray-300', 'hover:text-white', 'hover:bg-[#354f52]');
            const activeIcon = link.querySelector('.material-symbols-outlined');
            if (activeIcon) activeIcon.setAttribute('data-weight', 'fill');

            viewSections.forEach(section => {
                section.classList.add('hidden');
                section.classList.remove('flex');
            });

            const targetId = link.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove('hidden');
            if (targetId === 'generator') {
                targetSection.classList.add('flex');
            }
            if (targetId === 'resident-data') {
                targetSection.classList.add('flex');
            muatDaftarPenduduk();
            }
            if (targetId === 'reports') {
                targetSection.classList.add('flex');
            muatLaporan();
}
            }
        });
    });

        // ============ TOGGLE SIDEBAR (HAMBURGER MENU) ============
    const sidebarNav = document.getElementById('sidebar-nav');
    const topHeader = document.getElementById('top-header');
    const mainContent = document.getElementById('main-content');
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');

    btnToggleSidebar.addEventListener('click', () => {
        const tersembunyi = sidebarNav.classList.toggle('collapsed');

        if (tersembunyi) {
            topHeader.style.width = '100%';
            mainContent.style.marginLeft = '0';
            mainContent.style.width = '100%';
        } else {
            topHeader.style.width = '';
            mainContent.style.marginLeft = '';
            mainContent.style.width = '';
        }
    });

    // Popovers
    const notificationBtn = document.getElementById('notification-btn');
    const notificationPopover = document.getElementById('notification-popover');
    const profileBtn = document.getElementById('profile-btn');
    const profilePopover = document.getElementById('profile-popover');

    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPopover.classList.toggle('hidden');
        profilePopover.classList.add('hidden');
    });

    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profilePopover.classList.toggle('hidden');
        notificationPopover.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!notificationPopover.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPopover.classList.add('hidden');
        }
        if (!profilePopover.contains(e.target) && !profileBtn.contains(e.target)) {
            profilePopover.classList.add('hidden');
        }
    });

    // Help Modal
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModalBtn = document.getElementById('close-help-modal');

    helpBtn.addEventListener('click', () => helpModal.classList.remove('hidden'));
    closeHelpModalBtn.addEventListener('click', () => helpModal.classList.add('hidden'));
    helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) helpModal.classList.add('hidden');
    });

    // Logout
    document.getElementById('btn-logout').addEventListener('click', async (e) => {
        e.preventDefault();
        await supabaseClient.auth.signOut();
        window.location.href = 'login.html';
    });

    // Zoom
    let currentZoom = 1.0;
    const zoomStep = 0.1;
    const maxZoom = 2.0;
    const minZoom = 0.5;
    const docContainer = document.getElementById('document-preview-container');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomResetBtn = document.getElementById('zoom-reset-btn');

    function updateZoom() {
        docContainer.style.transform = `scale(${currentZoom})`;
        zoomResetBtn.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    zoomInBtn.addEventListener('click', () => {
        if (currentZoom < maxZoom) { currentZoom += zoomStep; updateZoom(); }
    });
    zoomOutBtn.addEventListener('click', () => {
        if (currentZoom > minZoom) { currentZoom -= zoomStep; updateZoom(); }
    });
    zoomResetBtn.addEventListener('click', () => {
        currentZoom = 1.0; updateZoom();
    });

    function sesuaikanZoomOtomatis() {
    const wrapper = document.getElementById('document-preview-wrapper');
        if (!wrapper) return;
    const lebarTersedia = wrapper.clientWidth - 32; // sisakan sedikit padding
    const lebarDokumen = 794;

        if (lebarTersedia < lebarDokumen) {
            currentZoom = Math.max(lebarTersedia / lebarDokumen, minZoom);
            updateZoom();
        }
    }

    window.addEventListener('resize', sesuaikanZoomOtomatis);
    sesuaikanZoomOtomatis();

    // ============ KONFIGURASI FIELD TAMBAHAN PER JENIS SURAT ============
    const dataTambahanConfig = {
        DOMISILI: [],
        SKTM: [
            { key: 'nama_anak', label: 'Nama Anak' },
            { key: 'nik_anak', label: 'NIK Anak' },
            { key: 'tempat_lahir_anak', label: 'Tempat Lahir Anak' },
            { key: 'tanggal_lahir_anak', label: 'Tanggal Lahir Anak' },
            { key: 'alamat_anak', label: 'Alamat Anak' },
        ],
        PINDAH: [
            { key: 'nama_kepala_keluarga', label: 'Nama Kepala Keluarga' },
            { key: 'alamat_tujuan_pindah', label: 'Alamat Tujuan Pindah' },
            { key: 'jumlah_keluarga_pindah', label: 'Jumlah Keluarga Yang Pindah' },
        ],
        KELAHIRAN: [
            { key: 'bayi_nama', label: 'Nama Bayi' },
            { key: 'bayi_jenis_kelamin', label: 'Jenis Kelamin Bayi' },
            { key: 'bayi_tempat_lahir', label: 'Tempat Lahir Bayi' },
            { key: 'bayi_tanggal_lahir', label: 'Tanggal Lahir Bayi' },
            { key: 'bayi_pukul', label: 'Pukul Lahir' },
            { key: 'bayi_hari', label: 'Hari Lahir' },
            { key: 'bayi_anak_ke', label: 'Anak Ke' },
            { key: 'ayah_nama', label: 'Nama Ayah' },
            { key: 'ayah_umur', label: 'Umur Ayah' },
            { key: 'ayah_agama', label: 'Agama Ayah' },
            { key: 'ayah_pekerjaan', label: 'Pekerjaan Ayah' },
            { key: 'ayah_alamat', label: 'Alamat Ayah' },
            { key: 'ibu_nama', label: 'Nama Ibu' },
            { key: 'ibu_umur', label: 'Umur Ibu' },
            { key: 'ibu_agama', label: 'Agama Ibu' },
            { key: 'ibu_pekerjaan', label: 'Pekerjaan Ibu' },
            { key: 'ibu_alamat', label: 'Alamat Ibu' },
        ],
        PENGHASILAN: [
            { key: 'penghasilan', label: 'Penghasilan (misal: Rp 2.000.000 s/d Rp 2.500.000)' },
            { key: 'tanggungan_nama', label: 'Nama Tanggungan' },
            { key: 'tanggungan_jenis_kelamin', label: 'Jenis Kelamin Tanggungan' },
            { key: 'tanggungan_nik', label: 'NIK Tanggungan' },
            { key: 'tanggungan_tempat_lahir', label: 'Tempat Lahir Tanggungan' },
            { key: 'tanggungan_tanggal_lahir', label: 'Tanggal Lahir Tanggungan' },
        ],
    };

    let jenisSuratMap = {};
    let currentSuratId = null;

    async function muatJenisSurat() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/jenis-surat`);
            const hasil = await res.json();
            if (!hasil.sukses) return console.error(hasil.pesan);

            const select = document.getElementById('input-type');
            select.innerHTML = '<option value="">-- Pilih Jenis Dokumen --</option>';

            hasil.data.forEach(jenis => {
                jenisSuratMap[jenis.id] = { kode: jenis.kode, nama: jenis.nama };
                const option = document.createElement('option');
                option.value = jenis.id;
                option.textContent = jenis.nama;
                select.appendChild(option);
            });
        } catch (err) {
            console.error('Error muat jenis surat:', err);
        }
    }

    function renderDataTambahan(jenisSuratId) {
        const container = document.getElementById('data-tambahan-container');
        container.innerHTML = '';
        const jenis = jenisSuratMap[jenisSuratId];
        if (!jenis) return;

        const fields = dataTambahanConfig[jenis.kode] || [];
        fields.forEach(field => {
            const wrapper = document.createElement('div');
            wrapper.className = 'flex flex-col gap-1';
            wrapper.innerHTML = `
                <label class="font-label-caps text-label-caps text-secondary uppercase">${field.label}</label>
                <input class="w-full border border-soft-accent bg-surface-bright rounded-lg px-4 py-2" id="dt-${field.key}" type="text">
            `;
            container.appendChild(wrapper);
        });
    }

    document.getElementById('input-type').addEventListener('change', (e) => {
        renderDataTambahan(e.target.value);
    });

    document.getElementById('btn-search-nik').addEventListener('click', async () => {
        const nik = document.getElementById('input-nik').value.trim();
        if (!nik) return alert('Masukkan NIK terlebih dahulu');

        const formBaru = document.getElementById('form-penduduk-baru');
        try {
            const res = await fetch(`${API_BASE_URL}/api/penduduk/nik/${nik}`);
            const hasil = await res.json();

            if (hasil.sukses) {
                document.getElementById('input-name').value = hasil.data.nama;
                formBaru.classList.add('hidden');
                formBaru.classList.remove('flex');
            } else {
                document.getElementById('input-name').value = '';
                formBaru.classList.remove('hidden');
                formBaru.classList.add('flex');
            }
        } catch (err) {
            alert('Gagal terhubung ke server');
            console.error(err);
        }
    });

    document.getElementById('btn-simpan-penduduk').addEventListener('click', async () => {
        const nik = document.getElementById('input-nik').value.trim();
        const payload = {
            nik,
            nama: document.getElementById('dp-nama').value,
            tempat_lahir: document.getElementById('dp-tempat-lahir').value,
            tanggal_lahir: document.getElementById('dp-tanggal-lahir').value,
            jenis_kelamin: document.getElementById('dp-jenis-kelamin').value,
            agama: document.getElementById('dp-agama').value,
            pekerjaan: document.getElementById('dp-pekerjaan').value,
            no_kk: document.getElementById('dp-no-kk').value,
            alamat: document.getElementById('dp-alamat').value,
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/penduduk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const hasil = await res.json();

            if (!hasil.sukses) return alert('Gagal simpan: ' + hasil.pesan);

            document.getElementById('input-name').value = hasil.data.nama;
            document.getElementById('form-penduduk-baru').classList.add('hidden');
            alert('Data penduduk berhasil disimpan');
        } catch (err) {
            alert('Gagal terhubung ke server');
            console.error(err);
        }
    });

    document.getElementById('btn-generate').addEventListener('click', async () => {
        const jenisSuratId = document.getElementById('input-type').value;
        const nik = document.getElementById('input-nik').value.trim();
        const keperluan = document.getElementById('input-purpose').value;

        if (!jenisSuratId || !nik) return alert('Pilih jenis dokumen dan isi NIK terlebih dahulu');

        const jenis = jenisSuratMap[jenisSuratId];
        const fields = dataTambahanConfig[jenis.kode] || [];
        const dataTambahan = {};
        fields.forEach(field => {
            const el = document.getElementById(`dt-${field.key}`);
            if (el) dataTambahan[field.key] = el.value;
        });

        try {
            const res = await fetch(`${API_BASE_URL}/api/surat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jenis_surat_id: jenisSuratId,
                    nik,
                    keperluan,
                    data_tambahan: dataTambahan,
                }),
            });
            const hasil = await res.json();

            if (!hasil.sukses) return alert('Gagal buat pratinjau: ' + hasil.pesan);

            currentSuratId = hasil.data.id;
            document.getElementById('preview-placeholder').classList.add('hidden');
            const iframe = document.getElementById('preview-iframe');
            iframe.classList.remove('hidden');
            iframe.src = `${API_BASE_URL}/api/surat/${currentSuratId}/preview`;
        } catch (err) {
            alert('Gagal terhubung ke server');
            console.error(err);
        }
    });

    document.getElementById('btn-cetak').addEventListener('click', async () => {
        if (!currentSuratId) return alert('Buat pratinjau terlebih dahulu');

        const nomorSurat = document.getElementById('input-doc-number').value.trim();
        if (!nomorSurat) return alert('Isi nomor surat terlebih dahulu');

        const namaPenandatangan = document.getElementById('input-nama-penandatangan').value.trim();
        const jabatanPenandatangan = document.getElementById('input-jabatan-penandatangan').value.trim();

        const payload = { nomor_surat: nomorSurat };
        if (namaPenandatangan && jabatanPenandatangan) {
            payload.nama_penandatangan = namaPenandatangan;
            payload.jabatan_penandatangan = jabatanPenandatangan;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/surat/${currentSuratId}/setujui`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const hasil = await res.json();

            if (!hasil.sukses) return alert('Gagal cetak: ' + hasil.pesan);

            window.open(`${API_BASE_URL}/api/surat/${currentSuratId}/pdf`, '_blank');
        } catch (err) {
            alert('Gagal terhubung ke server');
            console.error(err);
        }
    });

    muatJenisSurat();

        // ============ DATA PENDUDUK: LIST ============
    let semuaPendudukCache = []; // simpan data lengkap, dipakai untuk filter pencarian

        async function muatDaftarPenduduk() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/penduduk`);
                const hasil = await res.json();
                if (!hasil.sukses) return console.error(hasil.pesan);

                semuaPendudukCache = hasil.data;
                renderTabelPenduduk(semuaPendudukCache);
            } catch (err) {
                console.error('Error muat penduduk:', err);
            }
        }

        function renderTabelPenduduk(data) {
            const tbody = document.getElementById('tabel-penduduk-body');
            tbody.innerHTML = '';
            penddukCache = {};

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-secondary font-body-sm">Tidak ada data yang cocok</td></tr>`;
                return;
            }

            data.forEach(p => {
                penddukCache[p.id] = p;
                const tr = document.createElement('tr');
                tr.className = 'border-b border-soft-accent hover:bg-surface-container-low';
                tr.innerHTML = `
                    <td class="p-3 font-body-sm">${p.nik}</td>
                    <td class="p-3 font-body-sm">${p.nama}</td>
                    <td class="p-3 font-body-sm">${p.alamat || '-'}</td>
                    <td class="p-3 font-body-sm">${p.pekerjaan || '-'}</td>
                    <td class="p-3 font-body-sm flex gap-2">
                        <button class="text-primary hover:underline cursor-pointer" data-edit-id="${p.id}">Edit</button>
                        <button class="text-error hover:underline cursor-pointer" data-hapus-id="${p.id}">Hapus</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            tbody.querySelectorAll('[data-edit-id]').forEach(btn => {
                btn.addEventListener('click', () => bukaFormEdit(btn.dataset.editId));
            });
            tbody.querySelectorAll('[data-hapus-id]').forEach(btn => {
                btn.addEventListener('click', () => hapusPenduduk(btn.dataset.hapusId));
            });
        }

// ============ PENCARIAN PENDUDUK ============
document.getElementById('cari-penduduk').addEventListener('input', (e) => {
    const kataKunci = e.target.value.trim().toLowerCase();

    if (!kataKunci) {
        renderTabelPenduduk(semuaPendudukCache);
        return;
    }

    const hasilFilter = semuaPendudukCache.filter(p =>
        p.nama.toLowerCase().includes(kataKunci) ||
        p.nik.includes(kataKunci)
    );

    renderTabelPenduduk(hasilFilter);
});

    // ============ FORM TAMBAH / EDIT ============
    function resetFormPenduduk() {
        document.getElementById('rd-id').value = '';
        document.getElementById('rd-nik').value = '';
        document.getElementById('rd-nik').disabled = false;
        document.getElementById('rd-no-kk').value = '';
        document.getElementById('rd-nama').value = '';
        document.getElementById('rd-tempat-lahir').value = '';
        document.getElementById('rd-tanggal-lahir').value = '';
        document.getElementById('rd-jenis-kelamin').value = 'L';
        document.getElementById('rd-agama').value = '';
        document.getElementById('rd-pekerjaan').value = '';
        document.getElementById('rd-status-perkawinan').value = '';
        document.getElementById('rd-alamat').value = '';
    }

    document.getElementById('btn-tambah-penduduk').addEventListener('click', () => {
        resetFormPenduduk();
        document.getElementById('form-penduduk-judul').textContent = 'Tambah Penduduk Baru';
        const form = document.getElementById('form-penduduk');
        form.classList.remove('hidden');
        form.classList.add('flex');
    });

    document.getElementById('btn-batal-rd').addEventListener('click', () => {
        const form = document.getElementById('form-penduduk');
        form.classList.add('hidden');
        form.classList.remove('flex');
    });

    function bukaFormEdit(id) {
        const p = penddukCache[id];
        if (!p) return;

        document.getElementById('rd-id').value = p.id;
        document.getElementById('rd-nik').value = p.nik;
        document.getElementById('rd-nik').disabled = true; // NIK tidak boleh diubah saat edit
        document.getElementById('rd-no-kk').value = p.no_kk || '';
        document.getElementById('rd-nama').value = p.nama;
        document.getElementById('rd-tempat-lahir').value = p.tempat_lahir || '';
        document.getElementById('rd-tanggal-lahir').value = p.tanggal_lahir || '';
        document.getElementById('rd-jenis-kelamin').value = p.jenis_kelamin || 'L';
        document.getElementById('rd-agama').value = p.agama || '';
        document.getElementById('rd-pekerjaan').value = p.pekerjaan || '';
        document.getElementById('rd-status-perkawinan').value = p.status_perkawinan || '';
        document.getElementById('rd-alamat').value = p.alamat || '';

        document.getElementById('form-penduduk-judul').textContent = 'Edit Data Penduduk';
        const form = document.getElementById('form-penduduk');
        form.classList.remove('hidden');
        form.classList.add('flex');
    }

    // ============ SIMPAN (TAMBAH ATAU EDIT) ============
    document.getElementById('btn-simpan-rd').addEventListener('click', async () => {
        const id = document.getElementById('rd-id').value;
        const payload = {
            nik: document.getElementById('rd-nik').value,
            no_kk: document.getElementById('rd-no-kk').value,
            nama: document.getElementById('rd-nama').value,
            tempat_lahir: document.getElementById('rd-tempat-lahir').value,
            tanggal_lahir: document.getElementById('rd-tanggal-lahir').value,
            jenis_kelamin: document.getElementById('rd-jenis-kelamin').value,
            agama: document.getElementById('rd-agama').value,
            pekerjaan: document.getElementById('rd-pekerjaan').value,
            status_perkawinan: document.getElementById('rd-status-perkawinan').value,
            alamat: document.getElementById('rd-alamat').value,
        };

        if (!payload.nik || !payload.nama) {
            return alert('NIK dan Nama wajib diisi');
        }

        try {
            const url = id ? `${API_BASE_URL}/api/penduduk/${id}` : `${API_BASE_URL}/api/penduduk`;
            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const hasil = await res.json();

            if (!hasil.sukses) return alert('Gagal simpan: ' + hasil.pesan);

            document.getElementById('form-penduduk').classList.add('hidden');
            document.getElementById('form-penduduk').classList.remove('flex');
            muatDaftarPenduduk();
        } catch (err) {
            alert('Gagal terhubung ke server');
            console.error(err);
        }
    });

    // ============ HAPUS ============
    async function hapusPenduduk(id) {
        if (!confirm('Yakin ingin menghapus data penduduk ini?')) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/penduduk/${id}`, { method: 'DELETE' });
            const hasil = await res.json();

            if (!hasil.sukses) return alert('Gagal hapus: ' + hasil.pesan);
            muatDaftarPenduduk();
        } catch (err) {
            alert('Gagal terhubung ke server');
            console.error(err);
        }
    }

        // ============ LAPORAN ============
    let semuaSuratCache = [];

    async function muatLaporan() {
        try {
            const res = await fetch(`${API_BASE_URL}/api/surat`);
            const hasil = await res.json();
            if (!hasil.sukses) return console.error(hasil.pesan);

            semuaSuratCache = hasil.data;
            muatFilterJenisLaporan();
            renderTabelLaporan();
        } catch (err) {
            console.error('Error muat laporan:', err);
        }
    }

    function muatFilterJenisLaporan() {
        const select = document.getElementById('filter-jenis-laporan');
        if (select.options.length > 1) return; // sudah pernah diisi, jangan diisi ulang

        const jenisUnik = {};
        semuaSuratCache.forEach(s => {
            if (s.jenis_surat) jenisUnik[s.jenis_surat.kode] = s.jenis_surat.nama;
        });

        Object.entries(jenisUnik).forEach(([kode, nama]) => {
            const option = document.createElement('option');
            option.value = kode;
            option.textContent = nama;
            select.appendChild(option);
        });
    }

    function renderTabelLaporan() {
        const filterJenis = document.getElementById('filter-jenis-laporan').value;
        const filterStatus = document.getElementById('filter-status-laporan').value;

        const dataFiltered = semuaSuratCache.filter(s => {
            const cocokJenis = !filterJenis || (s.jenis_surat && s.jenis_surat.kode === filterJenis);
            const cocokStatus = !filterStatus || s.status === filterStatus;
            return cocokJenis && cocokStatus;
        });

        // Update angka ringkasan (selalu dari data keseluruhan, bukan hasil filter)
        document.getElementById('stat-total').textContent = semuaSuratCache.length;
        document.getElementById('stat-disetujui').textContent = semuaSuratCache.filter(s => s.status === 'disetujui').length;
        document.getElementById('stat-draft').textContent = semuaSuratCache.filter(s => s.status === 'draft').length;

        const tbody = document.getElementById('tabel-laporan-body');
        tbody.innerHTML = '';

        dataFiltered.forEach(s => {
            const tanggal = new Date(s.tanggal_dibuat).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            });
            const statusBadge = s.status === 'disetujui'
                ? '<span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">Disetujui</span>'
                : '<span class="bg-surface-container-high text-secondary px-2 py-1 rounded-full text-xs font-medium">Draft</span>';

            const tr = document.createElement('tr');
            tr.className = 'border-b border-soft-accent hover:bg-surface-container-low';
            tr.innerHTML = `
                <td class="p-3 font-body-sm">${s.nomor_surat || '-'}</td>
                <td class="p-3 font-body-sm">${s.jenis_surat ? s.jenis_surat.nama : '-'}</td>
                <td class="p-3 font-body-sm">${s.penduduk ? s.penduduk.nama : '-'}</td>
                <td class="p-3 font-body-sm">${tanggal}</td>
                <td class="p-3 font-body-sm">${statusBadge}</td>
                <td class="p-3 font-body-sm">
                    <button class="text-primary hover:underline cursor-pointer" data-lihat-id="${s.id}">Lihat PDF</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        tbody.querySelectorAll('[data-lihat-id]').forEach(btn => {
            btn.addEventListener('click', () => {
                window.open(`${API_BASE_URL}/api/surat/${btn.dataset.lihatId}/pdf`, '_blank');
            });
        });
    }

        document.getElementById('filter-jenis-laporan').addEventListener('change', renderTabelLaporan);
        document.getElementById('filter-status-laporan').addEventListener('change', renderTabelLaporan);
});