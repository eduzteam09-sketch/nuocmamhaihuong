import React, { useState } from 'react';
import { 
  Database, 
  CloudUpload, 
  CloudDownload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  RefreshCw,
  Server,
  ShieldCheck,
  Copy,
  ExternalLink,
  Layers
} from 'lucide-react';
import { 
  firebaseConfig, 
  seedAllMockDataToFirestore, 
  testFirestoreConnection,
  SeedSummary 
} from '../firebase';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshFromFirebase: () => Promise<void>;
  onSeedCompleted: () => void;
}

export const FirebaseSyncModal: React.FC<FirebaseSyncModalProps> = ({
  isOpen,
  onClose,
  onRefreshFromFirebase,
  onSeedCompleted,
}) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [seedProgress, setSeedProgress] = useState<{ step: string; percent: number }>({ step: '', percent: 0 });
  const [seedResult, setSeedResult] = useState<SeedSummary | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedRules, setCopiedRules] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setErrorMessage(null);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
    } catch (e: any) {
      setTestResult({ success: false, message: e.message || 'Lỗi kiểm tra kết nối' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeedData = async () => {
    setIsSeeding(true);
    setErrorMessage(null);
    setSeedResult(null);
    setSeedProgress({ step: 'Đang khởi tạo kết nối Firestore...', percent: 5 });

    try {
      const summary = await seedAllMockDataToFirestore((step, current, total) => {
        const pct = Math.round((current / total) * 100);
        setSeedProgress({ step, percent: pct });
      });

      setSeedResult(summary);
      setSeedProgress({ step: 'Hoàn tất đưa dữ liệu mẫu vào Firestore!', percent: 100 });
      onSeedCompleted();
    } catch (err: any) {
      console.error('Seed error:', err);
      let msg = err?.message || 'Có lỗi xảy ra khi đưa dữ liệu lên Firebase';
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error) msg = parsed.error;
      } catch (_) {}

      if (msg.includes('permission-denied') || msg.includes('Missing or insufficient permissions')) {
        setErrorMessage('Quyền truy cập Firestore bị từ chối. Vui lòng mở Firebase Console > Firestore Database > Rules và cập nhật quy tắc cho phép ghi dữ liệu.');
      } else {
        setErrorMessage(msg);
      }
    } finally {
      setIsSeeding(false);
    }
  };

  const handlePullFromFirebase = async () => {
    setIsPulling(true);
    setErrorMessage(null);
    try {
      await onRefreshFromFirebase();
      setTestResult({ success: true, message: 'Đã tải thành công dữ liệu từ Firestore về App!' });
    } catch (err: any) {
      let msg = err?.message || 'Không thể lấy dữ liệu từ Firebase';
      try {
        const parsed = JSON.parse(err.message);
        if (parsed?.error) msg = parsed.error;
      } catch (_) {}
      setErrorMessage(msg);
    } finally {
      setIsPulling(false);
    }
  };

  const sampleRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Chế độ thử nghiệm hoặc dùng rules bảo mật
    }
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleRules);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-amber-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-amber-100 flex items-center gap-2">
                Kết Nối & Nạp Dữ Liệu Firebase Firestore
              </h2>
              <p className="text-xs text-amber-200/80">
                Project: <code className="bg-black/30 px-2 py-0.5 rounded-md font-mono text-amber-300">{firebaseConfig.projectId}</code>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-gray-800 text-sm">
          
          {/* Connection Status Box */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <span>Firebase SDK Đã Cấu Hình</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Sẵn sàng
                  </span>
                </div>
                <div className="text-xs text-gray-600 mt-0.5">
                  Auth Domain: <span className="font-mono text-gray-700">{firebaseConfig.authDomain}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={isTesting}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/60 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              <span>Kiểm tra kết nối</span>
            </button>
          </div>

          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.success 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Seed Action Section */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <CloudUpload className="w-4 h-4 text-amber-700" />
                <span>Nạp Toàn Bộ Dữ Liệu Mẫu Sẵn Có Vào Firestore</span>
              </div>
              <span className="text-[11px] text-gray-500 font-medium">7 Bộ sưu tập</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Thao tác này sẽ ghi đè và lưu trữ bền vững toàn bộ dữ liệu mẫu (Sản phẩm SKU, Khách hàng 360, Chuỗi điểm bán, Lô chượp, Đơn hàng, Leads B2B, Đội ngũ nhân sự) lên Cloud Firestore của bạn.
            </p>

            {/* Collections list badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { name: 'products', label: 'Sản phẩm SKU' },
                { name: 'customers', label: 'Khách hàng 360' },
                { name: 'stores', label: 'Chuỗi điểm bán' },
                { name: 'batches', label: 'Lô chượp & Truy xuất' },
                { name: 'orders', label: 'Đơn hàng' },
                { name: 'leads', label: 'Leads B2B' },
                { name: 'staff', label: 'Đội ngũ nhân sự' },
              ].map(c => (
                <span key={c.name} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[11px] font-medium border border-gray-200 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-600" />
                  {c.label}
                </span>
              ))}
            </div>

            {/* Progress bar */}
            {isSeeding && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-semibold text-amber-900">
                  <span>{seedProgress.step}</span>
                  <span>{seedProgress.percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${seedProgress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleSeedData}
                disabled={isSeeding || isPulling}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Đang nạp dữ liệu lên Firestore...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4 text-amber-200" />
                    <span>Nạp Dữ Liệu Mẫu Ngay</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handlePullFromFirebase}
                disabled={isSeeding || isPulling}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-800 font-semibold text-xs rounded-xl border border-gray-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPulling ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                ) : (
                  <CloudDownload className="w-4 h-4 text-gray-600" />
                )}
                <span>Đồng bộ từ Firestore</span>
              </button>
            </div>
          </div>

          {/* Seed Result Success Box */}
          {seedResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Nạp thành công toàn bộ dữ liệu vào Firestore!</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-gray-500">Sản phẩm:</div>
                  <div className="font-bold text-emerald-700">{seedResult.products} SKUs</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-gray-500">Khách hàng:</div>
                  <div className="font-bold text-emerald-700">{seedResult.customers} KH</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-gray-500">Điểm bán:</div>
                  <div className="font-bold text-emerald-700">{seedResult.stores} Điểm</div>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200">
                  <div className="text-gray-500">Đơn hàng:</div>
                  <div className="font-bold text-emerald-700">{seedResult.orders} Đơn</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2 text-xs text-red-900">
              <div className="flex items-center gap-2 font-bold text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>Ghi chú lỗi Firestore</span>
              </div>
              <p className="leading-relaxed">{errorMessage}</p>

              {errorMessage.includes('Quyền truy cập') && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-red-200 space-y-2">
                  <div className="font-semibold text-gray-800 flex items-center justify-between">
                    <span>Quy tắc bảo mật đề xuất cho Firebase Console:</span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedRules ? 'Đã sao chép!' : 'Sao chép rules'}</span>
                    </button>
                  </div>
                  <pre className="p-2 bg-gray-900 text-amber-300 font-mono text-[10px] rounded-md overflow-x-auto">
                    {sampleRules}
                  </pre>
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/rules`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 hover:underline font-semibold text-[11px] pt-1"
                  >
                    <span>Mở Firebase Console Rules</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Security & Architecture Note */}
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5 text-[11px] text-gray-600">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-gray-800">Bảo mật & Đồng bộ 2 chiều:</span> Khi bạn tạo đơn hàng mới, cập nhật khách hàng, hoặc điều phối lô chượp trên giao diện, dữ liệu sẽ tự động lưu và đồng bộ tức thời với dự án Firebase <code className="text-amber-800 font-semibold">{firebaseConfig.projectId}</code>.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
