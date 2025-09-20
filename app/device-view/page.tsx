'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { fetchMarketingDataClient } from '../../src/lib/api';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface DevicePerformance {
  device: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  conversion_rate: number;
  percentage_of_traffic: number;
}

export default function DeviceView() {
  const [data, setData] = useState<DevicePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMarketingDataClient();
        if (result.campaigns && result.campaigns[0] && result.campaigns[0].device_performance) {
          setData(result.campaigns[0].device_performance);
        }
      } catch (error) {
        console.error("Failed to fetch marketing data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-6 w-6" />;
      case 'desktop':
        return <Monitor className="h-6 w-6" />;
      case 'tablet':
        return <Tablet className="h-6 w-6" />;
      default:
        return <Smartphone className="h-6 w-6" />;
    }
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-8 sm:py-12">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white flex items-center justify-center">
                <Monitor className="h-8 w-8 mr-3 text-indigo-400" />
                Device Performance Analytics
              </h1>
              <p className="mt-2 text-base text-gray-400">
                Compare marketing campaign performance across different devices.
              </p>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {isLoading ? (
            <p className="text-center text-gray-400 py-10">Loading device performance data...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((device, index) => (
                <div key={index} className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="p-2 bg-blue-600 rounded-lg mr-3">
                      {getDeviceIcon(device.device)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{device.device}</h3>
                      <p className="text-sm text-gray-400">{device.percentage_of_traffic}% of traffic</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Impressions:</span>
                      <span className="text-white font-medium">{formatNumber(device.impressions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Clicks:</span>
                      <span className="text-white font-medium">{formatNumber(device.clicks)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conversions:</span>
                      <span className="text-white font-medium">{formatNumber(device.conversions)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">CTR:</span>
                      <span className="text-white font-medium">{formatPercentage(device.ctr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Conversion Rate:</span>
                      <span className="text-white font-medium">{formatPercentage(device.conversion_rate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Spend:</span>
                      <span className="text-white font-medium">{formatCurrency(device.spend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue:</span>
                      <span className="text-white font-medium">{formatCurrency(device.revenue)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </div>
  );
}
