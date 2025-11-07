const VAPID_PUBLIC_KEY = 'GANTI_DENGAN_VAPID_PUBLIC_KEY_ANDA'; // 💡 WAJIB DIGANTI

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const getSubscription = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
};

const subscribeUser = async () => {
  if (Notification.permission === 'denied') {
    alert('Izin notifikasi ditolak. Aktifkan secara manual di pengaturan browser.');
    return null;
  }

  const subscription = await getSubscription();
  if (subscription) return subscription;

  try {
    const registration = await navigator.serviceWorker.ready;
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    });
    
    // 💡 Kirim newSubscription ke server API Anda untuk disimpan
    // await fetch('URL_API_ANDA/subscribe', { method: 'POST', body: JSON.stringify(newSubscription) });

    return newSubscription;
  } catch (error) {
    console.error('Failed to subscribe:', error);
    return null;
  }
};

const unsubscribeUser = async () => {
    const subscription = await getSubscription();
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      // 💡 Kirim konfirmasi unsubscribe ke server API Anda
      // await fetch('URL_API_ANDA/unsubscribe', { method: 'POST', body: JSON.stringify({ endpoint: subscription.endpoint }) });
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
};

const PushNotificationHelper = {
  subscribeUser,
  unsubscribeUser,
  getSubscriptionStatus: getSubscription,
};

export default PushNotificationHelper;