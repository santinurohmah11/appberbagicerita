import PushNotificationHelper from '../../utils/push-notification-helper'; // 💡 Jalur standar

export default class AboutPage {
  async render() {
    return `
      <section class="container" aria-labelledby="about-title">
        <h1 id="about-title">Tentang Aplikasi</h1>
        <p>Aplikasi Berbagi Cerita ini adalah Progressive Web App (PWA) yang memungkinkan Anda berbagi lokasi dan cerita secara real-time, dapat diakses secara offline, dan mendukung notifikasi push.</p>
        
        <div class="card settings-card">
            <h2>Pengaturan Notifikasi</h2>
            <div id="notification-toggle-container">
                <p>Memuat status notifikasi...</p>
            </div>
        </div>
        
      </section>
    `;
  }

  async afterRender() {
    await this._initNotificationToggle();
  }

  async _initNotificationToggle() {
    const container = document.getElementById('notification-toggle-container'); 
    if (!container) return;
    
    const renderToggle = async () => {
        const isSubscribed = await PushNotificationHelper.getSubscriptionStatus();
        
        container.innerHTML = `
          <button id="notification-toggle-btn" class="toggle-btn">
            ${isSubscribed ? '🔴 Nonaktifkan Notifikasi' : '🟢 Aktifkan Notifikasi'}
          </button>
          <p style="font-size: 0.8em; margin-top: 5px;">Status: 
            <strong>${isSubscribed ? 'Aktif' : 'Nonaktif'}</strong>
          </p>
        `;

        document.getElementById('notification-toggle-btn').addEventListener('click', async () => {
            let success = false;
            const currentStatus = await PushNotificationHelper.getSubscriptionStatus();
            
            if (currentStatus) {
                success = await PushNotificationHelper.unsubscribeUser();
                if (success) alert('Notifikasi berhasil dinonaktifkan.');
            } else {
                const subscription = await PushNotificationHelper.subscribeUser();
                if (subscription) {
                    success = true;
                    alert('Notifikasi berhasil diaktifkan.');
                }
            }
            
            if (success) {
                renderToggle(); 
            } else if (Notification.permission === 'denied') {
                 alert('Aksi gagal: Izin notifikasi ditolak oleh browser.');
            } else {
                 alert('Gagal melakukan aksi. Periksa konsol.');
            }
        });
    };
    
    await renderToggle();
  }
}