'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { RegionalPerformance } from '../../src/types/marketing';
import { fetchMarketingDataClient } from '../../src/lib/api';
import { MapPin } from 'lucide-react';

// Use dynamic import to load DualBubbleMap only on the client
const DualBubbleMap = dynamic(
  () => import('../../src/components/ui/DualBubbleMap ').then((mod) => mod.DualBubbleMap),
  { ssr: false }
);

export default function RegionView() {
  const [data, setData] = useState<RegionalPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMarketingDataClient();
        if (result.campaigns && result.campaigns[0] && result.campaigns[0].regional_performance) {
          setData(result.campaigns[0].regional_performance);
        }
      } catch (error) {
        console.error("Failed to fetch marketing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-8 sm:py-12">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center">
                <MapPin className="h-8 w-8 mr-3 text-indigo-400" />
                Regional Analytics
              </h1>
              <p className="mt-2 text-base text-gray-400">
                Visualize campaign performance across different regions and countries.
              </p>
            </div>
          </div>
        </section>
        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-400 py-10">Loading regional map...</p>
          ) : (
            <DualBubbleMap
              title="Revenue & Spend by Region"
              revenueData={data}
              spendData={data}
            />
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}