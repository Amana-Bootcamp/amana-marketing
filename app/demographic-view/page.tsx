"use client";
import { useState, useEffect } from 'react';
import { Navbar } from '../../src/components/ui/navbar';
import { CardMetric } from '../../src/components/ui/card-metric';
import { BarChart } from '../../src/components/ui/bar-chart';
import { Table } from '../../src/components/ui/table';
import { Footer } from '../../src/components/ui/footer';
import { fetchMarketingDataClient } from '../../src/lib/api';
import { MarketingData, DemographicBreakdown } from '../../src/types/marketing';
import { Users, UserCheck, TrendingUp, Target, DollarSign, MousePointer } from 'lucide-react';

export default function DemographicView() {
  const [data, setData] = useState<MarketingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const marketingData = await fetchMarketingDataClient();
        setData(marketingData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-400">Error: {error || 'No data available'}</div>
        </div>
        <Footer />
      </div>
    );
  }

  // Compute aggregated metrics
  const totalClicks = data.marketing_stats.total_clicks;
  const totalSpend = data.marketing_stats.total_spend;
  const totalRevenue = data.marketing_stats.total_revenue;

  // Aggregate by gender
  const genderMetrics = data.campaigns.reduce((acc, campaign) => {
    campaign.demographic_breakdown.forEach((demo: DemographicBreakdown) => {
      const gender = demo.gender.toLowerCase();
      if (!acc[gender]) {
        acc[gender] = { clicks: 0, spend: 0, revenue: 0 };
      }
      acc[gender].clicks += demo.performance.clicks;
    });
    return acc;
  }, {} as Record<string, { clicks: number; spend: number; revenue: number }>);

  // Calculate spend and revenue proportionally
  Object.keys(genderMetrics).forEach(gender => {
    const clicks = genderMetrics[gender].clicks;
    genderMetrics[gender].spend = totalClicks > 0 ? (clicks / totalClicks) * totalSpend : 0;
    genderMetrics[gender].revenue = totalClicks > 0 ? (clicks / totalClicks) * totalRevenue : 0;
  });

  // Aggregate by age group for bar charts
  const ageGroupMetrics = data.campaigns.reduce((acc, campaign) => {
    campaign.demographic_breakdown.forEach((demo: DemographicBreakdown) => {
      const age = demo.age_group;
      if (!acc[age]) {
        acc[age] = { clicks: 0, spend: 0, revenue: 0 };
      }
      acc[age].clicks += demo.performance.clicks;
    });
    return acc;
  }, {} as Record<string, { clicks: number; spend: number; revenue: number }>);

  Object.keys(ageGroupMetrics).forEach(age => {
    const clicks = ageGroupMetrics[age].clicks;
    ageGroupMetrics[age].spend = totalClicks > 0 ? (clicks / totalClicks) * totalSpend : 0;
    ageGroupMetrics[age].revenue = totalClicks > 0 ? (clicks / totalClicks) * totalRevenue : 0;
  });

  // Prepare table data for male and female age groups
  const maleAgeGroups = data.campaigns.flatMap(campaign =>
    campaign.demographic_breakdown.filter((demo: DemographicBreakdown) => demo.gender.toLowerCase() === 'male')
  ).reduce((acc, demo) => {
    const age = demo.age_group;
    if (!acc[age]) {
      acc[age] = { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversion_rate: 0 };
    }
    acc[age].impressions += demo.performance.impressions;
    acc[age].clicks += demo.performance.clicks;
    acc[age].conversions += demo.performance.conversions;
    return acc;
  }, {} as Record<string, { impressions: number; clicks: number; conversions: number; ctr: number; conversion_rate: number }>);

  Object.keys(maleAgeGroups).forEach(age => {
    const metrics = maleAgeGroups[age];
    metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    metrics.conversion_rate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;
  });

  const femaleAgeGroups = data.campaigns.flatMap(campaign =>
    campaign.demographic_breakdown.filter((demo: DemographicBreakdown) => demo.gender.toLowerCase() === 'female')
  ).reduce((acc, demo) => {
    const age = demo.age_group;
    if (!acc[age]) {
      acc[age] = { impressions: 0, clicks: 0, conversions: 0, ctr: 0, conversion_rate: 0 };
    }
    acc[age].impressions += demo.performance.impressions;
    acc[age].clicks += demo.performance.clicks;
    acc[age].conversions += demo.performance.conversions;
    return acc;
  }, {} as Record<string, { impressions: number; clicks: number; conversions: number; ctr: number; conversion_rate: number }>);

  Object.keys(femaleAgeGroups).forEach(age => {
    const metrics = femaleAgeGroups[age];
    metrics.ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    metrics.conversion_rate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;
  });

  const maleTableData = Object.entries(maleAgeGroups).map(([age, metrics]) => ({
    age_group: age,
    ...metrics
  }));

  const femaleTableData = Object.entries(femaleAgeGroups).map(([age, metrics]) => ({
    age_group: age,
    ...metrics
  }));

  const tableColumns = [
    { key: 'age_group', header: 'Age Group', sortable: true },
    { key: 'impressions', header: 'Impressions', sortable: true, sortType: 'number' as const, render: (value: number) => value.toLocaleString() },
    { key: 'clicks', header: 'Clicks', sortable: true, sortType: 'number' as const, render: (value: number) => value.toLocaleString() },
    { key: 'conversions', header: 'Conversions', sortable: true, sortType: 'number' as const, render: (value: number) => value.toLocaleString() },
    { key: 'ctr', header: 'CTR (%)', sortable: true, sortType: 'number' as const, render: (value: number) => `${value.toFixed(2)}%` },
    { key: 'conversion_rate', header: 'Conversion Rate (%)', sortable: true, sortType: 'number' as const, render: (value: number) => `${value.toFixed(2)}%` }
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      <Navbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
          <div className="px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl md:text-5xl font-bold">
                Demographic View
              </h1>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-6">
          {/* Card Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardMetric
              title="Total Clicks by Males"
              value={genderMetrics.male?.clicks || 0}
              icon={<MousePointer className="h-5 w-5" />}
            />
            <CardMetric
              title="Total Spend by Males"
              value={`$${(genderMetrics.male?.spend || 0).toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <CardMetric
              title="Total Revenue by Males"
              value={`$${(genderMetrics.male?.revenue || 0).toLocaleString()}`}
              icon={<TrendingUp className="h-5 w-5" />}
            />
            <CardMetric
              title="Total Clicks by Females"
              value={genderMetrics.female?.clicks || 0}
              icon={<MousePointer className="h-5 w-5" />}
            />
            <CardMetric
              title="Total Spend by Females"
              value={`$${(genderMetrics.female?.spend || 0).toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5" />}
            />
            <CardMetric
              title="Total Revenue by Females"
              value={`$${(genderMetrics.female?.revenue || 0).toLocaleString()}`}
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>

          {/* Bar Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChart
              title="Total Spend by Age Group"
              data={Object.entries(ageGroupMetrics).map(([age, metrics]) => ({
                label: age,
                value: metrics.spend
              }))}
              formatValue={(value) => `$${value.toLocaleString()}`}
            />
            <BarChart
              title="Total Revenue by Age Group"
              data={Object.entries(ageGroupMetrics).map(([age, metrics]) => ({
                label: age,
                value: metrics.revenue
              }))}
              formatValue={(value) => `$${value.toLocaleString()}`}
            />
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Table
              title="Campaign Performance by Male Age Groups"
              columns={tableColumns}
              data={maleTableData}
            />
            <Table
              title="Campaign Performance by Female Age Groups"
              columns={tableColumns}
              data={femaleTableData}
            />
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
