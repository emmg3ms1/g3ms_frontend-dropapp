import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DropFormData {
  dropType?: string;
  grade?: string;
  subject?: string;
  rtiTier?: string;
  learningGoal?: string;
  city?: string;
  state?: string;
  school?: string;
  // Additional fields that might be collected
  [key: string]: any;
}

interface DropDataContextType {
  dropData: DropFormData | null;
  setDropData: (data: DropFormData | null) => void;
  clearDropData: () => void;
  isDropCreationFlow: boolean;
  setIsDropCreationFlow: (value: boolean) => void;
}

const DropDataContext = createContext<DropDataContextType | undefined>(undefined);

const STORAGE_KEY = 'g3ms_drop_creation_data';
const FLOW_STORAGE_KEY = 'g3ms_drop_creation_flow';

export const DropDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dropData, setDropDataState] = useState<DropFormData | null>(null);
  const [isDropCreationFlow, setIsDropCreationFlowState] = useState(false);

  // Load data from sessionStorage on mount
  useEffect(() => {
    console.log('DropDataContext: Loading data from storage');
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      const storedFlow = sessionStorage.getItem(FLOW_STORAGE_KEY);
      
      console.log('DropDataContext: Found stored data:', { storedData, storedFlow });
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setDropDataState(parsedData);
        console.log('DropDataContext: Loaded drop data:', parsedData);
      } else {
        // Try fallback storage
        const fallbackData = localStorage.getItem(STORAGE_KEY + '_fallback');
        if (fallbackData) {
          const parsedData = JSON.parse(fallbackData);
          setDropDataState(parsedData);
          // Move from fallback to main storage
          sessionStorage.setItem(STORAGE_KEY, fallbackData);
          localStorage.removeItem(STORAGE_KEY + '_fallback');
          console.log('DropDataContext: Recovered from fallback storage:', parsedData);
        }
      }
      
      if (storedFlow === 'true') {
        setIsDropCreationFlowState(true);
        console.log('DropDataContext: Drop creation flow activated');
      }
    } catch (error) {
      console.error('Failed to load drop data from sessionStorage:', error);
      // Try to recover from fallback
      try {
        const fallbackData = localStorage.getItem(STORAGE_KEY + '_fallback');
        if (fallbackData) {
          const parsedData = JSON.parse(fallbackData);
          setDropDataState(parsedData);
          console.log('DropDataContext: Recovered from fallback after error:', parsedData);
        }
      } catch (fallbackError) {
        console.error('Fallback recovery also failed:', fallbackError);
      }
    }
  }, []);

  const setDropData = (data: DropFormData | null) => {
    console.log('DropDataContext: Setting drop data:', data);
    setDropDataState(data);
    
    try {
      if (data) {
        const dataString = JSON.stringify(data);
        sessionStorage.setItem(STORAGE_KEY, dataString);
        console.log('DropDataContext: Saved to sessionStorage:', dataString);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
        console.log('DropDataContext: Removed from sessionStorage');
      }
    } catch (error) {
      console.error('Failed to save drop data to sessionStorage:', error);
      // Try to persist in a fallback location
      try {
        if (data) {
          localStorage.setItem(STORAGE_KEY + '_fallback', JSON.stringify(data));
          console.log('DropDataContext: Fallback to localStorage successful');
        }
      } catch (fallbackError) {
        console.error('Fallback storage also failed:', fallbackError);
      }
    }
  };

  const setIsDropCreationFlow = (value: boolean) => {
    setIsDropCreationFlowState(value);
    
    try {
      if (value) {
        sessionStorage.setItem(FLOW_STORAGE_KEY, 'true');
      } else {
        sessionStorage.removeItem(FLOW_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to save drop flow state to sessionStorage:', error);
    }
  };

  const clearDropData = () => {
    setDropDataState(null);
    setIsDropCreationFlowState(false);
    
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(FLOW_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear drop data from sessionStorage:', error);
    }
  };

  const value: DropDataContextType = {
    dropData,
    setDropData,
    clearDropData,
    isDropCreationFlow,
    setIsDropCreationFlow,
  };

  return (
    <DropDataContext.Provider value={value}>
      {children}
    </DropDataContext.Provider>
  );
};

export const useDropData = (): DropDataContextType => {
  const context = useContext(DropDataContext);
  if (context === undefined) {
    throw new Error('useDropData must be used within a DropDataProvider');
  }
  return context;
};