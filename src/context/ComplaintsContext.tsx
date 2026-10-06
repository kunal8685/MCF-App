import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Complaint, INITIAL_COMPLAINTS } from '@/data/complaintsData';
import {
  fetchCitizenComplaintsApi,
  createCitizenComplaintApi,
} from '@/services/grievanceApi';

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (
    complaint: Omit<Complaint, 'id' | 'complaintNumber' | 'date' | 'status' | 'timeline'>
  ) => Promise<string>;
  getComplaintById: (id: string) => Complaint | undefined;
  isLoading: boolean;
  refreshComplaints: () => Promise<void>;
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
      // 1. Load cached complaints
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setComplaints(JSON.parse(stored));
      }

      // 2. Try loading live citizen complaints from server
      await syncComplaintsFromServer();
    } catch (e) {
      console.error('Failed to load complaints', e);
    } finally {
      setIsLoading(false);
    }
  };

  const syncComplaintsFromServer = async () => {
    try {
      const res = await fetchCitizenComplaintsApi({ page_size: 50 });
      if (res && res.complaints && res.complaints.length > 0) {
        const mapped: Complaint[] = res.complaints.map((item) => {
          const raw = item.GmdaComplaint || {};
          const ticketNo = raw.complaint_no_auto || `#${raw.id}`;
          const date = raw.created_at
            ? new Date(raw.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })
            : 'Recent';

          const statusStr = (item.status_label || String(raw.status || '')).toLowerCase();
          let status: Complaint['status'] = 'Pending';
          if (statusStr.includes('close') || statusStr.includes('resolve') || statusStr === '5') {
            status = 'Resolved';
          } else if (
            statusStr.includes('progress') ||
            statusStr.includes('assign') ||
            statusStr.includes('inspect') ||
            statusStr === '2'
          ) {
            status = 'In Progress';
          }

          return {
            id: String(raw.id || ticketNo),
            complaintNumber: ticketNo,
            category: item.complaint_type_name || 'General Grievance',
            description: raw.complaint_description || '',
            address: raw.address_landmark || 'Faridabad',
            ward: item.ward_name || (item.ward ? `Ward ${item.ward}` : 'Ward 14'),
            date,
            status,
            imageUrl:
              item.resolved_photo ||
              (item.images_list && item.images_list[0]) ||
              (item.images && item.images[0]) ||
              undefined,
            officerAssigned: item.inspection_officer_name
              ? `${item.inspection_officer_name} (${item.inspection_officer_phone || 'Assigned'})`
              : 'Assigned to Municipal Inspection Cell',
            timeline: [
              {
                status: 'Complaint Registered',
                date,
                remarks: 'Registered via citizen portal.',
              },
            ],
          };
        });

        setComplaints(mapped);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
      }
    } catch (err) {
      console.warn('Could not sync complaints from server:', err);
    }
  };

  const addComplaint = async (
    data: Omit<Complaint, 'id' | 'complaintNumber' | 'date' | 'status' | 'timeline'>
  ): Promise<string> => {
    let complaintNumber = '';

    try {
      const userStored = await AsyncStorage.getItem('@mcf_citizen_user');
      const user = userStored ? JSON.parse(userStored) : {};
      const cleanPhone = String(user.mobile || '9999999999').replace(/\D/g, '').slice(-10);
      const wardNum = parseInt(String(data.ward || '').replace(/\D/g, '') || '14', 10);

      const res = await createCitizenComplaintApi({
        address: data.address,
        complaint_type_id: 46, // General/Water fallback
        description: data.description,
        severity: 'minor',
        ward_id: isNaN(wardNum) ? 14 : wardNum,
        phone: cleanPhone || '9999999999',
        user_name: user.name || 'Citizen',
      });

      complaintNumber = res.complaint_no_auto || String(res.id);
    } catch (e) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      complaintNumber = `MCF-2026-${randomNum}`;
    }

    const now = new Date();
    const dateFormatted = `${now.getDate()} ${now.toLocaleString('default', {
      month: 'short',
    })} ${now.getFullYear()}`;

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
      officerAssigned: 'Assigned to Municipal Inspection Cell',
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
    <ComplaintsContext.Provider
      value={{
        complaints,
        addComplaint,
        getComplaintById,
        isLoading,
        refreshComplaints: syncComplaintsFromServer,
      }}
    >
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
