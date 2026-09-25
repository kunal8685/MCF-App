import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Complaint, INITIAL_COMPLAINTS } from '@/data/complaintsData';

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'complaintNumber' | 'date' | 'status' | 'timeline'>) => Promise<string>;
  getComplaintById: (id: string) => Complaint | undefined;
  isLoading: boolean;
}

const STORAGE_KEY = '@mcf_citizen_complaints';

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export const ComplaintsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setComplaints(JSON.parse(stored));
      } else {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_COMPLAINTS));
      }
    } catch (e) {
      console.error('Failed to load complaints', e);
    } finally {
      setIsLoading(false);
    }
  };

  const addComplaint = async (
    data: Omit<Complaint, 'id' | 'complaintNumber' | 'date' | 'status' | 'timeline'>
  ): Promise<string> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaintNumber = `MCF-2026-${randomNum}`;
    const now = new Date();
    const dateFormatted = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newComplaint: Complaint = {
      id: `c-${Date.now()}`,
      complaintNumber,
      category: data.category,
      description: data.description,
      address: data.address,
      ward: data.ward || 'Ward 14',
      date: dateFormatted,
      status: 'Pending',
      imageUrl: data.imageUrl,
      officerAssigned: 'Assigned to Sanitation / Engineering Cell',
      timeline: [
        {
          status: 'Complaint Registered',
          date: dateFormatted,
          remarks: 'Grievance ticket created successfully via citizen mobile portal.',
        },
      ],
    };

    const updated = [newComplaint, ...complaints];
    setComplaints(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return complaintNumber;
  };

  const getComplaintById = (id: string) => {
    return complaints.find((c) => c.id === id || c.complaintNumber === id);
  };

  return (
    <ComplaintsContext.Provider value={{ complaints, addComplaint, getComplaintById, isLoading }}>
      {children}
    </ComplaintsContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintsContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
};
