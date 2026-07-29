import React from 'react';
import { Zap, Tag, Headphones, ShieldCheck } from 'lucide-react';
import { BENEFITS } from '@/data/mockData';

export function BenefitList() {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Tag':
        return <Tag className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-2">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {BENEFITS.map((item) => (
          <div
            key={item.id}
            className="cartoon-card p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center gap-3 hover:translate-x-[-1.5px] hover:translate-y-[-1.5px] transition-all"
          >
            <div
              className={`p-2.5 rounded-2xl border-2 border-slate-900 ${item.bgColor} ${item.iconColor} shadow-[2px_2px_0px_0px_#0F172A] shrink-0`}
            >
              {getIcon(item.iconName)}
            </div>

            <div>
              <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                {item.title}
              </h3>
              <p className="text-[11px] text-slate-600 font-medium leading-normal mt-0.5 hidden sm:block">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
