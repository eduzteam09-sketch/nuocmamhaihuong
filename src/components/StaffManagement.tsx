import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  UserCheck, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Target,
  Clock,
  ShieldCheck,
  Building2,
  TrendingUp,
  Key,
  Copy,
  Lock
} from 'lucide-react';
import { StaffMember, LeadRecord, StoreNode } from '../types';
import { HuongGiotBienMascot } from './brand/HuongGiotBienMascot';
import { createStaffAuthAccount } from '../firebase';
import { ROLE_TAB_PERMISSIONS } from '../types/auth';

interface StaffManagementProps {
  staff: StaffMember[];
  leads?: LeadRecord[];
  stores?: StoreNode[];
  onAddStaff?: (newStaff: StaffMember) => void;
  onUpdateStaff?: (updated: StaffMember) => void;
  onDeleteStaff?: (id: string) => void;
  onNavigateToLeads?: (staffName: string) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staff,
  leads = [],
  stores = [],
  onAddStaff,
  onUpdateStaff,
  onDeleteStaff,
  onNavigateToLeads,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<StaffMember | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add modal fields
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState(`NV-${Math.floor(100 + Math.random() * 900)}`);
  const [newRole, setNewRole] = useState<StaffMember['role']>('Sales B2B');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRegion, setNewRegion] = useState<StaffMember['region']>('Miền Nam');
  const [newStatus, setNewStatus] = useState<StaffMember['status']>('Đang làm việc');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredStaff = staff.filter(member => {
    if (roleFilter !== 'ALL' && member.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        member.name.toLowerCase().includes(q) ||
        member.code.toLowerCase().includes(q) ||
        member.phone.includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getActiveLeadsCount = (staffName: string) => {
    return leads.filter(l => l.assignedTo.toLowerCase().includes(staffName.toLowerCase())).length;
  };

  const getEstimatedLeadValue = (staffName: string) => {
    return leads
      .filter(l => l.assignedTo.toLowerCase().includes(staffName.toLowerCase()))
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    if (newPhone.trim().length < 6) {
      alert('Số điện thoại dùng làm mật khẩu đăng nhập cần có tối thiểu 6 ký tự.');
      return;
    }

    setIsSubmitting(true);

    // Normalize email or auto-generate based on Vietnamese name
    const normalizedName = newName.trim().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .replace(/[^a-z0-9]/g, '.');

    const cleanEmail = newEmail.trim() || `${normalizedName}@haihuong.vn`;

    const member: StaffMember = {
      id: `staff-${Date.now()}`,
      code: newCode.trim(),
      name: newName.trim(),
      role: newRole,
      phone: newPhone.trim(),
      email: cleanEmail,
      region: newRegion,
      status: newStatus,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Auto provision Firebase Auth account: Email as login, Phone as password
    try {
      const authRes = await createStaffAuthAccount(member.email, member.phone);
      if (!authRes.success && authRes.error) {
        console.warn('Firebase Auth creation notice:', authRes.error);
      }
    } catch (err) {
      console.warn('Lỗi kích hoạt Firebase Auth:', err);
    }

    if (onAddStaff) onAddStaff(member);
    setIsSubmitting(false);
    setShowAddModal(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewCode(`NV-${Math.floor(100 + Math.random() * 900)}`);
    showToast(`✓ Đã thêm nhân sự [${member.name}] & cấp tài khoản: Email: ${member.email} | Mật khẩu: ${member.phone}`);
  };

  const handleSaveEditStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    if (onUpdateStaff) onUpdateStaff(editingStaff);
    showToast(`Đã cập nhật hồ sơ nhân sự [${editingStaff.name}]!`);
    setEditingStaff(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingStaff) return;
    if (onDeleteStaff) onDeleteStaff(deletingStaff.id);
    showToast(`Đã xóa nhân sự [${deletingStaff.name}] khỏi hệ thống.`);
    setDeletingStaff(null);
  };

  const salesStaffCount = staff.filter(s => s.role === 'Sales B2B' || s.role === 'Sales Thị Trường Chuỗi').length;
  const totalLeadsAssigned = leads.length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-950 text-amber-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-amber-500/40">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-700 to-amber-900 text-white flex items-center justify-center shadow-md shadow-amber-900/10">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-amber-950">Quản Lý Đội Ngũ Nhân Sự</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {staff.length} Nhân sự
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Phân bổ phụ trách Leads B2B, vận hành chuỗi điểm bán và kiểm định chất lượng mẻ chượp
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-amber-50 rounded-xl text-sm font-bold shadow-md shadow-amber-900/10 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Nhân Sự Mới</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Tổng Nhân Sự</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{staff.length}</span>
            <span className="text-xs text-emerald-600 font-bold">100% chính thức</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Đội Ngũ Kinh Doanh</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-800 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-950">{salesStaffCount}</span>
            <span className="text-xs text-gray-500">Sales B2B & Chuỗi</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Leads Đang Phân Bổ</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-950">{totalLeadsAssigned}</span>
            <span className="text-xs text-gray-500">Cơ hội theo dõi</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Vận Hành & QC</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-950">{staff.length - salesStaffCount}</span>
            <span className="text-xs text-gray-500">Kho vận & R&D</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã NV, số điện thoại, vai trò..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-amber-600 bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'ALL', label: 'Tất cả' },
            { id: 'Sales B2B', label: 'Sales B2B' },
            { id: 'Sales Thị Trường Chuỗi', label: 'Sales Chuỗi' },
            { id: 'Quản Lý Kho Vận', label: 'Kho Vận' },
            { id: 'Chuyên Viên R&D / QC', label: 'R&D / QC' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-amber-900 text-amber-50 font-bold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(member => {
          const leadCount = getActiveLeadsCount(member.name);
          const totalVal = getEstimatedLeadValue(member.name);

          return (
            <div 
              key={member.id}
              className="bg-white rounded-2xl border border-gray-200/80 p-4 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 font-bold text-base flex items-center justify-center shrink-0">
                      {member.name.split(' ').slice(-1)[0][0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{member.name}</span>
                        <span className="font-mono text-[10px] text-gray-400">({member.code})</span>
                      </div>
                      <span className={`inline-block mt-0.5 text-[11px] px-2 py-0.5 rounded-md font-bold ${
                        member.role === 'Sales B2B' ? 'bg-purple-100 text-purple-800' :
                        member.role === 'Sales Thị Trường Chuỗi' ? 'bg-amber-100 text-amber-900' :
                        member.role === 'Quản Lý Kho Vận' ? 'bg-blue-100 text-blue-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      title="Sửa thông tin"
                      onClick={() => setEditingStaff({ ...member })}
                      className="p-1.5 text-gray-400 hover:text-amber-800 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      title="Xóa nhân sự"
                      onClick={() => setDeletingStaff(member)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-gray-600 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-mono">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>Khu vực: {member.region}</span>
                  </div>
                </div>
              </div>

              {/* Work Assignment & Metrics */}
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Leads B2B phụ trách:</span>
                  <span className="font-bold text-amber-950">{leadCount} Cơ hội</span>
                </div>
                {totalVal > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Quy mô cơ hội:</span>
                    <span className="font-bold text-emerald-800">{totalVal.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {member.status}
                  </span>
                </div>
              </div>

              {/* Account Credentials Box */}
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-700" />
                    Tài khoản đăng nhập hệ thống:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Tài khoản Hải Hương:\n• Email (Tên đăng nhập): ${member.email}\n• Mật khẩu: ${member.phone}\n• Vai trò: ${member.role}`;
                      navigator.clipboard?.writeText(text);
                      showToast(`Đã sao chép tài khoản đăng nhập của ${member.name}!`);
                    }}
                    title="Sao chép thông tin đăng nhập gửi nhân sự"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-800 hover:text-amber-950 bg-amber-100/60 hover:bg-amber-200 border border-amber-300 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Sao chép</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono text-stone-600">
                  <div className="truncate">
                    <span className="text-stone-400 font-sans text-[10px]">User: </span>
                    <span className="font-semibold text-stone-900">{member.email}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 font-sans text-[10px]">Pass: </span>
                    <span className="font-semibold text-stone-900">{member.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Thêm Nhân Sự Mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-800" />
                <h3 className="font-bold text-amber-950 text-base">Thêm Nhân Sự Mới & Cấp Tài Khoản</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã nhân sự</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono focus:ring-1 focus:ring-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Minh Trí"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-amber-700 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Vai trò / Phân quyền chức vụ *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white font-medium"
                  >
                    <option value="Sales B2B">Sales B2B (Leads, Đơn hàng, Khách hàng)</option>
                    <option value="Sales Thị Trường Chuỗi">Sales Chuỗi (Điểm bán, Đơn hàng)</option>
                    <option value="Quản Lý Kho Vận">Quản Lý Kho Vận (Đơn hàng, Lô mẻ chượp)</option>
                    <option value="Chuyên Viên R&D / QC">Chuyên Viên R&D / QC (Mẻ chượp, Độ đạm)</option>
                    <option value="Chăm Sóc Khách Hàng">Chăm Sóc Khách Hàng (Customer 360, AI Alert)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Khu vực phụ trách</label>
                  <select
                    value={newRegion}
                    onChange={(e) => setNewRegion(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Toàn quốc">Toàn quốc</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Email * (Tên đăng nhập hệ thống)
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tri.hoang@haihuong.vn"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">
                    Số điện thoại * (Mật khẩu đăng nhập)
                  </label>
                  <input
                    type="tel"
                    required
                    minLength={6}
                    placeholder="0901234567 (Tối thiểu 6 số)"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Automatic Credentials & Access Preview Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-300 rounded-xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  <span>Quy định tạo tài khoản hệ thống Hải Hương:</span>
                </div>
                <div className="text-[11px] text-stone-700 space-y-1">
                  <div>• <strong>Tên đăng nhập:</strong> Email nhân sự được cấp.</div>
                  <div>• <strong>Mật khẩu:</strong> Số điện thoại nhân sự (tự động đăng ký trên Firebase Auth).</div>
                  <div>• <strong>Phân quyền RBAC:</strong> Khi nhân sự đăng nhập, hệ thống <strong>chỉ hiển thị thông tin và phân hệ</strong> liên quan trực tiếp đến vị trí <strong>[{newRole}]</strong> để bảo mật và tối ưu công việc.</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-900 hover:to-amber-950 text-white rounded-xl font-bold cursor-pointer shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang kích hoạt tài khoản...</span>
                    </>
                  ) : (
                    <span>Lưu Nhân Sự & Kích Hoạt Tài Khoản</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sửa Nhân Sự */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-amber-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-800" />
                <h3 className="font-bold text-amber-950 text-base">Cập Nhật Nhân Sự [{editingStaff.code}]</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStaff} className="space-y-3.5 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Mã nhân sự</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.code}
                    onChange={(e) => setEditingStaff({ ...editingStaff, code: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono focus:ring-1 focus:ring-amber-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={editingStaff.name}
                    onChange={(e) => setEditingStaff({ ...editingStaff, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium focus:ring-1 focus:ring-amber-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Vai trò / Bộ phận</label>
                  <select
                    value={editingStaff.role}
                    onChange={(e) => setEditingStaff({ ...editingStaff, role: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="Sales B2B">Sales B2B</option>
                    <option value="Sales Thị Trường Chuỗi">Sales Thị Trường Chuỗi</option>
                    <option value="Quản Lý Kho Vận">Quản Lý Kho Vận</option>
                    <option value="Chuyên Viên R&D / QC">Chuyên Viên R&D / QC</option>
                    <option value="Chăm Sóc Khách Hàng">Chăm Sóc Khách Hàng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Khu vực phụ trách</label>
                  <select
                    value={editingStaff.region}
                    onChange={(e) => setEditingStaff({ ...editingStaff, region: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                  >
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Toàn quốc">Toàn quốc</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={editingStaff.phone}
                    onChange={(e) => setEditingStaff({ ...editingStaff, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStaff.email}
                    onChange={(e) => setEditingStaff({ ...editingStaff, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Trạng thái công việc</label>
                <select
                  value={editingStaff.status}
                  onChange={(e) => setEditingStaff({ ...editingStaff, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                >
                  <option value="Đang làm việc">Đang làm việc</option>
                  <option value="Nghỉ phép">Nghỉ phép</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl font-bold cursor-pointer"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-bold text-rose-900 text-base">Xác nhận xóa nhân sự</h3>
            <p className="text-xs text-gray-600 mt-2">
              Bạn có chắc chắn muốn xóa nhân sự <strong>{deletingStaff.name}</strong> ({deletingStaff.code})? 
              Các phân công Leads hoặc điều phối liên quan sẽ cần được bàn giao lại.
            </p>
            <div className="flex items-center justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeletingStaff(null)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 text-xs hover:bg-gray-50 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Xác Nhận Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
