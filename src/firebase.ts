import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  getDocFromServer,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as fbSignOut, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  mockProducts, 
  mockCustomers, 
  mockStores, 
  mockBatches, 
  mockOrders, 
  mockLeads, 
  mockStaff 
} from './data/mockData';
import { 
  Customer, 
  StoreNode, 
  ProductSKU, 
  BatchLot, 
  OrderRecord, 
  LeadRecord, 
  StaffMember 
} from './types';
import { 
  AppUser, 
  ROLE_TAB_PERMISSIONS, 
  SUPER_ADMIN_EMAIL, 
  UserRole 
} from './types/auth';

// Web app's Firebase configuration provided by user
export const firebaseConfig = {
  apiKey: "AIzaSyDTo3CxnchPe6TYiPM_yp9_dxju799j18g",
  authDomain: "crm-messenger-2ace3.firebaseapp.com",
  projectId: "crm-messenger-2ace3",
  storageBucket: "crm-messenger-2ace3.firebasestorage.app",
  messagingSenderId: "431346627001",
  appId: "1:431346627001:web:56fa8c80973a8794a54668"
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Clean undefined fields to satisfy Firestore strict requirements
export function cleanForFirestore<T>(data: T): T {
  if (data === null || data === undefined) return data;
  if (Array.isArray(data)) {
    return data.map(item => cleanForFirestore(item)) as unknown as T;
  }
  if (typeof data === 'object') {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data as Record<string, any>)) {
      if (value !== undefined) {
        result[key] = cleanForFirestore(value);
      }
    }
    return result as T;
  }
  return data;
}

// Test Firebase connection
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const testDocRef = doc(db, 'system_meta', 'ping');
    await getDocFromServer(testDocRef);
    return { success: true, message: 'Kết nối Firebase Firestore thành công' };
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      return { success: false, message: 'Thiết bị đang offline hoặc chưa kết nối được Firestore' };
    }
    // If document doesn't exist, getDocFromServer still succeeded reaching server
    if (error?.code === 'not-found') {
      return { success: true, message: 'Kết nối Firestore thành công (Document chưa tạo)' };
    }
    return { 
      success: false, 
      message: error?.message || 'Không thể kết nối đến Firestore. Vui lòng kiểm tra quyền Firestore Rules.' 
    };
  }
}

export interface SeedProgressCallback {
  (step: string, current: number, total: number): void;
}

export interface SeedSummary {
  customers: number;
  stores: number;
  products: number;
  batches: number;
  orders: number;
  leads: number;
  staff: number;
}

// Seed all existing mock data into Firebase Firestore
export async function seedAllMockDataToFirestore(onProgress?: SeedProgressCallback): Promise<SeedSummary> {
  const summary: SeedSummary = {
    customers: 0,
    stores: 0,
    products: 0,
    batches: 0,
    orders: 0,
    leads: 0,
    staff: 0,
  };

  const collectionsToSeed = [
    { name: 'products', label: 'Sản phẩm SKU', data: mockProducts },
    { name: 'customers', label: 'Khách hàng 360', data: mockCustomers },
    { name: 'stores', label: 'Chuỗi điểm bán', data: mockStores },
    { name: 'batches', label: 'Lô chượp & Truy xuất', data: mockBatches },
    { name: 'orders', label: 'Đơn hàng', data: mockOrders },
    { name: 'leads', label: 'Leads B2B', data: mockLeads },
    { name: 'staff', label: 'Đội ngũ nhân sự', data: mockStaff },
  ];

  let overallStep = 0;
  const totalCollections = collectionsToSeed.length;

  for (const col of collectionsToSeed) {
    overallStep++;
    onProgress?.(`Đang lưu ${col.label} (${col.data.length} bản ghi)...`, overallStep, totalCollections);

    // Write documents individually with clean sanitization
    for (const item of col.data) {
      try {
        const docRef = doc(db, col.name, (item as any).id);
        await setDoc(docRef, cleanForFirestore(item), { merge: true });
        (summary as any)[col.name]++;
      } catch (err) {
        console.error(`Lỗi ghi bản ghi ${col.name}/${(item as any).id}:`, err);
        handleFirestoreError(err, OperationType.WRITE, `${col.name}/${(item as any).id}`);
      }
    }
  }

  // Record a metadata timestamp in Firestore
  try {
    await setDoc(doc(db, 'system_meta', 'seed_info'), {
      lastSeededAt: new Date().toISOString(),
      projectId: firebaseConfig.projectId,
      summary,
      appVersion: '2.0.0'
    }, { merge: true });
  } catch (e) {
    console.warn('Không thể lưu system_meta/seed_info:', e);
  }

  return summary;
}

// Fetch any collection from Firestore
export async function fetchCollectionFromFirestore<T>(collectionName: string): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const results: T[] = [];
    snap.forEach((d) => {
      results.push({ ...d.data(), id: d.id } as T);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, collectionName);
  }
}

// Save single document to Firestore
export async function saveDocumentToFirestore<T extends { id: string }>(
  collectionName: string, 
  item: T
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, item.id);
    await setDoc(docRef, cleanForFirestore(item), { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${item.id}`);
  }
}

// Delete single document from Firestore
export async function deleteDocumentFromFirestore(
  collectionName: string, 
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}

// Map a Firebase Auth User to the appropriate AppUser with strict role and permissions
export function resolveAppUser(
  fbUser: FirebaseUser | null, 
  staffList: StaffMember[] = []
): AppUser | null {
  if (!fbUser) return null;

  const email = (fbUser.email || '').toLowerCase().trim();

  // Super Admin: admin@haihuong.vn has highest authority across all 9 subsystems
  if (email === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return {
      uid: fbUser.uid,
      email: SUPER_ADMIN_EMAIL,
      displayName: 'Tổng Giám Đốc Hải Hương',
      role: 'SUPER_ADMIN',
      roleTitle: 'Tổng Giám Đốc (Toàn Quyền)',
      isSuperAdmin: true,
      allowedTabs: ROLE_TAB_PERMISSIONS.SUPER_ADMIN,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      phone: '0909888999'
    };
  }

  // Look for matching staff member by email
  const matchedStaff = staffList.find(
    s => s.email.toLowerCase().trim() === email
  );

  if (matchedStaff) {
    const role = matchedStaff.role as UserRole;
    const allowedTabs = ROLE_TAB_PERMISSIONS[role] || ['leads', 'orders', 'customers', 'products'];

    return {
      uid: fbUser.uid,
      email: matchedStaff.email,
      displayName: matchedStaff.name,
      role,
      roleTitle: `${matchedStaff.role} (${matchedStaff.region})`,
      isSuperAdmin: false,
      allowedTabs,
      staffProfile: matchedStaff,
      phone: matchedStaff.phone
    };
  }

  // Default fallback for any other registered staff email
  return {
    uid: fbUser.uid,
    email,
    displayName: fbUser.displayName || email.split('@')[0] || 'Nhân Viên Hải Hương',
    role: 'Sales B2B',
    roleTitle: 'Chuyên Viên Kinh Doanh B2B',
    isSuperAdmin: false,
    allowedTabs: ROLE_TAB_PERMISSIONS['Sales B2B'],
  };
}

// Create a new staff auth account on Firebase Auth using email and phone as password
// Uses a secondary Firebase App so the current admin is NOT logged out
export async function createStaffAuthAccount(
  email: string, 
  phonePassword: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = phonePassword.trim();

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Email không hợp lệ.' };
  }

  // Firebase Auth requires password >= 6 characters. Phone numbers in VN are 10 chars.
  if (cleanPhone.length < 6) {
    return { success: false, error: 'Số điện thoại làm mật khẩu phải có ít nhất 6 ký tự.' };
  }

  let secondaryApp;
  try {
    const existingApps = getApps();
    const found = existingApps.find(a => a.name === 'StaffWorkerAuth');
    if (found) {
      secondaryApp = found;
    } else {
      secondaryApp = initializeApp(firebaseConfig, 'StaffWorkerAuth');
    }
    const secondaryAuth = getAuth(secondaryApp);
    await createUserWithEmailAndPassword(secondaryAuth, cleanEmail, cleanPhone);
    await fbSignOut(secondaryAuth);
    return { success: true };
  } catch (err: any) {
    if (err?.code === 'auth/email-already-in-use') {
      // The user already exists in Firebase Auth, which is acceptable
      return { success: true };
    }
    console.warn('createStaffAuthAccount error:', err);
    return { 
      success: false, 
      error: err?.message || 'Không thể tạo tài khoản trên Firebase Auth' 
    };
  }
}

// Sign in with Firebase Auth Email/Password
export async function signInAppUser(
  email: string, 
  password: string,
  staffList: StaffMember[] = []
): Promise<AppUser> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
    const resolved = resolveAppUser(cred.user, staffList);
    if (!resolved) throw new Error('Không thể xác thực thông tin người dùng.');
    return resolved;
  } catch (error: any) {
    // If not found in Firebase Auth yet, check if this is a predefined staff member logging in for the first time
    const matchedStaff = staffList.find(
      s => s.email.toLowerCase().trim() === cleanEmail && s.phone.trim() === password.trim()
    );

    if (matchedStaff && (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential')) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        const resolved = resolveAppUser(cred.user, staffList);
        if (resolved) return resolved;
      } catch (createErr) {
        console.warn('Auto provision for staff failed:', createErr);
      }
    }

    let friendlyMessage = 'Đăng nhập không thành công.';
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      friendlyMessage = 'Tên đăng nhập (Email) hoặc mật khẩu không chính xác.';
    } else if (error.code === 'auth/wrong-password') {
      friendlyMessage = 'Mật khẩu không đúng. Với nhân sự mới, mật khẩu là số điện thoại.';
    } else if (error.code === 'auth/too-many-requests') {
      friendlyMessage = 'Quá nhiều lần thử thất bại. Vui lòng thử lại sau ít phút.';
    } else if (error.code === 'auth/invalid-email') {
      friendlyMessage = 'Định dạng email không hợp lệ.';
    } else if (error.message) {
      friendlyMessage = error.message;
    }

    throw new Error(friendlyMessage);
  }
}

// Sign out from Firebase Auth
export async function signOutAppUser(): Promise<void> {
  await fbSignOut(auth);
}

// Subscribe to auth state changes
export function subscribeToAuthChanges(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

