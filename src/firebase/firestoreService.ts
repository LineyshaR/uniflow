import { 
  collection, doc, setDoc, getDocs, onSnapshot, 
  query, orderBy, updateDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { CanteenOrder, GrievanceComplaint, Notice, DocumentRequest, UserProfile, AcademicTask } from '../types';

// ==================== Canteen Orders ====================
export const subscribeCanteenOrders = (
  callback: (orders: CanteenOrder[]) => void,
  fallback: CanteenOrder[]
) => {
  const path = 'canteenOrders';
  try {
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const orders: CanteenOrder[] = [];
          snapshot.forEach((docSnap) => {
            orders.push(docSnap.data() as CanteenOrder);
          });
          callback(orders);
        } else {
          // If empty in remote Firestore initially, seed or provide fallback
          callback(fallback);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        callback(fallback);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    callback(fallback);
    return () => {};
  }
};

export const saveCanteenOrder = async (order: CanteenOrder) => {
  const path = `canteenOrders/${order.id}`;
  try {
    await setDoc(doc(db, 'canteenOrders', order.id), order);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
};

export const updateCanteenOrderStatus = async (orderId: string, status: CanteenOrder['status']) => {
  const path = `canteenOrders/${orderId}`;
  try {
    await updateDoc(doc(db, 'canteenOrders', orderId), {
      status,
      estimatedPickupTime: status === 'Ready' ? 'Ready for pickup now!' : 'Preparing in kitchen'
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
};

// ==================== Complaints & Grievances ====================
export const subscribeComplaints = (
  callback: (complaints: GrievanceComplaint[]) => void,
  fallback: GrievanceComplaint[]
) => {
  const path = 'complaints';
  try {
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: GrievanceComplaint[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as GrievanceComplaint);
          });
          callback(list);
        } else {
          callback(fallback);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        callback(fallback);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    callback(fallback);
    return () => {};
  }
};

export const saveComplaint = async (complaint: GrievanceComplaint) => {
  const path = `complaints/${complaint.id}`;
  try {
    await setDoc(doc(db, 'complaints', complaint.id), complaint);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
};

export const updateComplaintStatus = async (
  complaintId: string, 
  status: GrievanceComplaint['status'],
  resolutionRemark?: string
) => {
  const path = `complaints/${complaintId}`;
  try {
    await updateDoc(doc(db, 'complaints', complaintId), {
      status,
      ...(resolutionRemark ? { resolutionRemark } : {})
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
};

// ==================== Notices & Circulars ====================
export const subscribeNotices = (
  callback: (notices: Notice[]) => void,
  fallback: Notice[]
) => {
  const path = 'notices';
  try {
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Notice[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Notice);
          });
          callback(list);
        } else {
          callback(fallback);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        callback(fallback);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    callback(fallback);
    return () => {};
  }
};

export const saveNotice = async (notice: Notice) => {
  const path = `notices/${notice.id}`;
  try {
    await setDoc(doc(db, 'notices', notice.id), notice);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
};

// ==================== Document Requests ====================
export const subscribeDocumentRequests = (
  callback: (docs: DocumentRequest[]) => void,
  fallback: DocumentRequest[]
) => {
  const path = 'documentRequests';
  try {
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: DocumentRequest[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as DocumentRequest);
          });
          callback(list);
        } else {
          callback(fallback);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        callback(fallback);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    callback(fallback);
    return () => {};
  }
};

export const saveDocumentRequest = async (docReq: DocumentRequest) => {
  const path = `documentRequests/${docReq.id}`;
  try {
    await setDoc(doc(db, 'documentRequests', docReq.id), docReq);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
};

// ==================== User Profile ====================
export const saveUserProfile = async (user: UserProfile) => {
  const path = `users/${user.id}`;
  try {
    await setDoc(doc(db, 'users', user.id), user);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
};

// ==================== Academic Tasks ====================
export const subscribeTasks = (
  callback: (tasks: AcademicTask[]) => void,
  fallback: AcademicTask[]
) => {
  const path = 'tasks';
  try {
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: AcademicTask[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as AcademicTask);
          });
          callback(list);
        } else {
          callback(fallback);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        callback(fallback);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    callback(fallback);
    return () => {};
  }
};

export const saveTask = async (task: AcademicTask) => {
  const path = `tasks/${task.id}`;
  try {
    await setDoc(doc(db, 'tasks', task.id), task);
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
};

export const submitTaskWork = async (taskId: string, studentRoll: string) => {
  const path = `tasks/${taskId}`;
  try {
    const docRef = doc(db, 'tasks', taskId);
    // Update local or Firestore doc
    await updateDoc(docRef, {
      status: 'Active'
    });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    return false;
  }
};

