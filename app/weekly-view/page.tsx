// app/weekly-view/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Navbar } from '../../src/components/ui/navbar';
import { Footer } from '../../src/components/ui/footer';
import { WeeklyPerformance } from '../../src/types/marketing';
import { WeeklyLineChart } from '../../src/components/ui/WeeklyLineChart';
import { fetchMarketingDataClient } from '../../src/lib/api';

export default function WeeklyView() {
  const [data, setData] = useState<WeeklyPerformance[]>([]);
  const [loading, setLoading] = useState(true);

  // Provided dataset
  const weeklyData: WeeklyPerformance[] = [
    {
      "week_start": "2024-10-01",
      "week_end": "2024-10-07",
      "impressions": 20900,
      "clicks": 322,
      "conversions": 27,
      "spend": 488.31,
      "revenue": 10837.69
    },
    {
      "week_start": "2024-10-08",
      "week_end": "2024-10-14",
      "impressions": 25919,
      "clicks": 399,
      "conversions": 33,
      "spend": 605.58,
      "revenue": 13440.26
    },
    {
      "week_start": "2024-10-15",
      "week_end": "2024-10-21",
      "impressions": 22436,
      "clicks": 346,
      "conversions": 29,
      "spend": 524.21,
      "revenue": 11634.44
    },
    {
      "week_start": "2024-10-22",
      "week_end": "2024-10-28",
      "impressions": 25959,
      "clicks": 400,
      "conversions": 33,
      "spend": 606.52,
      "revenue": 13461.12
    },
    {
      "week_start": "2024-10-29",
      "week_end": "2024-11-04",
      "impressions": 26370,
      "clicks": 406,
      "conversions": 34,
      "spend": 616.12,
      "revenue": 13674.2
    },
    {
      "week_start": "2024-11-05",
      "week_end": "2024-11-11",
      "impressions": 25164,
      "clicks": 388,
      "conversions": 32,
      "spend": 587.94,
      "revenue": 13048.75
    },
    {
      "week_start": "2024-11-12",
      "week_end": "2024-11-18",
      "impressions": 25475,
      "clicks": 393,
      "conversions": 33,
      "spend": 595.2,
      "revenue": 13210
    },
    {
      "week_start": "2024-11-19",
      "week_end": "2024-11-25",
      "impressions": 22385,
      "clicks": 345,
      "conversions": 29,
      "spend": 523.01,
      "revenue": 11607.63
    },
    {
      "week_start": "2024-11-26",
      "week_end": "2024-12-02",
      "impressions": 27568,
      "clicks": 425,
      "conversions": 36,
      "spend": 644.11,
      "revenue": 14295.43
    },
    {
      "week_start": "2024-12-03",
      "week_end": "2024-12-09",
      "impressions": 26571,
      "clicks": 410,
      "conversions": 34,
      "spend": 620.82,
      "revenue": 13778.56
    },
    {
      "week_start": "2024-12-10",
      "week_end": "2024-12-16",
      "impressions": 37499,
      "clicks": 578,
      "conversions": 48,
      "spend": 876.16,
      "revenue": 19445.44
    },
    {
      "week_start": "2024-12-17",
      "week_end": "2024-12-23",
      "impressions": 31032,
      "clicks": 478,
      "conversions": 40,
      "spend": 725.04,
      "revenue": 16091.6
    }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMarketingDataClient();
        if (result.weekly_performance) {
          setData(result.weekly_performance);
        } else {
          // Fallback to provided data if API doesn't have it
          setData(weeklyData);
        }
      } catch (error) {
        console.error("Failed to fetch marketing data:", error);
        // Use provided data as fallback
        setData(weeklyData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="text-center mb-10 md:mb-12 bg-gradient-to-r from-gray-800 to-gray-700 py-8 sm:py-12">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Weekly Performance
            </h1>
            <p className="text-lg text-gray-400">
              Track key metrics over time to identify trends and patterns.
            </p>
          </div>
        </section>
        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {loading ? (
              <div className="col-span-1 lg:col-span-2  text-gray-400">
                Loading charts...
              </div>
            ) : (
              <>
                <WeeklyLineChart
                  data={data}
                  title="Weekly Revenue Trends"
                  metric="revenue"
                />
                <WeeklyLineChart
                  data={data}
                  title="Weekly Spend Trends"
                  metric="spend"
                />
              </>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
}
