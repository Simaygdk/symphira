// Bu type, oynatıcıya gönderilecek tek bir şarkıyı temsil eder
export type DispatchTrack = {
  trackId: string;
  // Track’in Firestore veya sistem içindeki benzersiz ID’si

  storagePath: string;
  // Şarkının Firebase Storage veya dosya yolunu temsil eder

  title?: string;
  // Şarkı başlığı (opsiyonel, UI’da göstermek için)

  artist?: string;
  // Sanatçı adı (opsiyonel, UI’da göstermek için)
};

// Bu type, oynatıcıya gönderilecek payload yapısını tanımlar
type DispatchPayload = {
  queue: DispatchTrack[];
  // Oynatılacak şarkı listesi (playlist / kuyruk)

  startIndex?: number;
  // Hangi şarkıdan başlanacağı (opsiyonel)

  autoplay?: boolean;
  // Otomatik çalsın mı? (opsiyonel)
};

// Bu fonksiyon, mini player’a şarkı kuyruğunu göndermek için kullanılır
export function dispatchPlayerQueue(payload: DispatchPayload) {
  // Browser seviyesinde custom event tetiklenir
  window.dispatchEvent(
    new CustomEvent("symphira:setQueue", {
      detail: {
        // Oynatıcıya gönderilen şarkı listesi
        queue: payload.queue,

        // startIndex verilmezse varsayılan olarak 0 alınır
        startIndex: payload.startIndex ?? 0,

        // autoplay verilmezse varsayılan olarak true kabul edilir
        autoplay: payload.autoplay ?? true,
      },
    })
  );
}
