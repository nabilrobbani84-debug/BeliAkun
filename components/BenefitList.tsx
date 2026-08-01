import React from 'react';
import { Zap, Tag, Headphones, ShieldCheck } from 'lucide-react';
import { BENEFITS } from '@/data/mockData';
import { PageContainer } from '@/components/patterns/page-container';
import { ResponsiveGrid } from '@/components/patterns/responsive-grid';
import { Card } from '@/components/ui/card';

export function BenefitList() {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-700 dark:text-amber-300" />;
      case 'Tag':
        return <Tag className="w-5 h-5 text-blue-700 dark:text-blue-300" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5 text-purple-700 dark:text-purple-300" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />;
    }
  };

  return (
    <PageContainer className="py-3 sm:py-4">
      <ResponsiveGrid variant="benefit">
        {BENEFITS.map((item) => (
          <Card
            key={item.id}
            variant="interactive"
            className="p-3.5 sm:p-4 flex items-start gap-3 sm:gap-3.5"
          >
            <div className={`p-2.5 rounded-2xl ${item.bgColor} border-2 border-[var(--border)] shadow-[2px_2px_0px_0px_var(--cartoon-shadow)] shrink-0`}>
              {getIcon(item.iconName)}
            </div>

            <div className="min-w-0">
              <h3 className="font-extrabold text-xs sm:text-sm text-[var(--foreground)] truncate">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--muted-foreground)] font-medium leading-snug mt-0.5 line-clamp-2">
                {item.description}
              </p>
            </div>
          </Card>
        ))}
      </ResponsiveGrid>
    </PageContainer>
  );
}
