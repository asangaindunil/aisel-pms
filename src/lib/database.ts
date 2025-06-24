import { Patient, User, CreatePatientData } from '@/types/patient';
import bcrypt from 'bcryptjs';

type UserWithPassword = User & { passwordHash: string };

class InMemoryDatabase {
  patients: Patient[] = [];
  users: UserWithPassword[] = [];
  patientIdCounter = 1;
  userIdCounter = 1;
  initialized = false;

  async init() {
    if (this.initialized) return;
    try {
      const [adminHash, userHash] = await Promise.all([
        bcrypt.hash('admin123', 10),
        bcrypt.hash('user123', 10),
      ]);
      const now = new Date().toISOString();

      this.users = [
        { id: this.userIdCounter++, username: 'admin', role: 'admin', createdAt: now, isDisabled: false, passwordHash: adminHash },
        { id: this.userIdCounter++, username: 'user', role: 'user', createdAt: now, isDisabled: false, passwordHash: userHash },
      ];

      this.patients = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@email.com', phoneNumber: '+1234567890', dob: '1985-06-15', createdAt: now, updatedAt: now },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@email.com', phoneNumber: '+1987654321', dob: '1990-03-22', createdAt: now, updatedAt: now },
        { id: 3, firstName: 'Michael', lastName: 'Johnson', email: 'michael.johnson@email.com', phoneNumber: '+1122334455', dob: '1978-11-08', createdAt: now, updatedAt: now },
      ];
      this.patientIdCounter = this.patients.length + 1;
      this.initialized = true;
    } catch (e) {
      console.error('Failed to initialize database:', e);
    }
  }

  // Patient CRUD
  getAllPatients(): Patient[] {
    return this.patients.map(({ ...p }) => ({ ...p }));
  }

  getPatientById(id: number): Patient | null {
    const p = this.patients.find(p => p.id === id);
    return p ? { ...p } : null;
  }

  createPatient(data: CreatePatientData): Patient {
    const now = new Date().toISOString();
    const patient: Patient = { id: this.patientIdCounter++, ...data, createdAt: now, updatedAt: now };
    this.patients.push(patient);
    return { ...patient };
  }

  updatePatient(id: number, data: Partial<CreatePatientData>): Patient | null {
    const patient = this.patients.find(p => p.id === id);
    if (!patient) return null;
    Object.assign(patient, data, { updatedAt: new Date().toISOString() });
    return { ...patient };
  }

  deletePatient(id: number): boolean {
    const idx = this.patients.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.patients.splice(idx, 1);
    return true;
  }

  // User
  getUserByUsername(username: string): UserWithPassword | null {
    return this.users.find(u => u.username === username) ?? null;
  }

  getUserById(id: number): User | null {
    const user = this.users.find(u => u.id === id);
    if (!user) return null;
    // Exclude passwordHash before returning
    const { ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }

  // Secure user creation
  async createUser(username: string, password: string, role: 'admin' | 'user'): Promise<User | null> {
    if (this.users.some(u => u.username === username)) return null;
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date().toISOString();
    const user: UserWithPassword = {
      id: this.userIdCounter++,
      username,
      role,
      createdAt: now,
      isDisabled: false,
      passwordHash,
    };
    this.users.push(user);
    const { ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}

export const database = new InMemoryDatabase();
// Remember to call await database.init() before use!
