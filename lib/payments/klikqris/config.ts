export interface KlikQrisConfig {
  baseUrl: string;
  createPath: string;
  statusPath: (orderId: string, merchantId: string) => string;
}

export const DRIVER_CONFIGS: Record<'sandbox' | 'inhouse' | 'my_pg', KlikQrisConfig> = {
  sandbox: {
    baseUrl: 'https://klikqris.com/api/sandbox',
    createPath: '/qris/create',
    statusPath: (orderId) => `/qris/status/${orderId}`,
  },
  inhouse: {
    baseUrl: 'https://klikqris.com/api',
    createPath: '/qris/create',
    statusPath: (orderId) => `/qris/status/${orderId}`,
  },
  my_pg: {
    baseUrl: 'https://klikqris.com/api',
    createPath: '/qrisv2/create',
    statusPath: (orderId, merchantId) => `/qrisv2/status/${merchantId}/${orderId}`,
  },
};
