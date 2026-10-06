// Guard: redirect ke login kalau belum ada session
(async () => {
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = "login.html";
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const viewSections = document.querySelectorAll(".view-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((l) => {
        l.classList.remove(
          "border-l-4",
          "border-accent",
          "bg-secondary",
          "text-white",
          "font-semibold",
          "active",
        );
        l.classList.add(
          "text-gray-300",
          "hover:text-white",
          "hover:bg-[#354f52]",
        );
        const icon = l.querySelector(".material-symbols-outlined");
        if (icon) icon.removeAttribute("data-weight");
      });

      link.classList.add(
        "border-l-4",
        "border-accent",
        "bg-secondary",
        "text-white",
        "font-semibold",
        "active",
      );
      link.classList.remove(
        "text-gray-300",
        "hover:text-white",
        "hover:bg-[#354f52]",
      );
      const activeIcon = link.querySelector(".material-symbols-outlined");
      if (activeIcon) activeIcon.setAttribute("data-weight", "fill");

      viewSections.forEach((section) => {
        section.classList.add("hidden");
        section.classList.remove("flex");
      });

      const targetId = link.getAttribute("data-target");
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove("hidden");
        if (targetId === "generator") {
          targetSection.classList.add("flex");
        }
        if (targetId === "resident-data") {
          targetSection.classList.add("flex");
          muatDaftarPenduduk();
        }
        if (targetId === "reports") {
          targetSection.classList.add("flex");
          muatLaporan();
        }
      }
    });
  });

  // ============ TOGGLE SIDEBAR (HAMBURGER MENU) ============
  const sidebarNav = document.getElementById("sidebar-nav");
  const topHeader = document.getElementById("top-header");
  const mainContent = document.getElementById("main-content");
  const btnToggleSidebar = document.getElementById("btn-toggle-sidebar");

  btnToggleSidebar.addEventListener("click", () => {
    const tersembunyi = sidebarNav.classList.toggle("collapsed");

    if (tersembunyi) {
      topHeader.style.width = "100%";
      mainContent.style.marginLeft = "0";
      mainContent.style.width = "100%";
    } else {
      topHeader.style.width = "";
      mainContent.style.marginLeft = "";
      mainContent.style.width = "";
    }
  });

  // Popovers
  const notificationBtn = document.getElementById("notification-btn");
  const notificationPopover = document.getElementById("notification-popover");
  const profileBtn = document.getElementById("profile-btn");
  const profilePopover = document.getElementById("profile-popover");

  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notificationPopover.classList.toggle("hidden");
    profilePopover.classList.add("hidden");
  });

  profileBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    profilePopover.classList.toggle("hidden");
    notificationPopover.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !notificationPopover.contains(e.target) &&
      !notificationBtn.contains(e.target)
    ) {
      notificationPopover.classList.add("hidden");
    }
    if (!profilePopover.contains(e.target) && !profileBtn.contains(e.target)) {
      profilePopover.classList.add("hidden");
    }
  });

  // Help Modal
  const helpBtn = document.getElementById("help-btn");
  const helpModal = document.getElementById("help-modal");
  const closeHelpModalBtn = document.getElementById("close-help-modal");

  helpBtn.addEventListener("click", () => helpModal.classList.remove("hidden"));
  closeHelpModalBtn.addEventListener("click", () =>
    helpModal.classList.add("hidden"),
  );
  helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) helpModal.classList.add("hidden");
  });

  // Logout
  document.getElementById("btn-logout").addEventListener("click", async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });

  // Zoom
  let currentZoom = 1.0;
  const zoomStep = 0.1;
  const maxZoom = 2.0;
  const minZoom = 0.5;
  const docContainer = document.getElementById("document-preview-container");
  const zoomInBtn = document.getElementById("zoom-in-btn");
  const zoomOutBtn = document.getElementById("zoom-out-btn");
  const zoomResetBtn = document.getElementById("zoom-reset-btn");

  function updateZoom() {
    docContainer.style.transform = `scale(${currentZoom})`;
    zoomResetBtn.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  zoomInBtn.addEventListener("click", () => {
    if (currentZoom < maxZoom) {
      currentZoom += zoomStep;
      updateZoom();
    }
  });
  zoomOutBtn.addEventListener("click", () => {
    if (currentZoom > minZoom) {
      currentZoom -= zoomStep;
      updateZoom();
    }
  });
  zoomResetBtn.addEventListener("click", () => {
    currentZoom = 1.0;
    updateZoom();
  });

  function sesuaikanZoomOtomatis() {
    const wrapper = document.getElementById("document-preview-wrapper");
    if (!wrapper) return;
    const lebarTersedia = wrapper.clientWidth - 32; // sisakan sedikit padding
    const lebarDokumen = 794;

    if (lebarTersedia < lebarDokumen) {
      currentZoom = Math.max(lebarTersedia / lebarDokumen, minZoom);
      updateZoom();
    }
  }

  window.addEventListener("resize", sesuaikanZoomOtomatis);
  sesuaikanZoomOtomatis();

  // ============ KONFIGURASI FIELD TAMBAHAN PER JENIS SURAT ============
  const dataTambahanConfig = {
    DOMISILI: [
      {
        key: "rt_pengantar",
        label: "RT (Pengantar)",
        type: "text",
        placeholder: "Contoh: 04",
      },
      {
        key: "nomor_surat_rt",
        label: "Nomor Surat Pengantar RT",
        type: "text",
        placeholder: "Contoh: 12/RT 04/RW 01/VI/2026",
      },
      {
        key: "rw_pengantar",
        label: "RW (Pengantar)",
        type: "text",
        placeholder: "Contoh: 01",
      },
      {
        key: "nomor_surat_rw",
        label: "Nomor Reg. Surat RW",
        type: "text",
        placeholder: "Contoh: 118/RW 01/VI/2026",
      },
    ],
    SKTM: [
      { key: "nama_anak", label: "Nama Anak" },
      { key: "nik_anak", label: "NIK Anak" },
      { key: "tempat_lahir_anak", label: "Tempat Lahir Anak" },
      { key: "tanggal_lahir_anak", label: "Tanggal Lahir Anak" },
      { key: "alamat_anak", label: "Alamat Anak" },
      {
        key: "rt_pengantar",
        label: "RT (Pengantar)",
        placeholder: "Contoh: 04",
      },
      {
        key: "nomor_surat_rt",
        label: "Nomor Surat Pengantar RT",
        placeholder: "Contoh: 02/RT 04/RW 08/II/2026",
      },
      {
        key: "rw_pengantar",
        label: "RW (Pengantar)",
        placeholder: "Contoh: 08",
      },
      {
        key: "nomor_surat_rw",
        label: "Nomor Reg. Surat RW",
        placeholder: "Contoh: 07/RW 08/II/2026",
      },
    ],
    PINDAH: [
      { key: "alamat_tujuan_pindah", label: "Alamat Tujuan Pindah" },
      { key: "jumlah_keluarga_pindah", label: "Jumlah Keluarga Yang Pindah" },
    ],
    KELAHIRAN: [
      { key: "bayi_nama", label: "Nama Bayi" },
      { key: "bayi_jenis_kelamin", label: "Jenis Kelamin Bayi" },
      { key: "bayi_tempat_lahir", label: "Tempat Lahir Bayi" },
      { key: "bayi_tanggal_lahir", label: "Tanggal Lahir Bayi" },
      { key: "bayi_pukul", label: "Pukul Lahir" },
      { key: "bayi_hari", label: "Hari Lahir" },
      { key: "bayi_anak_ke", label: "Anak Ke" },
      {
        key: "bayi_alamat",
        label: "Alamat Bayi",
        placeholder:
          "Contoh: Kp. Sukalaksana RT 01 RW 02 Desa Cikahuripan Kecamatan Lembang",
      },
      { key: "ayah_nama", label: "Nama Ayah" },
      { key: "ayah_umur", label: "Umur Ayah" },
      { key: "ayah_agama", label: "Agama Ayah" },
      { key: "ayah_pekerjaan", label: "Pekerjaan Ayah" },
      { key: "ayah_alamat", label: "Alamat Ayah" },
      { key: "ibu_nama", label: "Nama Ibu" },
      { key: "ibu_umur", label: "Umur Ibu" },
      { key: "ibu_agama", label: "Agama Ibu" },
      { key: "ibu_pekerjaan", label: "Pekerjaan Ibu" },
      { key: "ibu_alamat", label: "Alamat Ibu" },
      {
        key: "nama_pelapor",
        label: "Nama Yang Melaporkan",
        placeholder: "Contoh: nama ayah/ibu atau pelapor lain",
      },
    ],
    PENGHASILAN: [
      {
        key: "penghasilan",
        label: "Penghasilan",
        placeholder:
          "Contoh: Rp.1.700.000,- (Satu Juta Tujuh Ratus Ribu Rupiah)",
      },
      {
        key: "jumlah_tanggungan",
        label: "Jumlah Tanggungan (opsional, kosongkan jika tidak perlu)",
        placeholder: "Contoh: 4",
      },
      { key: "anak_nama", label: "Nama Anak" },
      { key: "anak_nik", label: "NIK Anak" },
      { key: "anak_tempat_lahir", label: "Tempat Lahir Anak" },
      { key: "anak_tanggal_lahir", label: "Tanggal Lahir Anak" },
      { key: "anak_alamat", label: "Alamat Anak" },
    ],
    KEMATIAN: [
      { key: "umur", label: "Umur", placeholder: "Contoh: 45 tahun" },
      {
        key: "hari_meninggal",
        label: "Hari Meninggal",
        placeholder: "Contoh: Senin",
      },
      {
        key: "tanggal_meninggal",
        label: "Tanggal Meninggal",
        placeholder: "Contoh: 2 Februari 2026",
      },
      {
        key: "tempat_meninggal",
        label: "Tempat Meninggal",
        placeholder: "Contoh: Kp. Cisaroni RT 04 RW 08 Desa Cikahuripan",
      },
      {
        key: "penyebab_meninggal",
        label: "Disebabkan Karena",
        placeholder: "Contoh: Sakit",
      },
      {
        key: "nama_pelapor",
        label: "Nama Yang Melaporkan",
        placeholder: "Contoh: Wisnu Kartiwa",
      },
      {
        key: "hubungan_pelapor",
        label: "Hubungan Dengan Yang Meninggal",
        placeholder: "Contoh: Anak / Kerabat / Keluarga",
      },
    ],
    KEGIATAN: [
      {
        key: "waktu_kegiatan",
        label: "Waktu Pelaksanaan",
        placeholder: "Contoh: Sabtu, 31-01-2026 Pukul 19.00 – 22.00 WIB",
      },
      {
        key: "tempat_kegiatan",
        label: "Tempat Kegiatan",
        placeholder: "Contoh: Kp. Karamat RT 03 RW 06",
      },
      {
        key: "jenis_kegiatan",
        label: "Jenis Kegiatan / Hiburan",
        placeholder: "Contoh: Sound System/ Musik Pengiring",
      },
      {
        key: "rt_pengantar",
        label: "RT (Pengantar, opsional)",
        placeholder: "Contoh: 03",
      },
      {
        key: "rw_pengantar",
        label: "RW (Pengantar, opsional)",
        placeholder: "Contoh: 05",
      },
    ],
    KTP_SEMENTARA: [],
    SKU: [
      {
        key: "bidang_usaha",
        label: "Bidang Usaha",
        placeholder: "Contoh: Peternakan",
      },
      {
        key: "penghasilan",
        label: "Penghasilan per Bulan",
        placeholder: "Contoh: Rp. 7.000.000,-",
      },
      {
        key: "lama_usaha",
        label: "Lama Usaha",
        placeholder: "Contoh: 4 Tahun",
      },
      {
        key: "tempat_usaha",
        label: "Tempat Usaha",
        placeholder: "Contoh: Kp. Pojok Girang RT 06 RW 04 Desa Cikahuripan",
      },
      {
        key: "rt_pengantar",
        label: "RT (Pengantar, opsional)",
        placeholder: "Contoh: 06",
      },
      {
        key: "nomor_surat_rt",
        label: "Nomor Surat Pengantar RT (opsional)",
        placeholder: "Contoh: 04/RT 06/RW 04/II/2026",
      },
      {
        key: "rw_pengantar",
        label: "RW (Pengantar, opsional)",
        placeholder: "Contoh: 04",
      },
      {
        key: "nomor_surat_rw",
        label: "Nomor Surat Pengantar RW (opsional)",
        placeholder: "Contoh: 05/RW 04/II/2026",
      },
    ],
    BELUM_MENIKAH: [
      {
        key: "nama_pemohon",
        label:
          "Nama Pemohon (opsional, kosongkan jika pemohon = orang yang diterangkan)",
        placeholder: "Contoh: nama orang tua yang mengurus",
      },
      {
        key: "rt_pengantar",
        label: "RT (Pengantar, opsional)",
        placeholder: "Contoh: 04",
      },
      {
        key: "nomor_surat_rt",
        label: "Nomor Surat Pengantar RT (opsional)",
        placeholder: "Contoh: 40/RT 04/RW 09/IV/2026",
      },
      {
        key: "rw_pengantar",
        label: "RW (Pengantar, opsional)",
        placeholder: "Contoh: 09",
      },
      {
        key: "nomor_surat_rw",
        label: "Nomor Surat Pengantar RW (opsional)",
        placeholder: "Contoh: 07/RW 09/IV/2026",
      },
    ],
    HARGA_TANAH: [
      {
        key: "lokasi_tanah",
        label: "Lokasi/Desa/Jalan",
        placeholder:
          "Contoh: Kp. Karamat RT 02 RW 07 Desa Cikahuripan Kecamatan Lembang Kabupaten Bandung Barat",
      },
      {
        key: "jenis_bukti",
        label: "Jenis Bukti Kepemilikan",
        placeholder: "Isi: SHM atau AJB",
      },
      {
        key: "nama_pemilik",
        label: "Nama Pemilik",
        placeholder: "Contoh: Surya Gumilar",
      },
      {
        key: "nomor_bukti",
        label: "Nomor Sertifikat / AJB",
        placeholder: "Contoh: NIB 10.31.000034165.0 atau 97/2022",
      },
      {
        key: "luas_tanah",
        label: "Luas Tanah (M2)",
        placeholder: "Contoh: 75",
      },
      {
        key: "harga_per_meter",
        label: "Harga per M2",
        placeholder: "Contoh: Rp 3.500.000 s/d Rp 4.000.000",
      },
      {
        key: "harga_bangunan",
        label: "Harga Bangunan (opsional)",
        placeholder: "Contoh: Rp 150.000.000 s/d Rp 200.000.000",
      },
    ],
    AHLI_WARIS: [
      {
        key: "pewaris",
        label: "Nama Pewaris (yang meninggal)",
        placeholder: "Contoh: Almarhumah EMAY",
      },
      {
        key: "tanggal_meninggal",
        label: "Tanggal Meninggal",
        placeholder: "Contoh: 08-09-2019",
      },
      {
        key: "tempat_meninggal",
        label: "Tempat Meninggal",
        placeholder: "Contoh: Kp. Sukamekar RT 01 RW 10 Desa Cikahuripan",
      },
      {
        key: "ahli_waris",
        label: "Daftar Ahli Waris",
        type: "list",
        wajib: true,
        tombol: "Tambah Ahli Waris",
        kolom: [
          { key: "nama", placeholder: "Nama" },
          { key: "umur", placeholder: "Umur (angka)" },
          { key: "hubungan", placeholder: "Hubungan (misal: Anak)" },
          { key: "alamat", placeholder: "Alamat" },
        ],
      },
      {
        key: "keterangan_tanah",
        label: "Keterangan Tanah Warisan (opsional)",
        type: "textarea",
        placeholder:
          "Contoh: yang terletak di Blok Cisaroni Desa Cikahuripan Kecamatan Lembang, sebagaimana tercatat dalam Sertifikat Hak Milik Nomor: 01209, Luas: 201 m2, tercatat Atas Nama AEP SAEPUDIN",
      },
      { key: "rt_saksi", label: "RT (Saksi)", placeholder: "Contoh: 01" },
      {
        key: "nama_ketua_rt",
        label: "Nama Ketua RT (opsional)",
        placeholder: "Kosongkan jika ditulis tangan",
      },
      { key: "rw_saksi", label: "RW (Saksi)", placeholder: "Contoh: 10" },
      {
        key: "nama_ketua_rw",
        label: "Nama Ketua RW (opsional)",
        placeholder: "Kosongkan jika ditulis tangan",
      },
    ],
    PERSYARATAN_NIKAH: [
      {
        key: "hari_tanggal_akad",
        label: "Akad Nikah Dilaksanakan Pada",
        placeholder: "Contoh: Minggu, 06 September 2026",
      },
      {
        key: "tempat_akad",
        label: "Alamat/Tempat Akad Nikah",
        placeholder: "Contoh: Kp. Karamat RT 02 RW 06 Desa Cikahuripan",
      },
      {
        key: "maskawin",
        label: "Maskawin",
        placeholder: "Contoh: Seperangkat alat salat",
      },
      { key: "jam_akad", label: "Jam Akad", placeholder: "Contoh: 09.00 WIB" },
      { key: "ayah_pria", label: "Nama Ayah Catin Pria" },
      { key: "ibu_pria", label: "Nama Ibu Catin Pria" },
      { key: "telp_pria", label: "No. Telp Catin Pria" },
      { key: "email_pria", label: "E-mail Catin Pria" },
      { key: "ayah_wanita", label: "Nama Ayah Catin Wanita" },
      { key: "ibu_wanita", label: "Nama Ibu Catin Wanita" },
      { key: "telp_wanita", label: "No. Telp Catin Wanita" },
      { key: "email_wanita", label: "E-mail Catin Wanita" },
      { key: "telp_wali", label: "No. Telp Wali" },
      { key: "tanggal_daftar", label: "Tanggal Daftar (opsional)" },
      { key: "tanggal_nikah", label: "Tanggal Nikah (opsional)" },
      { key: "nomor_akta_nikah", label: "Nomor Akta Nikah (opsional)" },
      { key: "nomor_porporasi", label: "Nomor Porporasi (opsional)" },
      { key: "hp_catin", label: "Nomor HP Catin (opsional)" },
      { key: "nomor_billing", label: "Nomor Billing (opsional)" },
    ],
  };

  let jenisSuratMap = {};
  let currentSuratId = null;

  async function muatJenisSurat() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jenis-surat`);
      const hasil = await res.json();
      if (!hasil.sukses) return console.error(hasil.pesan);

      const select = document.getElementById("input-type");
      select.innerHTML = '<option value="">-- Pilih Jenis Dokumen --</option>';

      hasil.data.forEach((jenis) => {
        jenisSuratMap[jenis.id] = { kode: jenis.kode, nama: jenis.nama };
        const option = document.createElement("option");
        option.value = jenis.id;
        option.textContent = jenis.nama;
        select.appendChild(option);
      });
    } catch (err) {
      console.error("Error muat jenis surat:", err);
    }
  }

  // Satu baris isian untuk field bertipe "list" (misal: satu ahli waris)
  function buatBarisList(field) {
    const baris = document.createElement("div");
    baris.className =
      "baris-list flex gap-2 items-start border border-soft-accent rounded-lg p-2";
    const inputs = field.kolom
      .map(
        (k) =>
          `<input class="border border-soft-accent bg-surface-bright rounded-lg px-3 py-2 min-w-0" data-kolom="${k.key}" type="text" placeholder="${k.placeholder || ""}">`,
      )
      .join("");
    baris.innerHTML = `
      <div class="grid grid-cols-2 gap-2 flex-1">${inputs}</div>
      <button type="button" class="btn-hapus-baris text-red-600 p-2 cursor-pointer" title="Hapus baris">
        <span class="material-symbols-outlined">delete</span>
      </button>`;
    baris
      .querySelector(".btn-hapus-baris")
      .addEventListener("click", () => baris.remove());
    return baris;
  }

  // Jenis surat yang TIDAK memakai kolom Keperluan (kolomnya disembunyikan di form)
  const TANPA_KEPERLUAN = [
    "KEMATIAN",
    "KELAHIRAN",
    "PINDAH",
    "KTP_SEMENTARA",
    "HARGA_TANAH",
    "PERSYARATAN_NIKAH",
  ];

  function suratPakaiKeperluan(jenis) {
    return jenis && !TANPA_KEPERLUAN.includes(jenis.kode);
  }

  // Jenis surat yang TIDAK punya nomor surat (kolom Nomor disembunyikan & tidak wajib)
  const TANPA_NOMOR = ["PERSYARATAN_NIKAH"];

  function aturKolomKeperluan(jenisSuratId) {
    const jenis = jenisSuratMap[jenisSuratId];

    const inputKeperluan = document.getElementById("input-purpose");
    const tampilKeperluan = !jenis || suratPakaiKeperluan(jenis);
    inputKeperluan.closest("div").style.display = tampilKeperluan ? "" : "none";
    if (!tampilKeperluan) inputKeperluan.value = "";

    const inputNomor = document.getElementById("input-doc-number");
    const tampilNomor = !jenis || !TANPA_NOMOR.includes(jenis.kode);
    inputNomor.closest("div").style.display = tampilNomor ? "" : "none";
    if (!tampilNomor) inputNomor.value = "";
  }

  function renderDataTambahan(jenisSuratId) {
    const container = document.getElementById("data-tambahan-container");
    container.innerHTML = "";
    const jenis = jenisSuratMap[jenisSuratId];
    if (!jenis) return;

    const fields = dataTambahanConfig[jenis.kode] || [];
    fields.forEach((field) => {
      const wrapper = document.createElement("div");
      wrapper.className = "flex flex-col gap-1";
      const label = `<label class="font-label-caps text-label-caps text-secondary uppercase">${field.label}</label>`;

      if (field.type === "list") {
        wrapper.innerHTML = `${label}
          <div class="flex flex-col gap-2" id="dt-${field.key}"></div>
          <button type="button" class="btn-tambah-baris self-start text-primary font-title-sm hover:underline cursor-pointer mt-1">+ ${field.tombol || "Tambah Baris"}</button>`;
        const daftar = wrapper.querySelector(`#dt-${field.key}`);
        daftar.appendChild(buatBarisList(field)); // mulai dengan 1 baris kosong
        wrapper
          .querySelector(".btn-tambah-baris")
          .addEventListener("click", () => {
            daftar.appendChild(buatBarisList(field));
          });
      } else if (field.type === "textarea") {
        wrapper.innerHTML = `${label}
          <textarea class="w-full border border-soft-accent bg-surface-bright rounded-lg px-4 py-2 min-h-[90px]" id="dt-${field.key}" placeholder="${field.placeholder || ""}"></textarea>`;
      } else {
        wrapper.innerHTML = `${label}
          <input class="w-full border border-soft-accent bg-surface-bright rounded-lg px-4 py-2" id="dt-${field.key}" type="text" placeholder="${field.placeholder || ""}">`;
      }
      container.appendChild(wrapper);
    });
  }

  document.getElementById("input-type").addEventListener("change", (e) => {
    renderDataTambahan(e.target.value);
    aturKolomKeperluan(e.target.value);
  });

  document
    .getElementById("btn-search-nik")
    .addEventListener("click", async () => {
      const nik = document.getElementById("input-nik").value.trim();
      if (!nik) return alert("Masukkan NIK terlebih dahulu");

      const formBaru = document.getElementById("form-penduduk-baru");
      try {
        const res = await fetch(`${API_BASE_URL}/api/penduduk/nik/${nik}`);
        const hasil = await res.json();

        if (hasil.sukses) {
          document.getElementById("input-name").value = hasil.data.nama;
          formBaru.classList.add("hidden");
          formBaru.classList.remove("flex");
        } else {
          document.getElementById("input-name").value = "";
          formBaru.classList.remove("hidden");
          formBaru.classList.add("flex");
        }
      } catch (err) {
        alert("Gagal terhubung ke server");
        console.error(err);
      }
    });

  document
    .getElementById("btn-simpan-penduduk")
    .addEventListener("click", async () => {
      const nik = document.getElementById("input-nik").value.trim();
      const payload = {
        nik,
        nama: document.getElementById("dp-nama").value,
        tempat_lahir: document.getElementById("dp-tempat-lahir").value,
        tanggal_lahir: document.getElementById("dp-tanggal-lahir").value,
        jenis_kelamin: document.getElementById("dp-jenis-kelamin").value,
        agama: document.getElementById("dp-agama").value,
        pekerjaan: document.getElementById("dp-pekerjaan").value,
        no_kk: document.getElementById("dp-no-kk").value,
        alamat: document.getElementById("dp-alamat").value,
      };

      try {
        const res = await fetch(`${API_BASE_URL}/api/penduduk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const hasil = await res.json();

        if (!hasil.sukses) return alert("Gagal simpan: " + hasil.pesan);

        document.getElementById("input-name").value = hasil.data.nama;
        document.getElementById("form-penduduk-baru").classList.add("hidden");
        alert("Data penduduk berhasil disimpan");
      } catch (err) {
        alert("Gagal terhubung ke server");
        console.error(err);
      }
    });

  document
    .getElementById("btn-generate")
    .addEventListener("click", async () => {
      const jenisSuratId = document.getElementById("input-type").value;
      const nik = document.getElementById("input-nik").value.trim();
      const keperluan = document.getElementById("input-purpose").value;

      if (!jenisSuratId || !nik)
        return alert("Pilih jenis dokumen dan isi NIK terlebih dahulu");

      const jenis = jenisSuratMap[jenisSuratId];
      if (suratPakaiKeperluan(jenis) && !keperluan.trim()) {
        return alert("Isi kolom Keperluan terlebih dahulu");
      }
      const fields = dataTambahanConfig[jenis.kode] || [];
      const dataTambahan = {};
      fields.forEach((field) => {
        if (field.type === "list") {
          const isi = [];
          document
            .querySelectorAll(`#dt-${field.key} .baris-list`)
            .forEach((baris) => {
              const obj = {};
              baris.querySelectorAll("[data-kolom]").forEach((inp) => {
                obj[inp.dataset.kolom] = inp.value.trim();
              });
              if (Object.values(obj).some((v) => v)) isi.push(obj); // lewati baris yang kosong semua
            });
          dataTambahan[field.key] = isi;
          return;
        }
        const el = document.getElementById(`dt-${field.key}`);
        if (el) dataTambahan[field.key] = el.value;
      });

      const listKosong = fields.find(
        (f) => f.type === "list" && f.wajib && dataTambahan[f.key].length === 0,
      );
      if (listKosong) return alert(`${listKosong.label} minimal diisi 1 orang`);

      try {
        const res = await fetch(`${API_BASE_URL}/api/surat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jenis_surat_id: jenisSuratId,
            nik,
            keperluan,
            data_tambahan: dataTambahan,
          }),
        });
        const hasil = await res.json();

        if (!hasil.sukses) return alert("Gagal buat pratinjau: " + hasil.pesan);

        currentSuratId = hasil.data.id;
        document.getElementById("preview-placeholder").classList.add("hidden");
        const iframe = document.getElementById("preview-iframe");
        iframe.classList.remove("hidden");
        iframe.src = `${API_BASE_URL}/api/surat/${currentSuratId}/preview`;
      } catch (err) {
        alert("Gagal terhubung ke server");
        console.error(err);
      }
    });

  document.getElementById("btn-cetak").addEventListener("click", async () => {
    if (!currentSuratId) return alert("Buat pratinjau terlebih dahulu");

    const nomorSurat = document.getElementById("input-doc-number").value.trim();
    const jenisAktif =
      jenisSuratMap[document.getElementById("input-type").value];
    const tanpaNomor = jenisAktif && TANPA_NOMOR.includes(jenisAktif.kode);
    if (!nomorSurat && !tanpaNomor)
      return alert("Isi nomor surat terlebih dahulu");

    const namaPenandatangan = document
      .getElementById("input-nama-penandatangan")
      .value.trim();
    const jabatanPenandatangan = document
      .getElementById("input-jabatan-penandatangan")
      .value.trim();

    const payload = {};
    if (nomorSurat) payload.nomor_surat = nomorSurat;
    if (namaPenandatangan && jabatanPenandatangan) {
      payload.nama_penandatangan = namaPenandatangan;
      payload.jabatan_penandatangan = jabatanPenandatangan;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/surat/${currentSuratId}/setujui`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const hasil = await res.json();

      if (!hasil.sukses) return alert("Gagal cetak: " + hasil.pesan);

      window.open(`${API_BASE_URL}/api/surat/${currentSuratId}/pdf`, "_blank");
    } catch (err) {
      alert("Gagal terhubung ke server");
      console.error(err);
    }
  });

  // ============ DRAF FORM (isian tidak hilang saat refresh) ============
  const KUNCI_DRAF = "sauyunan_draf_surat";
  const FIELD_UTAMA = [
    "input-nik",
    "input-name",
    "input-type",
    "input-doc-number",
    "input-purpose",
    "input-nama-penandatangan",
    "input-jabatan-penandatangan",
  ];
  let lewatiSimpanDraf = false;

  function simpanDraf() {
    if (lewatiSimpanDraf) return;
    const draf = { utama: {}, tambahan: {}, list: {}, currentSuratId };

    FIELD_UTAMA.forEach((id) => {
      const el = document.getElementById(id);
      if (el) draf.utama[id] = el.value;
    });

    // Field tambahan biasa (input & textarea)
    document
      .querySelectorAll(
        "#data-tambahan-container input[id^='dt-'], #data-tambahan-container textarea[id^='dt-']",
      )
      .forEach((el) => (draf.tambahan[el.id] = el.value));

    // Field tambahan bertipe daftar (misal daftar ahli waris)
    document
      .querySelectorAll("#data-tambahan-container div[id^='dt-']")
      .forEach((daftar) => {
        draf.list[daftar.id] = [...daftar.querySelectorAll(".baris-list")].map(
          (baris) => {
            const obj = {};
            baris
              .querySelectorAll("[data-kolom]")
              .forEach((inp) => (obj[inp.dataset.kolom] = inp.value));
            return obj;
          },
        );
      });

    try {
      localStorage.setItem(KUNCI_DRAF, JSON.stringify(draf));
    } catch (e) {
      console.warn("Draf tidak bisa disimpan:", e);
    }
  }

  function pulihkanDraf() {
    let draf = null;
    try {
      draf = JSON.parse(localStorage.getItem(KUNCI_DRAF));
    } catch (e) {
      return;
    }
    if (!draf) return;

    const selectJenis = document.getElementById("input-type");
    const jenisTersimpan = draf.utama && draf.utama["input-type"];
    let percobaan = 0;

    // Tunggu daftar jenis surat selesai dimuat dari server dulu (maks. ~5 detik)
    const tunggu = setInterval(() => {
      percobaan++;
      const opsiSiap =
        !jenisTersimpan ||
        [...selectJenis.options].some((o) => o.value === jenisTersimpan);
      if (!opsiSiap && percobaan < 50) return;
      clearInterval(tunggu);

      FIELD_UTAMA.forEach((id) => {
        const el = document.getElementById(id);
        if (el && draf.utama[id] !== undefined) el.value = draf.utama[id];
      });

      if (jenisTersimpan) {
        renderDataTambahan(jenisTersimpan);
        if (typeof aturKolomKeperluan === "function")
          aturKolomKeperluan(jenisTersimpan);
      }

      // Pulihkan baris-baris field daftar
      Object.entries(draf.list || {}).forEach(([idDaftar, barisList]) => {
        const daftar = document.getElementById(idDaftar);
        if (!daftar || !barisList.length) return;
        const tombolTambah =
          daftar.parentElement.querySelector(".btn-tambah-baris");
        daftar.innerHTML = "";
        barisList.forEach(() => tombolTambah.click());
        [...daftar.querySelectorAll(".baris-list")].forEach((baris, i) => {
          baris.querySelectorAll("[data-kolom]").forEach((inp) => {
            inp.value = barisList[i][inp.dataset.kolom] || "";
          });
        });
      });

      // Pulihkan field tambahan biasa
      Object.entries(draf.tambahan || {}).forEach(([id, nilai]) => {
        const el = document.getElementById(id);
        if (el) el.value = nilai;
      });

      // Pulihkan pratinjau surat yang sudah dibuat
      if (draf.currentSuratId) {
        currentSuratId = draf.currentSuratId;
        document.getElementById("preview-placeholder").classList.add("hidden");
        const iframe = document.getElementById("preview-iframe");
        iframe.classList.remove("hidden");
        iframe.src = `${API_BASE_URL}/api/surat/${currentSuratId}/preview`;
      }
    }, 100);
  }

  // Simpan tiap kali ada isian yang berubah, dan tepat sebelum halaman di-refresh/ditutup
  document
    .querySelector("#generator form")
    .addEventListener("input", simpanDraf);
  document
    .querySelector("#generator form")
    .addEventListener("change", simpanDraf);
  window.addEventListener("beforeunload", simpanDraf);

  muatJenisSurat();
  pulihkanDraf();

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
      console.error("Error muat penduduk:", err);
    }
  }

  function renderTabelPenduduk(data) {
    const tbody = document.getElementById("tabel-penduduk-body");
    tbody.innerHTML = "";
    penddukCache = {};

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-secondary font-body-sm">Tidak ada data yang cocok</td></tr>`;
      return;
    }

    data.forEach((p) => {
      penddukCache[p.id] = p;
      const tr = document.createElement("tr");
      tr.className =
        "border-b border-soft-accent hover:bg-surface-container-low";
      tr.innerHTML = `
                    <td class="p-3 font-body-sm">${p.nik}</td>
                    <td class="p-3 font-body-sm">${p.nama}</td>
                    <td class="p-3 font-body-sm">${p.alamat || "-"}</td>
                    <td class="p-3 font-body-sm">${p.pekerjaan || "-"}</td>
                    <td class="p-3 font-body-sm flex gap-2">
                        <button class="text-primary hover:underline cursor-pointer" data-edit-id="${p.id}">Edit</button>
                        <button class="text-error hover:underline cursor-pointer" data-hapus-id="${p.id}">Hapus</button>
                    </td>
                `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-edit-id]").forEach((btn) => {
      btn.addEventListener("click", () => bukaFormEdit(btn.dataset.editId));
    });
    tbody.querySelectorAll("[data-hapus-id]").forEach((btn) => {
      btn.addEventListener("click", () => hapusPenduduk(btn.dataset.hapusId));
    });
  }

  // ============ PENCARIAN PENDUDUK ============
  document.getElementById("cari-penduduk").addEventListener("input", (e) => {
    const kataKunci = e.target.value.trim().toLowerCase();

    if (!kataKunci) {
      renderTabelPenduduk(semuaPendudukCache);
      return;
    }

    const hasilFilter = semuaPendudukCache.filter(
      (p) =>
        p.nama.toLowerCase().includes(kataKunci) || p.nik.includes(kataKunci),
    );

    renderTabelPenduduk(hasilFilter);
  });

  // ============ FORM TAMBAH / EDIT ============
  function resetFormPenduduk() {
    document.getElementById("rd-id").value = "";
    document.getElementById("rd-nik").value = "";
    document.getElementById("rd-nik").disabled = false;
    document.getElementById("rd-no-kk").value = "";
    document.getElementById("rd-nama").value = "";
    document.getElementById("rd-tempat-lahir").value = "";
    document.getElementById("rd-tanggal-lahir").value = "";
    document.getElementById("rd-jenis-kelamin").value = "L";
    document.getElementById("rd-agama").value = "";
    document.getElementById("rd-pekerjaan").value = "";
    document.getElementById("rd-status-perkawinan").value = "";
    document.getElementById("rd-alamat").value = "";
  }

  document
    .getElementById("btn-tambah-penduduk")
    .addEventListener("click", () => {
      resetFormPenduduk();
      document.getElementById("form-penduduk-judul").textContent =
        "Tambah Penduduk Baru";
      const form = document.getElementById("form-penduduk");
      form.classList.remove("hidden");
      form.classList.add("flex");
    });

  document.getElementById("btn-batal-rd").addEventListener("click", () => {
    const form = document.getElementById("form-penduduk");
    form.classList.add("hidden");
    form.classList.remove("flex");
  });

  function bukaFormEdit(id) {
    const p = penddukCache[id];
    if (!p) return;

    document.getElementById("rd-id").value = p.id;
    document.getElementById("rd-nik").value = p.nik;
    document.getElementById("rd-nik").disabled = true; // NIK tidak boleh diubah saat edit
    document.getElementById("rd-no-kk").value = p.no_kk || "";
    document.getElementById("rd-nama").value = p.nama;
    document.getElementById("rd-tempat-lahir").value = p.tempat_lahir || "";
    document.getElementById("rd-tanggal-lahir").value = p.tanggal_lahir || "";
    document.getElementById("rd-jenis-kelamin").value = p.jenis_kelamin || "L";
    document.getElementById("rd-agama").value = p.agama || "";
    document.getElementById("rd-pekerjaan").value = p.pekerjaan || "";
    document.getElementById("rd-status-perkawinan").value =
      p.status_perkawinan || "";
    document.getElementById("rd-alamat").value = p.alamat || "";

    document.getElementById("form-penduduk-judul").textContent =
      "Edit Data Penduduk";
    const form = document.getElementById("form-penduduk");
    form.classList.remove("hidden");
    form.classList.add("flex");
  }

  // ============ SIMPAN (TAMBAH ATAU EDIT) ============
  document
    .getElementById("btn-simpan-rd")
    .addEventListener("click", async () => {
      const id = document.getElementById("rd-id").value;
      const payload = {
        nik: document.getElementById("rd-nik").value,
        no_kk: document.getElementById("rd-no-kk").value,
        nama: document.getElementById("rd-nama").value,
        tempat_lahir: document.getElementById("rd-tempat-lahir").value,
        tanggal_lahir: document.getElementById("rd-tanggal-lahir").value,
        jenis_kelamin: document.getElementById("rd-jenis-kelamin").value,
        agama: document.getElementById("rd-agama").value,
        pekerjaan: document.getElementById("rd-pekerjaan").value,
        status_perkawinan: document.getElementById("rd-status-perkawinan")
          .value,
        alamat: document.getElementById("rd-alamat").value,
      };

      if (!payload.nik || !payload.nama) {
        return alert("NIK dan Nama wajib diisi");
      }

      try {
        const url = id
          ? `${API_BASE_URL}/api/penduduk/${id}`
          : `${API_BASE_URL}/api/penduduk`;
        const method = id ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const hasil = await res.json();

        if (!hasil.sukses) return alert("Gagal simpan: " + hasil.pesan);

        document.getElementById("form-penduduk").classList.add("hidden");
        document.getElementById("form-penduduk").classList.remove("flex");
        muatDaftarPenduduk();
      } catch (err) {
        alert("Gagal terhubung ke server");
        console.error(err);
      }
    });

  // ============ HAPUS ============
  async function hapusPenduduk(id) {
    if (!confirm("Yakin ingin menghapus data penduduk ini?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/penduduk/${id}`, {
        method: "DELETE",
      });
      const hasil = await res.json();

      if (!hasil.sukses) return alert("Gagal hapus: " + hasil.pesan);
      muatDaftarPenduduk();
    } catch (err) {
      alert("Gagal terhubung ke server");
      console.error(err);
    }
  }

  // ============ DOKUMEN BARU ============
  document.getElementById("btn-dokumen-baru").addEventListener("click", () => {
    const adaIsian =
      document.getElementById("input-nik").value.trim() ||
      document.getElementById("input-type").value ||
      document.getElementById("input-doc-number").value.trim() ||
      document.getElementById("input-purpose").value.trim();

    if (
      adaIsian &&
      !confirm(
        "Form yang sedang diisi akan dikosongkan. Lanjut buat dokumen baru?",
      )
    ) {
      return;
    }

    // Muat ulang aplikasi supaya form, pratinjau, dan data surat sebelumnya bersih total
    lewatiSimpanDraf = true;
    localStorage.removeItem(KUNCI_DRAF);
    window.location.reload();
  });

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
      console.error("Error muat laporan:", err);
    }
  }

  function muatFilterJenisLaporan() {
    const select = document.getElementById("filter-jenis-laporan");
    if (select.options.length > 1) return; // sudah pernah diisi, jangan diisi ulang

    const jenisUnik = {};
    semuaSuratCache.forEach((s) => {
      if (s.jenis_surat) jenisUnik[s.jenis_surat.kode] = s.jenis_surat.nama;
    });

    Object.entries(jenisUnik).forEach(([kode, nama]) => {
      const option = document.createElement("option");
      option.value = kode;
      option.textContent = nama;
      select.appendChild(option);
    });
  }

  function renderTabelLaporan() {
    const filterJenis = document.getElementById("filter-jenis-laporan").value;
    const filterStatus = document.getElementById("filter-status-laporan").value;

    const dataFiltered = semuaSuratCache.filter((s) => {
      const cocokJenis =
        !filterJenis || (s.jenis_surat && s.jenis_surat.kode === filterJenis);
      const cocokStatus = !filterStatus || s.status === filterStatus;
      return cocokJenis && cocokStatus;
    });

    // Update angka ringkasan (selalu dari data keseluruhan, bukan hasil filter)
    document.getElementById("stat-total").textContent = semuaSuratCache.length;
    document.getElementById("stat-disetujui").textContent =
      semuaSuratCache.filter((s) => s.status === "disetujui").length;
    document.getElementById("stat-draft").textContent = semuaSuratCache.filter(
      (s) => s.status === "draft",
    ).length;

    const tbody = document.getElementById("tabel-laporan-body");
    tbody.innerHTML = "";

    dataFiltered.forEach((s) => {
      const tanggal = new Date(s.tanggal_dibuat).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const statusBadge =
        s.status === "disetujui"
          ? '<span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">Disetujui</span>'
          : '<span class="bg-surface-container-high text-secondary px-2 py-1 rounded-full text-xs font-medium">Draft</span>';

      // Kalau data penduduknya sudah terhapus (misal surat kematian), ambil nama dari snapshot
      const namaPemohon = s.penduduk
        ? s.penduduk.nama
        : s.data_tambahan && s.data_tambahan.snapshot_penduduk
          ? s.data_tambahan.snapshot_penduduk.nama
          : "-";

      const tr = document.createElement("tr");
      tr.className =
        "border-b border-soft-accent hover:bg-surface-container-low";
      tr.innerHTML = `
                <td class="p-3 font-body-sm">${s.nomor_surat || "-"}</td>
                <td class="p-3 font-body-sm">${s.jenis_surat ? s.jenis_surat.nama : "-"}</td>
                <td class="p-3 font-body-sm">${namaPemohon}</td>
                <td class="p-3 font-body-sm">${tanggal}</td>
                <td class="p-3 font-body-sm">${statusBadge}</td>
                <td class="p-3 font-body-sm whitespace-nowrap">
                    <button class="text-primary hover:underline cursor-pointer" data-lihat-id="${s.id}">Lihat PDF</button>
                    <button class="text-red-600 hover:underline cursor-pointer ml-3" data-hapus-id="${s.id}">Hapus</button>
                </td>
            `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll("[data-lihat-id]").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.open(
          `${API_BASE_URL}/api/surat/${btn.dataset.lihatId}/pdf`,
          "_blank",
        );
      });
    });

    tbody.querySelectorAll("[data-hapus-id]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.hapusId;
        const surat = semuaSuratCache.find((s) => s.id === id);
        const jenis =
          surat && surat.jenis_surat ? surat.jenis_surat.nama : "surat ini";
        const nomor =
          surat && surat.nomor_surat ? ` (Nomor: ${surat.nomor_surat})` : "";

        let pesan = `Yakin mau menghapus ${jenis}${nomor}?\n\nData yang sudah dihapus tidak bisa dikembalikan.`;
        if (
          surat &&
          surat.jenis_surat &&
          surat.jenis_surat.kode === "KEMATIAN" &&
          surat.status === "disetujui"
        ) {
          pesan +=
            "\n\nPERHATIAN: data penduduk untuk surat kematian ini sudah terhapus. Surat ini adalah satu-satunya catatan yang tersisa.";
        }
        if (!confirm(pesan)) return;

        btn.disabled = true;
        btn.textContent = "Menghapus...";

        try {
          const res = await fetch(`${API_BASE_URL}/api/surat/${id}`, {
            method: "DELETE",
          });
          const hasil = await res.json();

          if (!hasil.sukses) {
            alert("Gagal menghapus surat: " + hasil.pesan);
            btn.disabled = false;
            btn.textContent = "Hapus";
            return;
          }

          // Buang dari cache, lalu gambar ulang tabel & angka ringkasan
          semuaSuratCache = semuaSuratCache.filter((s) => s.id !== id);
          renderTabelLaporan();
        } catch (err) {
          console.error("Error hapus surat:", err);
          alert("Gagal menghapus surat. Cek koneksi ke server.");
          btn.disabled = false;
          btn.textContent = "Hapus";
        }
      });
    });
  }

  document
    .getElementById("filter-jenis-laporan")
    .addEventListener("change", renderTabelLaporan);
  document
    .getElementById("filter-status-laporan")
    .addEventListener("change", renderTabelLaporan);
});
