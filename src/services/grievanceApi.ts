import { Platform } from 'react-native';
import URLS from './base_url';
import { extractErrorMessage, getAccessToken } from './citizenApi';

export interface GrievanceSubtype {
  sub_type_id: number;
  sub_type_name: string;
}

export interface GrievanceComplaintType {
  complaint_type_id: number;
  complaint_type_name: string;
  subtypes: GrievanceSubtype[];
}

export interface WardItem {
  ward_id: number;
  ward: string;
}

export interface CitizenComplaintCreatePayload {
  address: string;
  complaint_type_id: number;
  sub_type_id?: number | null;
  complaint_sub_type_id?: number | null;
  description: string;
  severity: 'major' | 'minor';
  ward_id: number;
  latitude?: number | null;
  longitude?: number | null;
  media_id?: string | string[] | null;
  media_ids?: string[] | null;
  user_name?: string | null;
  phone: string;
}

export interface CreateComplaintResponse {
  id: string | number;
  complaint_no_auto: string;
  status: string;
  message?: string;
}

export interface FetchComplaintsParams {
  sub_type?: string | number;
  status?: string;
  start_date?: string;
  end_date?: string;
  ward_id?: string | number;
  complaint_type?: string | number;
  page_size?: number;
  page?: number;
  search?: string;
}

export interface CitizenComplaintItem {
  GmdaComplaint: {
    id: number | string;
    complaint_no_auto?: string;
    complaint_description?: string;
    address_landmark?: string;
    status?: string | number;
    created_at?: string;
    ward?: string | number;
    contact_number?: number | string;
    complaint_type?: string | number;
    complaint_sub_type?: string | number;
    severity?: string;
    img_url?: string;
    first_name?: string;
    [key: string]: any;
  };
  complaint_type_name?: string;
  sub_type_name?: string;
  department_name?: string;
  mapped_department_id?: string;
  service_name?: string;
  ward?: string | number;
  ward_name?: string;
  status_label?: string;
  inspection_officer_name?: string;
  inspection_officer_phone?: string;
  inspection_officer_role?: string;
  area_name?: string;
  zone?: string;
  sla_breached?: boolean;
  images_list?: string[];
  documents_list?: string[];
  images?: string[];
  resolved_photo?: string | null;
  closed_by_name?: string | null;
  closed_by_phone?: string | null;
  complaint_raised_by_name?: string | null;
  escalation_details?: {
    severity?: string | null;
    breached_at?: string | null;
    is_breached?: boolean | null;
    tender_exists?: boolean | null;
    tender_number?: string | null;
  };
}

export interface PaginatedComplaintsResponse {
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  complaints: CitizenComplaintItem[];
}

// ======================== FALLBACK DATA ========================

export const DEFAULT_COMPLAINT_TYPES: GrievanceComplaintType[] = [
  {
    complaint_type_id: 45,
    complaint_type_name: 'Sanitation & Garbage',
    subtypes: [
      { sub_type_id: 109, sub_type_name: 'Garbage not picked up' },
      { sub_type_id: 110, sub_type_name: 'Dustbin overflowing / broken' },
      { sub_type_id: 111, sub_type_name: 'Dead animal removal' },
      { sub_type_id: 112, sub_type_name: 'Open dumping in vacant plot' },
    ],
  },
  {
    complaint_type_id: 46,
    complaint_type_name: 'Water Supply & Sewerage',
    subtypes: [
      { sub_type_id: 113, sub_type_name: 'Dirty or contaminated water supply' },
      { sub_type_id: 114, sub_type_name: 'No water supply / Low pressure' },
      { sub_type_id: 115, sub_type_name: 'Main water pipeline burst / leakage' },
      { sub_type_id: 116, sub_type_name: 'Sewer line blocked / overflow' },
      { sub_type_id: 117, sub_type_name: 'Missing / damaged manhole cover' },
    ],
  },
  {
    complaint_type_id: 47,
    complaint_type_name: 'Street Lights',
    subtypes: [
      { sub_type_id: 118, sub_type_name: 'Street light not working / flickering' },
      { sub_type_id: 119, sub_type_name: 'Entire pole light defective' },
      { sub_type_id: 120, sub_type_name: 'Exposed live electrical wires' },
    ],
  },
  {
    complaint_type_id: 48,
    complaint_type_name: 'Roads & Infrastructure',
    subtypes: [
      { sub_type_id: 121, sub_type_name: 'Potholes on main / sector road' },
      { sub_type_id: 122, sub_type_name: 'Broken footpath or divider' },
      { sub_type_id: 123, sub_type_name: 'Waterlogging on road' },
    ],
  },
  {
    complaint_type_id: 49,
    complaint_type_name: 'Encroachment & Building Violations',
    subtypes: [
      { sub_type_id: 124, sub_type_name: 'Encroachment on public road / pavement' },
      { sub_type_id: 125, sub_type_name: 'Illegal commercial hoarding' },
      { sub_type_id: 126, sub_type_name: 'Unauthorized construction' },
    ],
  },
  {
    complaint_type_id: 50,
    complaint_type_name: 'Horticulture & Parks',
    subtypes: [
      { sub_type_id: 127, sub_type_name: 'Fallen tree or dangerous branches' },
      { sub_type_id: 128, sub_type_name: 'Park grass unmaintained' },
      { sub_type_id: 129, sub_type_name: 'Park benches or lights broken' },
    ],
  },
];

export const DEFAULT_WARDS: WardItem[] = Array.from({ length: 45 }, (_, i) => ({
  ward_id: i + 1,
  ward: `Ward ${i + 1}`,
}));

// ======================== API METHODS ========================

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch all complaint categories with nested subtypes from backend
 */
export const getComplaintTypesWithSubtypesApi = async (): Promise<GrievanceComplaintType[]> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${URLS.BASE_URL}/grievance/complaint-types/with-subtypes`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      return DEFAULT_COMPLAINT_TYPES;
    }

    const json = await res.json();
    const data = json?.data || json;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return DEFAULT_COMPLAINT_TYPES;
  } catch (err) {
    console.warn('Could not fetch complaint types from API, using defaults:', err);
    return DEFAULT_COMPLAINT_TYPES;
  }
};

/**
 * Fetch all wards from backend
 */
export const getAllWardsApi = async (): Promise<WardItem[]> => {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${URLS.BASE_URL}/grievance/get_all_wards`, {
      method: 'GET',
      headers,
    });

    if (!res.ok) {
      return DEFAULT_WARDS;
    }

    const json = await res.json();
    const data = json?.data || json;
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => ({
        ward_id: Number(item.ward_id || item.id),
        ward: String(item.ward || `Ward ${item.ward_id || item.id}`),
      }));
    }
    return DEFAULT_WARDS;
  } catch (err) {
    console.warn('Could not fetch wards from API, using defaults:', err);
    return DEFAULT_WARDS;
  }
};

/**
 * Upload media photo for complaint attachment
 */
export const uploadComplaintMediaApi = async (
  uri: string,
  filename?: string,
  mimeType?: string,
  fileBlob?: any
): Promise<string> => {
  try {
    const token = await getAccessToken();
    const uriParts = uri.split('?')[0].split('.');
    const ext = uriParts[uriParts.length - 1]?.toLowerCase() || 'jpeg';
    const cleanExt = ['jpg', 'jpeg', 'png', 'webp', 'heic'].includes(ext) ? ext : 'jpeg';
    const cleanFileName = filename || `complaint_evidence_${Date.now()}.${cleanExt === 'jpg' ? 'jpeg' : cleanExt}`;
    const cleanMime = mimeType || `image/${cleanExt === 'jpg' ? 'jpeg' : cleanExt}`;

    const formData = new FormData();
    if (Platform.OS === 'web') {
      if (fileBlob) {
        formData.append('photo', fileBlob, cleanFileName);
      } else {
        const response = await fetch(uri);
        const blob = await response.blob();
        formData.append('photo', blob, cleanFileName);
      }
    } else {
      formData.append('photo', {
        uri,
        name: cleanFileName,
        type: cleanMime,
      } as any);
    }

    const res = await fetch(`${URLS.BASE_URL}/media/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Upload failed with status ${res.status}: ${errText || res.statusText}`);
    }

    const json = await res.json();
    const mediaId =
      json?.media_id ||
      json?.id ||
      json?.mediaId ||
      json?.fileId ||
      json?.data?.id ||
      json?.successResponse?.id;

    if (!mediaId) {
      throw new Error('Media ID missing in upload response');
    }

    return String(mediaId);
  } catch (err: any) {
    console.warn('Photo upload failed:', err?.message);
    throw err;
  }
};

/**
 * Lodge / Create Citizen Complaint
 * POST /grievance/create_citizen_complaint
 */
export const createCitizenComplaintApi = async (
  payload: CitizenComplaintCreatePayload
): Promise<CreateComplaintResponse> => {
  const headers = await getAuthHeaders();
  const token = await getAccessToken();

  if (!token) {
    throw new Error('You must be logged in to lodge a complaint. Please log in again.');
  }

  // Sanitize phone
  const cleanPhone = String(payload.phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    throw new Error('A valid 10-digit mobile number is required.');
  }
  if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
    throw new Error('Phone number must be a valid 10-digit Indian mobile number starting with 6-9.');
  }

  const cleanPayload: Record<string, any> = {
    address: payload.address.trim(),
    complaint_type_id: Number(payload.complaint_type_id),
    description: payload.description.trim(),
    severity: payload.severity === 'major' ? 'major' : 'minor',
    ward_id: Number(payload.ward_id),
    phone: cleanPhone,
  };

  if (payload.user_name && payload.user_name.trim()) {
    cleanPayload.user_name = payload.user_name.trim();
  }

  const subTypeId = payload.sub_type_id ?? payload.complaint_sub_type_id;
  if (subTypeId !== undefined && subTypeId !== null) {
    cleanPayload.sub_type_id = Number(subTypeId);
    cleanPayload.complaint_sub_type_id = Number(subTypeId);
  }

  if (typeof payload.latitude === 'number' && typeof payload.longitude === 'number') {
    cleanPayload.latitude = payload.latitude;
    cleanPayload.longitude = payload.longitude;
  }

  if (payload.media_id) {
    cleanPayload.media_id = Array.isArray(payload.media_id)
      ? payload.media_id
      : [String(payload.media_id)];
  }

  if (payload.media_ids && Array.isArray(payload.media_ids)) {
    cleanPayload.media_ids = payload.media_ids;
  }

  const res = await fetch(`${URLS.BASE_URL}/grievance/create_citizen_complaint`, {
    method: 'POST',
    headers,
    body: JSON.stringify(cleanPayload),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = text;
  }

  if (!res.ok) {
    const errorMsg = extractErrorMessage(json, res.status, 'Failed to create grievance ticket.');
    throw new Error(errorMsg);
  }

  return (json?.data || json) as CreateComplaintResponse;
};

/**
 * Fetch Citizen Complaints (My Complaints)
 * GET /grievance/citizen/complaints
 */
export const fetchCitizenComplaintsApi = async (
  params: FetchComplaintsParams = {}
): Promise<PaginatedComplaintsResponse> => {
  const headers = await getAuthHeaders();
  const token = await getAccessToken();

  if (!token) {
    return {
      pagination: {
        page: 1,
        page_size: 20,
        total_records: 0,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      },
      complaints: [],
    };
  }

  const query = new URLSearchParams();
  if (params.page !== undefined) query.append('page', String(params.page));
  if (params.page_size !== undefined) query.append('page_size', String(params.page_size));
  if (params.status && params.status !== 'All') {
    const st = String(params.status).toLowerCase();
    const normalized = st === 'in_progress' || st === 'in progress' ? 'inprogress' : params.status;
    query.append('status', String(normalized));
  }
  if (params.search && params.search.trim()) query.append('search', params.search.trim());
  if (params.complaint_type) query.append('complaint_type', String(params.complaint_type));
  if (params.sub_type) query.append('sub_type', String(params.sub_type));
  if (params.ward_id) query.append('ward_id', String(params.ward_id));
  if (params.start_date) query.append('start_date', String(params.start_date));
  if (params.end_date) query.append('end_date', String(params.end_date));

  const queryString = query.toString();
  const url = `${URLS.BASE_URL}/grievance/citizen/complaints${queryString ? `?${queryString}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers,
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = text;
  }

  if (!res.ok) {
    const errorMsg = extractErrorMessage(json, res.status, 'Failed to load citizen complaints.');
    throw new Error(errorMsg);
  }

  const result = json?.data || json || {};
  const rawComplaints: any[] = Array.isArray(result.complaints) ? result.complaints : [];

  // Normalize image lists for each complaint
  const normalizedComplaints: CitizenComplaintItem[] = rawComplaints.map((item: any) => {
    const raw = item.GmdaComplaint || {};
    const imgList: string[] = [];

    if (Array.isArray(item.images_list)) {
      item.images_list.forEach((img: any) => {
        if (typeof img === 'string' && img.trim()) imgList.push(img.trim());
      });
    }

    if (Array.isArray(item.images)) {
      item.images.forEach((img: any) => {
        if (typeof img === 'string' && img.trim() && !imgList.includes(img.trim())) {
          imgList.push(img.trim());
        }
      });
    }

    if (raw.img_url && typeof raw.img_url === 'string') {
      const parts = raw.img_url.split(',');
      parts.forEach((p: string) => {
        let clean = p.trim();
        if (clean) {
          if (!clean.startsWith('http') && !clean.startsWith('file:') && !clean.startsWith('data:') && !clean.startsWith('blob:')) {
            clean = `${URLS.BASE_URL}/media/${clean}`;
          }
          if (!imgList.includes(clean)) {
            imgList.push(clean);
          }
        }
      });
    }

    return {
      ...item,
      images_list: imgList,
      images: imgList,
    };
  });

  return {
    pagination: result.pagination || {
      page: params.page || 1,
      page_size: params.page_size || 20,
      total_records: normalizedComplaints.length,
      total_pages: 1,
      has_next: false,
      has_prev: false,
    },
    complaints: normalizedComplaints,
  };
};
