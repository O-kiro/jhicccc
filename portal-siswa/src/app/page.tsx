'use client';

import { useState } from 'react';

type Tab = 'login' | 'Overview' | 'Rapor Digital' | 'Kursus' | 'Ujian' | 'CBT Question' | 'Perpustakaan' | 'Forum Murid';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('login');
  const [cbtAnswer, setCbtAnswer] = useState<string>('B');
  const [libraryFilter, setLibraryFilter] = useState('All');
  const [courseFilter, setCourseFilter] = useState('All');

  if (activeTab === 'login') {
    return (
      <main className="login-wrapper">
        <div className="login-left">
          <div className="login-brand">MAN Kota Batu</div>
          <p className="login-motto">&quot;Berilmu. Berakhlak. Berprestasi.&quot;</p>
          <p className="login-desc">
            Gerbang digital menuju ekosistem pendidikan yang memadukan tradisi keilmuan Islam dan inovasi teknologi modern.
          </p>
        </div>
        <div className="login-right">
          <h2>Selamat Datang Kembali</h2>
          <p className="login-sub">Silakan masuk untuk mengakses layanan akademik anda.</p>
          <form onSubmit={(e) => { e.preventDefault(); setActiveTab('Overview'); }}>
            <div className="form-group">
              <label>NISN</label>
              <input type="text" placeholder="Masukkan NISN" defaultValue="009283741" required />
            </div>
            <div className="form-group">
              <div className="flex-between">
                <label>Kata Sandi</label>
                <a href="#forgot" className="link-text">Lupa Kata Sandi?</a>
              </div>
              <input type="password" defaultValue="password123" required />
            </div>
            <div className="form-checkbox">
              <input type="checkbox" id="remember" defaultChecked />
              <label htmlFor="remember">Ingat saya di perangkat ini</label>
            </div>
            <button type="submit" className="btn-primary full-width">Masuk ke Portal</button>
          </form>
          <p className="login-register">
            Belum memiliki akun? <a href="#admin" className="link-text">Hubungi Admin Madrasah</a>
          </p>
          <footer className="login-footer">
            © 2024 MAN Kota Batu Integrated Digital Service. Dilindungi oleh enkripsi keamanan tingkat tinggi.
          </footer>
        </div>
      </main>
    );
  }

  const isCbtPage = activeTab === 'CBT Question';

  return (
    <div className="app-shell">
      {!isCbtPage && (
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">M</div>
            <div>
              <b>MAN KOTA BATU</b>
              <small>STUDENT PORTAL</small>
            </div>
          </div>
          <div className="profile">
            <div className="avatar">AM</div>
            <div>
              <b>Akhnaf Meyfan</b>
              <span>Siswa • X-B</span>
            </div>
          </div>
          <nav>
            {(['Overview', 'Rapor Digital', 'Kursus', 'Ujian', 'Perpustakaan', 'Forum Murid'] as Tab[]).map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'nav-item active' : 'nav-item'}
                onClick={() => setActiveTab(tab)}
              >
                <span>{tab === 'Overview' ? '⌂' : tab === 'Rapor Digital' ? '▣' : tab === 'Kursus' ? '▤' : tab === 'Ujian' ? '✓' : tab === 'Perpustakaan' ? '▥' : '◌'}</span>
                {tab}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="next-card">
              <small>KELAS SELANJUTNYA</small>
              <b>Ikuti Kelas Live — Matematika</b>
              <span>08:30–09.45 WIB</span>
              <button onClick={() => setActiveTab('Overview')}>Gabung Kelas</button>
            </div>
            <button className="plain" onClick={() => alert('Hubungi Admin jika ada masalah.')}>? Bantuan</button>
            <button className="plain" onClick={() => setActiveTab('login')}>↪ Keluar</button>
          </div>
        </aside>
      )}

      <main className={isCbtPage ? 'content full-width' : 'content'}>
        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <section>
            <header>
              <div>
                <span className="eyebrow">PORTAL AKADEMIK / OVERVIEW</span>
                <h1>Assalamu&apos;alaikum, Akhnaf Meyfan</h1>
                <p className="quote">
                  &quot;Ilmu itu seperti air, seraplah dengan pikiran yang terbuka, lalu hiasi dengan akhlak yang mulia agar bermanfaat bagi dunia dan agama.&quot;
                </p>
              </div>
              <div className="header-actions">
                <button className="icon-button" onClick={() => setActiveTab('CBT Question')}>CBT Demo</button>
                <div className="header-avatar">AM</div>
              </div>
            </header>

            <div className="streak">
              <div className="streak-icon">✦</div>
              <div>
                <b>Daily Streak: 14 Hari</b>
                <span>Konsistensi belajar harian kamu</span>
              </div>
              <div className="progress"><i></i></div>
              <button className="secondary" onClick={() => setActiveTab('Kursus')}>Lanjutkan Belajar</button>
              <button className="outline" onClick={() => setActiveTab('Ujian')}>Lihat Jadwal</button>
            </div>

            <div className="stats">
              <article>
                <span>RATA-RATA RAPOR</span>
                <strong>88.3</strong>
                <em className="green">● Sangat Baik</em>
              </article>
              <article>
                <span>KEHADIRAN</span>
                <strong>98.5<small>%</small></strong>
                <em className="green">● Good</em>
              </article>
              <article>
                <span>TUGAS</span>
                <strong>5</strong>
                <em className="orange">● 3 Segera Dikumpulkan!!</em>
              </article>
            </div>

            <div className="grid">
              <section className="panel schedule">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">JADWAL HARI INI</span>
                    <h2>Mata Pelajaran</h2>
                  </div>
                </div>
                <div className="lesson">
                  <time>07:00–08:30</time>
                  <div className="lesson-dot"></div>
                  <div className="lesson-info"><b>Fiqih</b><span>Ust. H. Abdurrahman</span></div>
                </div>
                <div className="lesson live">
                  <time>08:30–09:45</time>
                  <div className="lesson-dot"></div>
                  <div className="lesson-info"><b>Matematika</b><span>Rini Waraswati, S.Pd, M.Si</span></div>
                  <button className="live-button">🔴 LIVE NOW</button>
                  <button className="btn-sm" style={{ marginLeft: 8 }}>Gabung Kelas</button>
                </div>
                <div className="lesson">
                  <time>09:45–11:45</time>
                  <div className="lesson-dot"></div>
                  <div className="lesson-info"><b>Kimia</b><span>Dra. Sukrawati Arni</span></div>
                </div>
                <div className="lesson">
                  <time>12:30–13:50</time>
                  <div className="lesson-dot"></div>
                  <div className="lesson-info"><b>Bahasa Arab</b><span>Indah Rahmayanti, S.Pd</span></div>
                </div>
                <div className="lesson">
                  <time>13:50–14:45</time>
                  <div className="lesson-dot"></div>
                  <div className="lesson-info"><b>Sejarah Kebudayaan Islam</b><span>Aslanik, S.Pd.I</span></div>
                </div>
              </section>

              <section className="panel news">
                <div className="panel-heading">
                  <div>
                    <span className="eyebrow">NEWS</span>
                    <h2>Pengumuman</h2>
                  </div>
                </div>
                <div className="news-item">
                  <span>Maret 15, 2026</span>
                  <b>Kebijakan Seragam Sekolah</b>
                  <p>Kebijakan baru tentang seragam</p>
                </div>
                <div className="news-item">
                  <span>Maret 12, 2026</span>
                  <b>Kompetisi Robotik</b>
                  <p>Pendaftaran untuk turnamen robotika tahunan tingkat sekolah</p>
                </div>
                <div className="news-item">
                  <span>Maret 10, 2026</span>
                  <b>Pertemuan Orang Tua dan Guru</b>
                  <p>Rapat evaluasi bulanan untuk orang tua akan diadakan pada hari Sabtu ini.</p>
                </div>
              </section>
            </div>
          </section>
        )}

        {/* UJIAN / CBT */}
        {activeTab === 'Ujian' && (
          <section>
            <header>
              <div>
                <span className="eyebrow">COMPUTER BASED TEST</span>
                <h1>Pusat Ujian &amp; Evaluasi</h1>
                <p className="quote">Kelola penilaian akademik Anda, pantau hasil kinerja, dan ikuti sesi latihan CBT.</p>
              </div>
            </header>

            <div className="grid grid-3-1" style={{ marginTop: 24 }}>
              <div>
                <h2>Ujian Mendatang</h2>
                <div className="panel card-highlight">
                  <div className="badge-high">High Priority</div>
                  <h3>MATEMATIKA — Calculus &amp; Integration</h3>
                  <p>Oktober 24, 2026, 08:30–10:30</p>
                  <div className="countdown">MULAI DALAM 02:14:30</div>
                  <button className="btn-primary" onClick={() => setActiveTab('CBT Question')}>Masuk Ke Dalam Ujian</button>
                </div>

                <div className="panel" style={{ marginTop: 16 }}>
                  <div className="news-item" style={{ borderTop: 0 }}>
                    <b>SKI — Masa Kejayaan An-Dalusia</b>
                    <p>Hari Ini, 13:00</p>
                  </div>
                  <div className="news-item">
                    <b>BAHASA INGGRIS — Reading &amp; Vocab</b>
                    <p>Besok, 09:00</p>
                  </div>
                </div>

                <h2 style={{ marginTop: 32 }}>Hasil Ujian</h2>
                <div className="panel">
                  <div className="flex-between news-item" style={{ borderTop: 0 }}>
                    <div>
                      <b>FISIKA</b>
                      <p>Selesai pada Mei 12, 2026 • Score 92</p>
                    </div>
                    <div className="badge-success">Nilai 92% (Selesai)</div>
                  </div>
                  <div className="flex-between news-item">
                    <div>
                      <b>BIOLOGI</b>
                      <p>Selesai pada Mei 08, 2026 • Score 85</p>
                    </div>
                    <div className="badge-success">Nilai 85% (Selesai)</div>
                  </div>
                </div>

                <h2 style={{ marginTop: 32 }}>Simulasi CBT</h2>
                <div className="panel flex-between">
                  <div>
                    <b>Sesi Latihan Mandiri</b>
                    <p className="quote">Uji pemahaman kamu sebelum ujian resmi dimulai.</p>
                  </div>
                  <button className="secondary" onClick={() => setActiveTab('CBT Question')}>Mulai Simulasi</button>
                </div>
              </div>

              <div>
                <h2>Aturan Ujian</h2>
                <div className="panel rules-panel">
                  <ol>
                    <li>Harus Menggunakan Wifi MAKOBA Dan Tidak Diperbolehkan Menggunakan sim card</li>
                    <li>Tidak boleh menggunakan tab atau aplikasi lain saat sesi CBT aktif.</li>
                    <li>Dilarang Berganti atau Beralih tab</li>
                  </ol>
                  <hr style={{ margin: '20px 0', borderColor: 'var(--line)' }} />
                  <div className="help-box">
                    <b>Admin</b>
                    <p style={{ fontSize: 11, color: 'var(--muted)' }}>Jika Ada Masalah</p>
                    <button className="btn-sm" style={{ marginTop: 10 }}>Bantuan Admin</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CBT QUESTION PAGE */}
        {activeTab === 'CBT Question' && (
          <section className="cbt-layout">
            <header className="cbt-header">
              <div>
                <span className="eyebrow">PAS GANJIL • AKIDAH AKHLAK</span>
                <h2>Pertanyaan Ke-14 — Pilihan Ganda</h2>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>Siswa: Akhnaf Meyfan — NISN: 009283741</p>
              </div>
              <div className="timer-box">
                <small>SISA WAKTU</small>
                <strong>01:42:03</strong>
              </div>
            </header>

            <div className="grid grid-3-1" style={{ marginTop: 24 }}>
              <div className="panel">
                <blockquote className="question-text">
                  &quot;Sifat terpuji yang dimiliki oleh Nabi Ibrahim AS ketika menghadapi cobaan dari Allah SWT berupa perintah untuk menyembelih putra tercintanya, Ismail AS, menunjukkan tingkatan iman yang sangat tinggi. Perilaku ini dalam terminologi Akidah Akhlak disebut sebagai...&quot;
                </blockquote>

                <div className="options-list">
                  {[
                    ['A', 'Sabar dan Tawakal yang Mutlak'],
                    ['B', 'Ukhuwah Islamiyah'],
                    ['C', "Syaja'ah dalam berdakwah"],
                    ['D', 'Istiqomah dalam Ibadah'],
                    ['E', 'Tasamuh antar sesama'],
                  ].map(([opt, label]) => (
                    <label key={opt} className={cbtAnswer === opt ? 'option-item active' : 'option-item'}>
                      <input
                        type="radio"
                        name="cbt-opt"
                        checked={cbtAnswer === opt}
                        onChange={() => setCbtAnswer(opt)}
                      />
                      <b>{opt}.</b> <span>{label}</span>
                    </label>
                  ))}
                </div>

                <div className="cbt-actions flex-between" style={{ marginTop: 30 }}>
                  <button className="outline">Sebelumnya</button>
                  <button className="btn-warning">Ragu-ragu</button>
                  <button className="secondary">Selanjutnya</button>
                </div>
              </div>

              <div>
                <div className="panel">
                  <h3>Navigasi Soal</h3>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 15 }}>Total soal: 40</p>
                  <div className="cbt-grid">
                    {Array.from({ length: 40 }, (_, i) => {
                      const num = i + 1;
                      let statusClass = 'num-item';
                      if (num === 14) statusClass += ' current';
                      else if (num < 14) statusClass += ' done';
                      else if (num === 18) statusClass += ' doubtful';
                      return (
                        <button key={num} className={statusClass} onClick={() => alert(`Ke soal ${num}`)}>
                          {num}
                        </button>
                      );
                    })}
                  </div>

                  <div className="legend" style={{ marginTop: 20 }}>
                    <div><span className="dot done"></span> Sudah</div>
                    <div><span className="dot"></span> Belum</div>
                    <div><span className="dot doubtful"></span> Ragu-ragu</div>
                    <div><span className="dot current"></span> Aktif</div>
                  </div>

                  <button className="btn-danger full-width" style={{ marginTop: 20 }} onClick={() => setActiveTab('Ujian')}>
                    Selesai Ujian
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* KURSUS */}
        {activeTab === 'Kursus' && (
          <section>
            <header>
              <div>
                <span className="eyebrow">DAFTAR MATA PELAJARAN</span>
                <h1>Semester Ganjil 2025/2026</h1>
                <p className="quote">Kelola kemajuan belajar kamu, akses modul, dan berinteraksi dengan pengajar kamu di platform akademik kami yang terintegrasi.</p>
              </div>
            </header>

            <div className="filters" style={{ margin: '20px 0' }}>
              {['All', 'Agama', 'Sains'].map((cat) => (
                <button
                  key={cat}
                  className={courseFilter === cat ? 'filter-btn active' : 'filter-btn'}
                  onClick={() => setCourseFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-3">
              {[
                { name: 'Quran Hadist', teacher: 'Ustadz Ahmad Fauzi, M.Ag', cat: 'Agama' },
                { name: 'Fiqih', teacher: 'Ani Nur Aisyah, S.Ag', cat: 'Agama' },
                { name: 'Matematika', teacher: 'Rini Waraswati, S.Pd, M.Si', cat: 'Sains' },
                { name: 'Kimia', teacher: 'Dra. Sukrawati Arni', cat: 'Sains' },
                { name: 'Bahasa Inggris', teacher: 'Indah Rahmayanti, S.Pd', cat: 'All' },
                { name: 'Fisika', teacher: 'Anisak Intan Eka Prani, M.Si', cat: 'Sains' },
              ]
                .filter((c) => courseFilter === 'All' || c.cat === courseFilter || c.cat === 'All')
                .map((course) => (
                  <div key={course.name} className="panel course-card">
                    <span className="eyebrow">{course.cat}</span>
                    <h3>{course.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--muted)' }}>{course.teacher}</p>
                    <button className="secondary full-width" style={{ marginTop: 20 }}>View Modules</button>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* RAPOR DIGITAL */}
        {activeTab === 'Rapor Digital' && (
          <section>
            <header className="flex-between">
              <div>
                <span className="eyebrow">RAPOR DIGITAL MADRASAH (RDM)</span>
                <h1>Semester Ganjil 2025/2026 • Kelas X-B</h1>
              </div>
              <button className="secondary">Unduh Rapor Digital Lengkap (PDF)</button>
            </header>

            <div className="stats" style={{ marginTop: 24 }}>
              <article>
                <span>RATA-RATA RAPOR</span>
                <strong>88.3</strong>
              </article>
              <article>
                <span>PERINGKAT KELAS</span>
                <strong>2 <small>of 32</small></strong>
              </article>
              <article>
                <span>KEHADIRAN</span>
                <strong>98.5%</strong>
              </article>
            </div>

            <div className="grid" style={{ marginTop: 24 }}>
              <div className="panel">
                <h2>Sejarah Nilai</h2>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>Filter: Semester Ganjil 2025</p>
                <div className="chart-placeholder" style={{ height: 180, display: 'flex', alignItems: 'flex-end', gap: 20, padding: '20px 0' }}>
                  {[['Aug', 82], ['Sep', 85], ['Oct', 84], ['Nov', 89], ['Dec', 88], ['Jan', 91]].map(([m, val]) => (
                    <div key={m as string} style={{ textAlign: 'center', flex: 1 }}>
                      <div style={{ height: `${(val as number) * 1.5}px`, background: 'var(--green)', borderRadius: 4 }}></div>
                      <small style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, display: 'block' }}>{m}</small>
                    </div>
                  ))}
                </div>

                <h3 style={{ marginTop: 20 }}>Penilaian Terbaru</h3>
                <ul className="news-item" style={{ listStyle: 'none', padding: 0 }}>
                  <li className="flex-between" style={{ padding: '8px 0' }}><span>Quran Hadist</span><b>94</b></li>
                  <li className="flex-between" style={{ padding: '8px 0' }}><span>Matematika</span><b>88</b></li>
                  <li className="flex-between" style={{ padding: '8px 0' }}><span>Fisika</span><b>91</b></li>
                </ul>
              </div>

              <div className="panel">
                <h2>Teacher Feedback</h2>
                <div className="feedback-list">
                  <div className="news-item" style={{ borderTop: 0 }}>
                    <b>Siti Muthomimah, S.Pd <small style={{ color: 'var(--muted)', fontWeight: 'normal' }}>• Wali Kelas, 2 hari lalu</small></b>
                    <p>&quot;Akhnaf telah menunjukkan perkembangan luar biasa dalam kemampuan kepemimpinannya semester ini. Kontribusinya di forum kelas sangat keren.&quot;</p>
                  </div>
                  <div className="news-item">
                    <b>Ahmad Fauzan, M.Pd <small style={{ color: 'var(--muted)', fontWeight: 'normal' }}>• Guru Quran Hadist, 1 minggu lalu</small></b>
                    <p>&quot;Performa menghafal yang luar biasa. Terus pertahankan konsistensimu dalam belajar Al-Quran dan Hadist&quot;</p>
                  </div>
                  <div className="news-item">
                    <b>Anisak Intan Eka Prani, M.Si <small style={{ color: 'var(--muted)', fontWeight: 'normal' }}>• Guru Fisika, 2 hari lalu</small></b>
                    <p>&quot;Dalam pelajaran Fisika, Akhnaf menunjukkan pemahaman konsep yang cukup baik, terutama saat praktikum...&quot;</p>
                  </div>
                  <div className="news-item">
                    <b>Rini Waraswati, S.Pd, M.Si <small style={{ color: 'var(--muted)', fontWeight: 'normal' }}>• Guru Matematika, 2 hari lalu</small></b>
                    <p>&quot;Akhnaf menunjukkan perkembangan yang baik dalam pembelajaran Matematika semester ini...&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PERPUSTAKAAN */}
        {activeTab === 'Perpustakaan' && (
          <section>
            <header className="flex-between">
              <div>
                <span className="eyebrow">PERPUSTAKAAN DIGITAL</span>
                <h1>Jelajahi Koleksi</h1>
                <p className="quote">Jelajahi sumber daya akademis dan spiritual pilihan kami.</p>
              </div>
              <button className="outline">Dashboard Saya</button>
            </header>

            <h2 style={{ marginTop: 24 }}>Kategori</h2>
            <div className="grid grid-3">
              <div className="panel"><b>Studi Islam</b><p style={{ fontSize: 12, color: 'var(--muted)' }}>2.400+ judul</p></div>
              <div className="panel"><b>Sains &amp; Teknologi</b><p style={{ fontSize: 12, color: 'var(--muted)' }}>1.850+ judul</p></div>
              <div className="panel"><b>Humaniora</b><p style={{ fontSize: 12, color: 'var(--muted)' }}>1.200+ judul</p></div>
            </div>

            <div className="panel active-read" style={{ marginTop: 24, background: '#f0f7f4' }}>
              <span className="eyebrow">LANJUTKAN MEMBACA (Baru dibuka)</span>
              <h3>Zaman Keemasan Islam: Rumah Kebijaksanaan</h3>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>
                Telusuri kisah Baitul Hikmah di Baghdad, pusat penerjemahan dan ilmu pengetahuan yang mempertemukan tradisi Yunani, Persia, dan India dalam satu peradaban intelektual.
              </p>
              <div className="flex-between" style={{ marginTop: 15 }}>
                <span>Chapter 4: The Golden Age — Page 142 of 350 (Progres 42%)</span>
                <div>
                  <button className="secondary" style={{ marginRight: 10 }}>Lanjutkan Membaca</button>
                  <button className="outline">Lihat Anotasi</button>
                </div>
              </div>
            </div>

            <h2 style={{ marginTop: 32 }}>Buku Dipinjam</h2>
            <div className="panel">
              <div className="news-item flex-between" style={{ borderTop: 0 }}>
                <div><b>Informatika Kelas XI</b></div>
                <span className="badge-warning">Jatuh tempo dalam 2 hari</span>
              </div>
              <div className="news-item flex-between">
                <div><b>Matematika TL Kelas XI</b></div>
                <span className="badge-warning">Jatuh tempo dalam 5 hari</span>
              </div>
              <div className="news-item flex-between">
                <div><b>Akidah Akhlak Kelas XI</b></div>
                <span className="badge-warning">Jatuh tempo dalam 2 hari</span>
              </div>
            </div>
          </section>
        )}

        {/* FORUM MURID */}
        {activeTab === 'Forum Murid' && (
          <section>
            <header className="flex-between">
              <div>
                <span className="eyebrow">FORUM DISKUSI SISWA</span>
                <h1>Forum Murid</h1>
                <p className="quote">Terhubung, berbagi wawasan, dan berdiskusi mengenai kehidupan akademik serta ekstrakurikuler bersama komunitas MAN Kota Batu.</p>
              </div>
              <button className="secondary">Mulai Topik Baru</button>
            </header>

            <div className="grid grid-3" style={{ marginTop: 24 }}>
              <div className="panel">
                <b>Diskusi Akademik</b>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>Topik tentang mata pelajaran, ujian, dan persiapan olimpiade.</p>
                <small style={{ color: 'var(--green)', fontWeight: 'bold' }}>124 Active Threads</small>
              </div>
              <div className="panel">
                <b>Ekstrakulikuler</b>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>Klub, olahraga, seni, dan kegiatan organisasi mahasiswa.</p>
                <small style={{ color: 'var(--green)', fontWeight: 'bold' }}>86 Active Threads</small>
              </div>
              <div className="panel">
                <b>Madrasah Life</b>
                <p style={{ fontSize: 11, color: 'var(--muted)' }}>Kegiatan keagamaan, pembentukan karakter, dan suasana sekolah.</p>
                <small style={{ color: 'var(--green)', fontWeight: 'bold' }}>52 Active Threads</small>
              </div>
            </div>

            <div className="grid grid-3-1" style={{ marginTop: 24 }}>
              <div>
                <h2>Recent Discussions</h2>
                <div className="panel">
                  <div className="news-item" style={{ borderTop: 0 }}>
                    <span className="eyebrow">[Diskusi Akademik]</span>
                    <h3 style={{ margin: '4px 0' }}>Strategi Belajar Efektif Menjelang Ujian Tengah Semester</h3>
                    <small style={{ color: 'var(--muted)' }}>@Tumbal_pakaL • 2h ago</small>
                    <p style={{ marginTop: 6 }}>&quot;Mari berbagi tips membagi waktu belajar dan kegiatan ekskul agar nilai tetap maksimal di tengah jadwal yang padat bulan ini.&quot;</p>
                    <small style={{ color: 'var(--green)', marginTop: 8, display: 'block' }}>24 Replies • 82 Likes</small>
                  </div>
                  <div className="news-item">
                    <span className="eyebrow">[Madrasah Life]</span>
                    <h3 style={{ margin: '4px 0' }}>Cara cepat naik rank immortal di season 41</h3>
                    <small style={{ color: 'var(--muted)' }}>@FINEshyt • 5h ago</small>
                    <p style={{ marginTop: 6 }}>&quot;Saran Hero buat push rank dong suhuu, tiap hari stuck di epic terus huhu&quot;</p>
                    <small style={{ color: 'var(--green)', marginTop: 8, display: 'block' }}>48 Replies • 82 Likes</small>
                  </div>
                  <div className="news-item">
                    <span className="eyebrow">[Madrasah Life]</span>
                    <h3 style={{ margin: '4px 0' }}>Tips Menyeimbangkan Tugas Sekolah dan Target Hafalan</h3>
                    <small style={{ color: 'var(--muted)' }}>@fian_na_imo • 1d ago</small>
                    <p style={{ marginTop: 6 }}>&quot;Banyak yang bertanya bagaimana cara mengatur jadwal antara setumpuk PR dan setoran hafalan harian. Berikut beberapa insight...&quot;</p>
                    <small style={{ color: 'var(--green)', marginTop: 8, display: 'block' }}>12 Replies • 82 Likes</small>
                  </div>
                </div>
                <button className="outline full-width" style={{ marginTop: 16 }}>Muat Diskusi Lainnya</button>
              </div>

              <div>
                <h2>Forum Stats</h2>
                <div className="panel" style={{ fontSize: 12 }}>
                  <p><b>1.000</b> Active Members</p>
                  <p><b>12k+</b> Total Topics</p>
                  <p><b>636</b> Online Now</p>
                  <p><b>15</b> New Today</p>
                </div>

                <h3 style={{ marginTop: 24 }}>Trending Topics</h3>
                <div className="panel" style={{ fontSize: 11 }}>
                  <p>1. Academic — Bocoran TKA tahun ini!!!!</p>
                  <p>2. Life — Menu Kantin Baru: Apa favoritmu?</p>
                  <p>3. Clubs — Club Robotik winstreak terus!!!!</p>
                </div>

                <h3 style={{ marginTop: 24 }}>Top Kontribusi</h3>
                <div className="panel" style={{ fontSize: 11 }}>
                  <p>1. Rizky Zakaria — 420 posts</p>
                  <p>2. Nabila Azzahra — 385 posts</p>
                  <p>3. Arif Maulana — 312 posts</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
