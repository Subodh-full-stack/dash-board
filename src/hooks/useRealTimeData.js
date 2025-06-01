import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  generateSalesData, 
  generateTrafficData, 
  generateProductData, 
  generateKPIData 
} from '../utils/dataGenerator';

/**
 * Custom hook for managing real-time dashboard data
 * @param {Object} options - Configuration options
 * @returns {Object} Hook state and methods
 */
export const useRealTimeData = (options = {}) => {
  const {
    updateInterval = 5000, // 5 seconds default
    autoStart = true,
    enablePersistence = true
  } = options;

  // State management
  const [salesData, setSalesData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [kpiData, setKpiData] = useState([]);
  const [isRealTime, setIsRealTime] = useState(autoStart);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [updateCount, setUpdateCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs for cleanup
  const intervalRef = useRef(null);
  const mountedRef = useRef(true);

  /**
   * Generate all dashboard data
   */
  const generateAllData = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      const newSalesData = generateSalesData();
      const newTrafficData = generateTrafficData();
      const newProductData = generateProductData();
      const newKpiData = generateKPIData();

      if (mountedRef.current) {
        setSalesData(newSalesData);
        setTrafficData(newTrafficData);
        setProductData(newProductData);
        setKpiData(newKpiData);
        setLastUpdated(new Date());
        setUpdateCount(prev => prev + 1);
        
        // Persist data if enabled
        if (enablePersistence) {
          persistData({
            sales: newSalesData,
            traffic: newTrafficData,
            products: newProductData,
            kpis: newKpiData,
            lastUpdated: new Date().toISOString()
          });
        }
      }
    } catch (err) {
      console.error('Error generating dashboard data:', err);
      setError('Failed to generate dashboard data');
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [enablePersistence]);

  /**
   * Persist data to localStorage
   */
  const persistData = useCallback((data) => {
    try {
      localStorage.setItem('dashboardData', JSON.stringify(data));
    } catch (err) {
      console.warn('Failed to persist data:', err);
    }
  }, []);

  /**
   * Load persisted data from localStorage
   */
  const loadPersistedData = useCallback(() => {
    try {
      const stored = localStorage.getItem('dashboardData');
      if (stored) {
        const data = JSON.parse(stored);
        const lastUpdate = new Date(data.lastUpdated);
        const now = new Date();
        const timeDiff = now - lastUpdate;
        
        // Use persisted data if it's less than 1 hour old
        if (timeDiff < 3600000 && mountedRef.current) {
          setSalesData(data.sales || []);
          setTrafficData(data.traffic || []);
          setProductData(data.products || []);
          setKpiData(data.kpis || []);
          setLastUpdated(lastUpdate);
          return true;
        }
      }
    } catch (err) {
      console.warn('Failed to load persisted data:', err);
    }
    return false;
  }, []);

  /**
   * Start real-time updates
   */
  const startRealTime = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setIsRealTime(true);
    
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        generateAllData();
      }
    }, updateInterval);
  }, [generateAllData, updateInterval]);

  /**
   * Stop real-time updates
   */
  const stopRealTime = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRealTime(false);
  }, []);

  /**
   * Toggle real-time updates
   */
  const toggleRealTime = useCallback(() => {
    if (isRealTime) {
      stopRealTime();
    } else {
      startRealTime();
    }
  }, [isRealTime, startRealTime, stopRealTime]);

  /**
   * Manually refresh data
   */
  const refreshData = useCallback(() => {
    generateAllData();
  }, [generateAllData]);

  /**
   * Clear all data
   */
  const clearData = useCallback(() => {
    setSalesData([]);
    setTrafficData([]);
    setProductData([]);
    setKpiData([]);
    setUpdateCount(0);
    
    if (enablePersistence) {
      try {
        localStorage.removeItem('dashboardData');
      } catch (err) {
        console.warn('Failed to clear persisted data:', err);
      }
    }
  }, [enablePersistence]);

  /**
   * Get aggregated dashboard data
   */
  const getDashboardData = useCallback(() => {
    return {
      salesData,
      trafficData,
      productData,
      kpis: kpiData,
      metadata: {
        lastUpdated,
        updateCount,
        isRealTime,
        isLoading,
        error
      }
    };
  }, [salesData, trafficData, productData, kpiData, lastUpdated, updateCount, isRealTime, isLoading, error]);

  /**
   * Update specific dataset
   */
  const updateDataset = useCallback((datasetName, newData) => {
    switch (datasetName) {
      case 'sales':
        setSalesData(newData);
        break;
      case 'traffic':
        setTrafficData(newData);
        break;
      case 'products':
        setProductData(newData);
        break;
      case 'kpis':
        setKpiData(newData);
        break;
      default:
        console.warn(`Unknown dataset: ${datasetName}`);
    }
    setLastUpdated(new Date());
  }, []);

  /**
   * Get data statistics
   */
  const getDataStats = useCallback(() => {
    return {
      salesDataPoints: salesData.length,
      trafficDataPoints: trafficData.length,
      productCategories: productData.length,
      kpiCount: kpiData.length,
      totalDataPoints: salesData.length + trafficData.length + productData.length + kpiData.length,
      lastUpdateTime: lastUpdated.toISOString(),
      updateFrequency: updateInterval,
      isActive: isRealTime
    };
  }, [salesData, trafficData, productData, kpiData, lastUpdated, updateInterval, isRealTime]);

  // Initialize data on mount
  useEffect(() => {
    let dataLoaded = false;
    
    // Try to load persisted data first
    if (enablePersistence) {
      dataLoaded = loadPersistedData();
    }
    
    // Generate fresh data if no persisted data found
    if (!dataLoaded) {
      generateAllData();
    }
    
    // Start real-time updates if enabled
    if (autoStart && isRealTime) {
      startRealTime();
    }

    // Cleanup function
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Only run on mount

  // Handle real-time toggle
  useEffect(() => {
    if (isRealTime) {
      startRealTime();
    } else {
      stopRealTime();
    }
  }, [isRealTime, startRealTime, stopRealTime]);

  // Return hook interface
  return {
    // Data
    salesData,
    trafficData,
    productData,
    kpis: kpiData,
    
    // State
    isRealTime,
    lastUpdated,
    updateCount,
    isLoading,
    error,
    
    // Actions
    toggleRealTime,
    startRealTime,
    stopRealTime,
    refreshData,
    clearData,
    updateDataset,
    
    // Utilities
    getDashboardData,
    getDataStats
  };
};