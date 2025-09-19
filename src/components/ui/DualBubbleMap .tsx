'use client';

import dynamic from 'next/dynamic';
import { RegionalPerformance } from '../../types/marketing';

// Use dynamic import to load BubbleMap only on the client
const BubbleMap = dynamic(
  () => import('./bubble-map').then((mod) => mod.BubbleMap),
  { ssr: false }
);

interface DualBubbleMapProps {
  title: string;
  revenueData: RegionalPerformance[];
  spendData: RegionalPerformance[];
}

export function DualBubbleMap({ title, revenueData, spendData }: DualBubbleMapProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Revenue & Spend by Region</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BubbleMap
          title="Revenue by Region"
          data={revenueData}
          valueType="revenue"
        />
        <BubbleMap
          title="Spend by Region"
          data={spendData}
          valueType="spend"
        />
      </div>
    </div>
  );
}
