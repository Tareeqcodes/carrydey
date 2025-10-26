import { useState, useMemo } from 'react';

export function usePackageFilters(data) {
  const [activeFilters, setActiveFilters] = useState({
    status: 'all',
    timePosted: 'all',
    rewardRange: 'all',
    size: 'all',
  });

  // Filter options with dynamic counts
  const filterOptions = useMemo(() => ({
    status: [
      { value: 'all', label: 'All Status', count: data.length },
      {
        value: 'express',
        label: 'Express',
        count: data.filter((item) => item.status?.toLowerCase() === 'express').length,
      },
      {
        value: 'standard',
        label: 'Standard',
        count: data.filter(
          (item) => item.status?.toLowerCase() === 'standard' || !item.status
        ).length,
      },
    ],
    timePosted: [
      { value: 'all', label: 'All Time' },
      { value: 'today', label: 'Today' },
      { value: 'week', label: 'This Week' },
    ],
    rewardRange: [
      { value: 'all', label: 'All Rewards' },
      { value: 'medium', label: '₦5,000 - ₦20,000' },
      { value: 'high', label: '₦20,000+' },
    ],
    size: [
      { value: 'all', label: 'All Sizes' },
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
    ],
  }), [data]);

  // Filter the data based on active filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Status filter
      if (activeFilters.status !== 'all') {
        const itemStatus = item.status?.toLowerCase() || 'standard';
        if (itemStatus !== activeFilters.status) return false;
      }

      // Time posted filter
      if (activeFilters.timePosted !== 'all') {
        const createdDate = new Date(item.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (activeFilters.timePosted) {
          case 'today':
            if (diffDays > 1) return false;
            break;
          case 'week':
            if (diffDays > 7) return false;
            break;
        }
      }

      // Reward range filter
      if (activeFilters.rewardRange !== 'all') {
        const reward = item.reward;
        switch (activeFilters.rewardRange) {
          case 'medium':
            if (reward <= 5000 || reward > 20000) return false;
            break;
          case 'high':
            if (reward <= 20000) return false;
            break;
        }
      }

      // Size filter
      if (activeFilters.size !== 'all') {
        const itemSize = item.size?.toLowerCase();
        if (itemSize !== activeFilters.size) return false;
      }

      return true;
    });
  }, [data, activeFilters]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(activeFilters).some((filter) => filter !== 'all');
  }, [activeFilters]);

  // Handle filter change
  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({
      status: 'all',
      timePosted: 'all',
      rewardRange: 'all',
      size: 'all',
    });
  };

  return {
    activeFilters,
    filterOptions,
    filteredData,
    hasActiveFilters,
    handleFilterChange,
    clearAllFilters,
  };
}