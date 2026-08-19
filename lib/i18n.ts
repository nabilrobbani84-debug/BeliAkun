export type Language = 'id' | 'en';

export const dictionaries = {
  id: {
    cartEmpty: 'Keranjang kamu masih kosong.',
    startShopping: 'Mulai Belanja',
    ordersEmpty: 'Belum ada pesanan.',
    notificationsEmpty: 'Tidak ada notifikasi baru.',
    loginToViewOrders: 'Login untuk melihat pesanan kamu.',
    login: 'Masuk',
    register: 'Daftar',
    backToShop: 'Kembali Belanja',
    markAllRead: 'Tandai semua telah dibaca',
    themeLight: 'Beralih ke Light Mode',
    themeDark: 'Beralih ke Dark Mode',
  },
  en: {
    cartEmpty: 'Your cart is still empty.',
    startShopping: 'Start Shopping',
    ordersEmpty: 'No orders yet.',
    notificationsEmpty: 'No new notifications.',
    loginToViewOrders: 'Login to view your orders.',
    login: 'Login',
    register: 'Register',
    backToShop: 'Back to Shop',
    markAllRead: 'Mark all as read',
    themeLight: 'Switch to Light Mode',
    themeDark: 'Switch to Dark Mode',
  }
};

export type Dictionary = typeof dictionaries['id'];
