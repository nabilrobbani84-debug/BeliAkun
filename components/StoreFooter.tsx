import React from 'react';
import { StoreFooter as ModularStoreFooter, StoreFooterProps } from '@/components/storefront/footer/store-footer';

export function StoreFooter(props: StoreFooterProps) {
  return <ModularStoreFooter {...props} />;
}

export { ModularStoreFooter };
