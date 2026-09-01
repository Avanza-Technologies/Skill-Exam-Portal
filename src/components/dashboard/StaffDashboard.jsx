import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  attendanceApi,
  leaveApi,
  outsideWorkApi,
  employeeApi,
  reportingApi,
  holidayApi,
  auditApi,
  systemApi,
} from '../../services/api';
import './StaffDashboard.css';

// ── Time & Duration Calculation Helpers ───────────────────────────
function formatMinutesToHours(minutes) {
  if (minutes == null || isNaN(minutes) || minutes <= 0) return '0 min';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  if (mins === 0) return `${hrs} hrs`;
  return `${hrs}h ${mins}m`;
}

function calculateLiveDuration(inTimeStr, now) {
  if (!inTimeStr) return '0m';
  const [inH, inM, inS] = inTimeStr.split(':').map(Number);
  const inSeconds = (inH || 0) * 3600 + (inM || 0) * 60 + (inS || 0);
  const nowSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const diffSec = Math.max(0, nowSeconds - inSeconds);
  const hrs = Math.floor(diffSec / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  const secs = diffSec % 60;
  if (hrs === 0) return `${mins}m ${secs}s`;
  return `${hrs}h ${mins}m ${secs}s`;
}

export default function StaffDashboard() {
  const { user, logout, isSuperAdmin, isHR, isManager } = useAuth();
  const navigate = useNavigate();

  // Active portal tab
  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'leaves' | 'outside' | 'employees' | 'reports' | 'holidays' | 'audit'

  // Clock
  const [currentTime, setCurrentTime] = useState(new Date());

  // Backend status
  const [serverStatus, setServerStatus] = useState({ online: true, checked: false });
  const [toastMessage, setToastMessage] = useState(null);

  // ── Employees Roster ──────────────────────────────────────────
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Selected Employee for timesheet (defaults to logged-in user's employee)
  const [selectedEmpId, setSelectedEmpId] = useState(1);

  // ── Attendance Timesheet State ─────────────────────────────────
  const [attendanceMonth, setAttendanceMonth] = useState('2026-09');
  const [dailyRecords, setDailyRecords] = useState([]);
  const [loadingDailyRecords, setLoadingDailyRecords] = useState(false);

  // Sessions detail modal for a specific day
  const [selectedRecordForSessions, setSelectedRecordForSessions] = useState(null);

  // ── Punch State ───────────────────────────────────────────────
  const [punchStatus, setPunchStatus] = useState({
    isPunchedIn: false,
    checkInTime: null,
    checkOutTime: null,
    lastAction: null,
    todayRecordedMinutes: 0,
    todaySessions: [],
  });
  const [punchLoading, setPunchLoading] = useState(false);
  const [workMode, setWorkMode] = useState('OFFICE');
  const [punchRemarks, setPunchRemarks] = useState('');

  // ── Leave Management State ────────────────────────────────────
  const [leaveType, setLeaveType] = useState('CASUAL_LEAVE');
  const [leaveFromDate, setLeaveFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveToDate, setLeaveToDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveIsHalfDay, setLeaveIsHalfDay] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [submittingLeave, setSubmittingLeave] = useState(false);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);

  // ── Outside Work State ────────────────────────────────────────
  const [owDate, setOwDate] = useState(new Date().toISOString().split('T')[0]);
  const [owStartTime, setOwStartTime] = useState('09:30:00');
  const [owEndTime, setOwEndTime] = useState('13:30:00');
  const [owPurpose, setOwPurpose] = useState('');
  const [submittingOw, setSubmittingOw] = useState(false);
  const [pendingOw, setPendingOw] = useState([]);
  const [loadingOw, setLoadingOw] = useState(false);

  // ── Employee Onboarding Modal State ───────────────────────────
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [newEmpCode, setNewEmpCode] = useState('');
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpDept, setNewEmpDept] = useState(1);
  const [newEmpBranch, setNewEmpBranch] = useState(1);
  const [newEmpPolicy, setNewEmpPolicy] = useState(1);
  const [submittingEmp, setSubmittingEmp] = useState(false);

  // ── Reports & Payroll State ───────────────────────────────────
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [monthlySummaries, setMonthlySummaries] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [finalizingMonth, setFinalizingMonth] = useState(false);

  // ── Holidays State ────────────────────────────────────────────
  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [showAddHolidayModal, setShowAddHolidayModal] = useState(false);
  const [newHolidayName, setNewHolidayName] = useState('');
  const [newHolidayDate, setNewHolidayDate] = useState('');
  const [newHolidayType, setNewHolidayType] = useState('PUBLIC');
  const [submittingHoliday, setSubmittingHoliday] = useState(false);

  // ── Audit Logs State ──────────────────────────────────────────
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);

  // Toast Helper
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Ping backend health
  useEffect(() => {
    let isMounted = true;
    systemApi.checkHealth().then((res) => {
      if (isMounted) setServerStatus({ online: res.online, checked: true });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // ── Data Fetchers ─────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const res = await employeeApi.getAllActive(user?.organizationId || 1);
      if (res?.data && res.data.length > 0) {
        setEmployees(res.data);
        const matched = res.data.find(
          (e) =>
            (user?.userId && e.userId === user.userId) ||
            (user?.email && e.email?.toLowerCase() === user.email.toLowerCase())
        );
        if (matched) {
          setSelectedEmpId(matched.id);
        } else if (!selectedEmpId) {
          setSelectedEmpId(res.data[0].id);
        }
      }
    } catch (err) {
      console.warn('Could not load employees:', err.message);
    } finally {
      setLoadingEmployees(false);
    }
  }, [user, selectedEmpId]);

  const fetchDailyAttendance = useCallback(
    async (empId = selectedEmpId, month = attendanceMonth) => {
      if (!empId) return;
      setLoadingDailyRecords(true);
      try {
        const res = await attendanceApi.getDailyRecords(empId, month);
        if (res?.data) {
          setDailyRecords(res.data);

          // Update today's punch state from database
          const todayStr = new Date().toISOString().split('T')[0];
          const todayRec = res.data.find((r) => r.workDate === todayStr);

          if (todayRec) {
            setPunchStatus({
              isPunchedIn: Boolean(todayRec.isPunchedIn),
              checkInTime: todayRec.inTime,
              checkOutTime: todayRec.outTime,
              lastAction: todayRec.isPunchedIn
                ? `Active Session started at ${todayRec.inTime}`
                : todayRec.outTime
                ? `Last Punch Out recorded at ${todayRec.outTime} (${formatMinutesToHours(todayRec.recordedMinutes)} worked)`
                : null,
              todayRecordedMinutes: todayRec.recordedMinutes || 0,
              todaySessions: todayRec.sessions || [],
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch daily attendance:', err.message);
      } finally {
        setLoadingDailyRecords(false);
      }
    },
    [selectedEmpId, attendanceMonth]
  );

  const fetchPendingLeaves = useCallback(async () => {
    if (isSuperAdmin || isHR || isManager) {
      setLoadingLeaves(true);
      try {
        const res = await leaveApi.getPending(user?.organizationId || 1);
        if (res?.data) setPendingLeaves(res.data);
      } catch (err) {
        console.warn('Could not load pending leaves:', err.message);
      } finally {
        setLoadingLeaves(false);
      }
    }
  }, [isSuperAdmin, isHR, isManager, user?.organizationId]);

  const fetchPendingOw = useCallback(async () => {
    if (isSuperAdmin || isHR || isManager) {
      setLoadingOw(true);
      try {
        const res = await outsideWorkApi.getPending(user?.organizationId || 1);
        if (res?.data) setPendingOw(res.data);
      } catch (err) {
        console.warn('Could not load pending outside work:', err.message);
      } finally {
        setLoadingOw(false);
      }
    }
  }, [isSuperAdmin, isHR, isManager, user?.organizationId]);

  const fetchReports = useCallback(
    async (month = selectedMonth) => {
      setLoadingReports(true);
      try {
        const res = await reportingApi.getMonthlySummaries(user?.organizationId || 1, month);
        if (res?.data) setMonthlySummaries(res.data);
      } catch (err) {
        console.warn('Could not load reports:', err.message);
      } finally {
        setLoadingReports(false);
      }
    },
    [user?.organizationId, selectedMonth]
  );

  const fetchHolidays = useCallback(async () => {
    setLoadingHolidays(true);
    try {
      const res = await holidayApi.getHolidays(user?.organizationId || 1, '2026-01-01', '2026-12-31');
      if (res?.data) setHolidays(res.data);
    } catch (err) {
      console.warn('Could not load holidays:', err.message);
    } finally {
      setLoadingHolidays(false);
    }
  }, [user?.organizationId]);

  const fetchAuditLogs = useCallback(async () => {
    if (isSuperAdmin || isHR) {
      setLoadingAudit(true);
      try {
        const res = await auditApi.getLogs(user?.organizationId || 1, 0, 30);
        if (res?.data?.content) {
          setAuditLogs(res.data.content);
        } else if (Array.isArray(res?.data)) {
          setAuditLogs(res.data);
        }
      } catch (err) {
        console.warn('Could not load audit logs:', err.message);
      } finally {
        setLoadingAudit(false);
      }
    }
  }, [isSuperAdmin, isHR, user?.organizationId]);

  // Initial load
  useEffect(() => {
    fetchEmployees();
    fetchPendingLeaves();
    fetchPendingOw();
    fetchHolidays();
  }, [fetchEmployees, fetchPendingLeaves, fetchPendingOw, fetchHolidays]);

  // Load timesheet when selectedEmpId or attendanceMonth changes
  useEffect(() => {
    if (selectedEmpId) {
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    }
  }, [selectedEmpId, attendanceMonth, fetchDailyAttendance]);

  // Load tab-specific data on tab switch
  useEffect(() => {
    if (activeTab === 'attendance') fetchDailyAttendance(selectedEmpId, attendanceMonth);
    if (activeTab === 'reports') fetchReports();
    if (activeTab === 'audit') fetchAuditLogs();
    if (activeTab === 'leaves') fetchPendingLeaves();
    if (activeTab === 'outside') fetchPendingOw();
    if (activeTab === 'employees') fetchEmployees();
  }, [activeTab, fetchDailyAttendance, selectedEmpId, attendanceMonth, fetchReports, fetchAuditLogs, fetchPendingLeaves, fetchPendingOw, fetchEmployees]);

  // ── Real-Time Working Hours Summary Calculations ──────────────
  const monthlyMetrics = useMemo(() => {
    let presentDays = 0;
    let totalWorkedMinutes = 0;
    let totalCreditedMinutes = 0;
    let totalPermissionMinutes = 0;
    let halfDays = 0;
    let absences = 0;

    dailyRecords.forEach((r) => {
      if (r.calculatedStatus === 'PRESENT') presentDays++;
      if (r.calculatedStatus === 'HALF_DAY_LEAVE') halfDays++;
      if (r.calculatedStatus === 'ABSENT') absences++;
      if (r.recordedMinutes) totalWorkedMinutes += r.recordedMinutes;
      if (r.creditedMinutes) totalCreditedMinutes += r.creditedMinutes;
      if (r.permissionMinutes) totalPermissionMinutes += r.permissionMinutes;
    });

    return {
      presentDays,
      halfDays,
      absences,
      totalWorkedHours: (totalWorkedMinutes / 60).toFixed(1),
      totalCreditedHours: (totalCreditedMinutes / 60).toFixed(1),
      totalPermissionMinutes,
      recordCount: dailyRecords.length,
    };
  }, [dailyRecords]);

  // ── Attendance Handlers ────────────────────────────────────────
  const handleCheckIn = async () => {
    setPunchLoading(true);
    try {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const dateStr = now.toISOString().split('T')[0];

      const payload = {
        employeeId: selectedEmpId || 1,
        workDate: dateStr,
        checkInTime: timeStr,
        workingMode: workMode,
        remarks: `[${workMode}] ${punchRemarks || 'Session check-in'}`,
      };

      const res = await attendanceApi.checkIn(payload);
      const data = res?.data;

      setPunchStatus({
        isPunchedIn: true,
        checkInTime: data?.inTime || timeStr,
        checkOutTime: null,
        lastAction: `Punch In recorded at ${timeStr} (${workMode})`,
        todayRecordedMinutes: data?.recordedMinutes || 0,
        todaySessions: data?.sessions || [],
      });

      showToast(`Punched in at ${timeStr}! Backend session opened.`, 'success');
      setPunchRemarks('');
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    } catch (err) {
      console.error('Check-in error:', err);
      showToast(err.message || 'Check-in failed on Spring Boot backend.', 'error');
    } finally {
      setPunchLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setPunchLoading(true);
    try {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const dateStr = now.toISOString().split('T')[0];

      const payload = {
        employeeId: selectedEmpId || 1,
        workDate: dateStr,
        checkOutTime: timeStr,
        remarks: punchRemarks || 'Session check-out',
      };

      const res = await attendanceApi.checkOut(payload);
      const data = res?.data;

      setPunchStatus({
        isPunchedIn: false,
        checkInTime: data?.inTime || punchStatus.checkInTime,
        checkOutTime: timeStr,
        lastAction: `Punch Out recorded at ${timeStr}. Total Worked: ${formatMinutesToHours(data?.recordedMinutes)}`,
        todayRecordedMinutes: data?.recordedMinutes || 0,
        todaySessions: data?.sessions || [],
      });

      showToast(`Punched out at ${timeStr}! Backend aggregated worked time: ${formatMinutesToHours(data?.recordedMinutes)}`, 'success');
      setPunchRemarks('');
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    } catch (err) {
      console.error('Check-out error:', err);
      showToast(err.message || 'Check-out failed on Spring Boot backend.', 'error');
    } finally {
      setPunchLoading(false);
    }
  };

  // ── Leave Handlers ─────────────────────────────────────────────
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (!leaveReason.trim()) {
      showToast('Please provide a reason for the leave request.', 'error');
      return;
    }

    setSubmittingLeave(true);
    try {
      const payload = {
        employeeId: selectedEmpId || 1,
        fromDate: leaveFromDate,
        toDate: leaveToDate,
        leaveType: leaveType,
        isHalfDay: leaveIsHalfDay,
        reason: leaveReason.trim(),
      };

      await leaveApi.submit(payload);
      showToast('Leave request submitted to Spring Boot for approval!', 'success');
      setLeaveReason('');
      fetchPendingLeaves();
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    } catch (err) {
      console.error('Leave submission failed:', err);
      showToast(err.message || 'Could not submit leave request.', 'error');
    } finally {
      setSubmittingLeave(false);
    }
  };

  const handleApproveLeave = async (id, status) => {
    try {
      await leaveApi.approveOrReject(id, status, `Actioned by ${user?.fullName || user?.username}`);
      showToast(`Leave request #${id} ${status.toLowerCase()} in DB!`, 'success');
      fetchPendingLeaves();
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    } catch (err) {
      console.error('Leave approval failed:', err);
      showToast(err.message || 'Failed to update leave status.', 'error');
    }
  };

  // ── Outside Work Handlers ──────────────────────────────────────
  const handleSubmitOutsideWork = async (e) => {
    e.preventDefault();
    if (!owPurpose.trim()) {
      showToast('Please provide the purpose or client location.', 'error');
      return;
    }

    setSubmittingOw(true);
    try {
      const payload = {
        employeeId: selectedEmpId || 1,
        workDate: owDate,
        startTime: owStartTime.length === 5 ? `${owStartTime}:00` : owStartTime,
        endTime: owEndTime.length === 5 ? `${owEndTime}:00` : owEndTime,
        purpose: owPurpose.trim(),
      };

      await outsideWorkApi.submit(payload);
      showToast('Outside work duty submitted for manager approval!', 'success');
      setOwPurpose('');
      fetchPendingOw();
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    } catch (err) {
      console.error('Outside work submission failed:', err);
      showToast(err.message || 'Could not submit outside work.', 'error');
    } finally {
      setSubmittingOw(false);
    }
  };

  const handleApproveOw = async (id, status) => {
    try {
      await outsideWorkApi.approveOrReject(id, status, `Actioned by ${user?.fullName || user?.username}`);
      showToast(`Outside work request #${id} ${status.toLowerCase()}!`, 'success');
      fetchPendingOw();
      fetchDailyAttendance(selectedEmpId, attendanceMonth);
    } catch (err) {
      console.error('Outside work approval failed:', err);
      showToast(err.message || 'Failed to update outside work status.', 'error');
    }
  };

  // ── Employee Onboarding Handlers ───────────────────────────────
  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    if (!newEmpCode.trim() || !newEmpName.trim() || !newEmpEmail.trim()) {
      showToast('Please fill all required employee fields.', 'error');
      return;
    }

    setSubmittingEmp(true);
    try {
      const payload = {
        organizationId: user?.organizationId || 1,
        branchId: Number(newEmpBranch),
        departmentId: Number(newEmpDept),
        attendancePolicyId: Number(newEmpPolicy),
        employeeCode: newEmpCode.trim(),
        fullName: newEmpName.trim(),
        email: newEmpEmail.trim(),
        phone: newEmpPhone.trim() || '+91 80890 30405',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
      };

      await employeeApi.create(payload);
      showToast(`Employee ${newEmpName} created in database!`, 'success');
      setShowAddEmpModal(false);
      setNewEmpCode('');
      setNewEmpName('');
      setNewEmpEmail('');
      setNewEmpPhone('');
      fetchEmployees();
    } catch (err) {
      console.error('Create employee failed:', err);
      showToast(err.message || 'Failed to create employee.', 'error');
    } finally {
      setSubmittingEmp(false);
    }
  };

  // ── Reports Handlers ───────────────────────────────────────────
  const handleDownloadExcel = async () => {
    setExportingExcel(true);
    try {
      await reportingApi.downloadExcel(user?.organizationId || 1, selectedMonth);
      showToast(`Excel payroll report for ${selectedMonth} downloaded!`, 'success');
    } catch (err) {
      console.error('Excel download failed:', err);
      showToast(err.message || 'Failed to download Excel report.', 'error');
    } finally {
      setExportingExcel(false);
    }
  };

  const handleFinalizeMonth = async () => {
    if (!window.confirm(`Are you sure you want to finalize and lock payroll for ${selectedMonth}?`)) {
      return;
    }
    setFinalizingMonth(true);
    try {
      await reportingApi.finalizeMonth(user?.organizationId || 1, selectedMonth);
      showToast(`Month ${selectedMonth} finalized and locked in DB!`, 'success');
      fetchReports(selectedMonth);
    } catch (err) {
      console.error('Finalize month failed:', err);
      showToast(err.message || 'Could not finalize month.', 'error');
    } finally {
      setFinalizingMonth(false);
    }
  };

  // ── Holiday Handlers ───────────────────────────────────────────
  const handleCreateHoliday = async (e) => {
    e.preventDefault();
    if (!newHolidayName.trim() || !newHolidayDate) {
      showToast('Please provide holiday name and date.', 'error');
      return;
    }
    setSubmittingHoliday(true);
    try {
      await holidayApi.create({
        organizationId: user?.organizationId || 1,
        branchId: 1,
        holidayDate: newHolidayDate,
        name: newHolidayName.trim(),
        holidayType: newHolidayType,
      });
      showToast('Company holiday saved to DB successfully!', 'success');
      setShowAddHolidayModal(false);
      setNewHolidayName('');
      setNewHolidayDate('');
      fetchHolidays();
    } catch (err) {
      console.error('Holiday creation failed:', err);
      showToast(err.message || 'Failed to create holiday.', 'error');
    } finally {
      setSubmittingHoliday(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentEmployee = employees.find((e) => e.id === Number(selectedEmpId));

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase();
    return (
      (emp.fullName && emp.fullName.toLowerCase().includes(q)) ||
      (emp.employeeCode && emp.employeeCode.toLowerCase().includes(q)) ||
      (emp.email && emp.email.toLowerCase().includes(q)) ||
      (emp.departmentName && emp.departmentName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="nz-editorial-dash-root">
      {/* Background ambient lighting */}
      <div className="nz-editorial-dash-glow-emerald" />
      <div className="nz-editorial-dash-glow-dark" />

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`nz-editorial-toast is-${toastMessage.type}`}>
          <span className="nz-toast-bullet">●</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Luxury Navigation Header */}
      <header className="nz-dash-top-nav">
        <div className="nz-dash-nav-container">
          <Link to="/" className="nz-dash-nav-brand">
            <img src="/nsk.jpeg" alt="Networkz Systems" className="nz-dash-brand-img" />
            <span className="nz-dash-brand-title">NETWORKZ SYSTEMS</span>
            <span className="nz-dash-brand-badge">KOLLAM CAMPUS</span>
          </Link>

          <div className="nz-dash-nav-actions">
            <div className={`nz-dash-server-badge ${serverStatus.online ? 'is-online' : 'is-offline'}`}>
              <span className="nz-dash-dot" />
              <span>{serverStatus.online ? 'Spring Boot :8080 Active' : 'Connecting...'}</span>
            </div>

            <Link to="/" className="nz-dash-home-btn">
              ← Campus Home
            </Link>

            <div className="nz-dash-user-cell">
              <div className="nz-dash-avatar">
                {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="nz-dash-user-meta">
                <span className="nz-dash-user-name">{user?.fullName || user?.username}</span>
                <span className="nz-dash-user-role">
                  {user?.roles?.[0]?.replace('ROLE_', '') || 'STAFF'}
                </span>
              </div>
              <button
                type="button"
                className="nz-dash-logout-btn"
                onClick={handleLogout}
                title="Sign Out"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="nz-dash-content-container">
        {/* Welcome Banner Card */}
        <section className="nz-dash-welcome-card">
          <div className="nz-welcome-left">
            <span className="nz-eyebrow">ENTERPRISE ATTENDANCE & PAYROLL LEDGER</span>
            <h1 className="nz-welcome-title">
              WELCOME, {user?.fullName || user?.username}!
            </h1>
            <p className="nz-welcome-subtitle">
              Backend multi-punch calculation engine with automated working hours aggregation, timesheets, and approvals.
            </p>
          </div>

          <div className="nz-welcome-meta-strip">
            <div className="nz-meta-pill">
              <span className="nz-meta-pill-label">INSPECTING STAFF</span>
              <span className="nz-meta-pill-val">{currentEmployee?.fullName || user?.fullName || 'Active Staff'}</span>
            </div>
            <div className="nz-meta-pill">
              <span className="nz-meta-pill-label">EMP CODE</span>
              <span className="nz-meta-pill-val">{currentEmployee?.employeeCode || `EMP-${user?.userId || '1'}`}</span>
            </div>
            <div className="nz-meta-pill">
              <span className="nz-meta-pill-label">ROLE</span>
              <span className="nz-meta-pill-val nz-accent-val">{user?.roles?.[0]?.replace('ROLE_', '') || 'EMPLOYEE'}</span>
            </div>
            <div className="nz-meta-pill">
              <span className="nz-meta-pill-label">CAMPUS</span>
              <span className="nz-meta-pill-val">{currentEmployee?.branchName || 'Kollam Main Hub'}</span>
            </div>
          </div>
        </section>

        {/* ── Editorial Module Tabs Bar ────────────────────────────── */}
        <div className="nz-editorial-portal-tabs">
          <button
            type="button"
            className={`nz-portal-tab-btn ${activeTab === 'attendance' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            🕒 ATTENDANCE & WORKING HOURS
          </button>

          <button
            type="button"
            className={`nz-portal-tab-btn ${activeTab === 'leaves' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('leaves')}
          >
            📝 LEAVE MANAGEMENT
            {pendingLeaves.length > 0 && (isSuperAdmin || isHR || isManager) && (
              <span className="nz-tab-count-badge">{pendingLeaves.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`nz-portal-tab-btn ${activeTab === 'outside' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('outside')}
          >
            🚗 OUTSIDE WORK / ON-DUTY
            {pendingOw.length > 0 && (isSuperAdmin || isHR || isManager) && (
              <span className="nz-tab-count-badge">{pendingOw.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`nz-portal-tab-btn ${activeTab === 'employees' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            👥 STAFF DIRECTORY
          </button>

          <button
            type="button"
            className={`nz-portal-tab-btn ${activeTab === 'reports' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            📊 REPORTS & PAYROLL
          </button>

          <button
            type="button"
            className={`nz-portal-tab-btn ${activeTab === 'holidays' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('holidays')}
          >
            📅 HOLIDAY CALENDAR
          </button>

          {(isSuperAdmin || isHR) && (
            <button
              type="button"
              className={`nz-portal-tab-btn ${activeTab === 'audit' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('audit')}
            >
              🛡️ AUDIT LOGS
            </button>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════
            TAB 1: ATTENDANCE, PUNCH & BACKEND WORKING HOURS DECK
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'attendance' && (
          <div className="nz-attendance-deck-container">
            {/* 2-Column Top Section: Punch Controls + Policy Stats */}
            <div className="nz-dash-deck-grid">
              {/* Digital Attendance Punch Card */}
              <section className="nz-dash-card nz-punch-deck-card">
                <div className="nz-card-top-bar">
                  <div>
                    <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>SPRING BOOT PUNCH ENGINE</span>
                    <h2 className="nz-card-heading">ATTENDANCE PUNCH</h2>
                  </div>
                  <span className={`nz-punch-badge ${punchStatus.isPunchedIn ? 'is-in' : 'is-out'}`}>
                    {punchStatus.isPunchedIn ? '● PUNCHED IN' : '○ PUNCHED OUT'}
                  </span>
                </div>

                {/* Digital Clock Display */}
                <div className="nz-editorial-clock-wrap">
                  <div className="nz-clock-digits">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div className="nz-clock-calendar">
                    {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                {/* Real-Time Working Hours Tracker */}
                <div className="nz-live-hours-tracker-card">
                  <div className="nz-tracker-left">
                    <span className="nz-tracker-label">BACKEND AGGREGATED WORKED TIME (TODAY)</span>
                    <div className="nz-tracker-val">
                      {punchStatus.isPunchedIn
                        ? `Live: ${calculateLiveDuration(punchStatus.checkInTime, currentTime)} (In Progress)`
                        : punchStatus.todayRecordedMinutes > 0
                        ? `${formatMinutesToHours(punchStatus.todayRecordedMinutes)} (${(punchStatus.todayRecordedMinutes / 60).toFixed(1)} hrs)`
                        : '0h 00m (Shift Not Started)'}
                    </div>
                  </div>
                  <div className="nz-tracker-badge">
                    {punchStatus.isPunchedIn ? '● ACTIVE SHIFT' : punchStatus.todayRecordedMinutes > 0 ? '✓ COMPLETED' : 'OFFLINE'}
                  </div>
                </div>

                {/* Today's Punch Sessions Strip */}
                {punchStatus.todaySessions.length > 0 && (
                  <div className="nz-today-sessions-deck">
                    <span className="nz-sessions-deck-title">TODAY'S RECORDED SESSIONS:</span>
                    <div className="nz-sessions-chips-wrap">
                      {punchStatus.todaySessions.map((s) => (
                        <span key={s.sessionIndex} className={`nz-session-chip ${s.isCompleted ? 'is-done' : 'is-active'}`}>
                          #{s.sessionIndex}: {s.inTime} → {s.outTime || 'Active'} ({s.isCompleted ? formatMinutesToHours(s.durationMinutes) : 'In Progress'})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Row */}
                <div className="nz-punch-stats-deck">
                  <div className="nz-stat-item">
                    <span className="nz-stat-item-label">FIRST IN</span>
                    <span className="nz-stat-item-val">{punchStatus.checkInTime || '--:--:--'}</span>
                  </div>
                  <div className="nz-stat-item">
                    <span className="nz-stat-item-label">LATEST OUT</span>
                    <span className="nz-stat-item-val">{punchStatus.checkOutTime || '--:--:--'}</span>
                  </div>
                  <div className="nz-stat-item">
                    <span className="nz-stat-item-label">TOTAL WORKED</span>
                    <span className="nz-stat-item-val nz-accent-val">
                      {formatMinutesToHours(punchStatus.todayRecordedMinutes)}
                    </span>
                  </div>
                </div>

                {/* Controls */}
                <div className="nz-punch-form-wrap">
                  <div className="nz-form-grid-2">
                    <div className="nz-form-group">
                      <label className="nz-form-label">Working Mode</label>
                      <select
                        className="nz-form-input nz-form-select"
                        value={workMode}
                        onChange={(e) => setWorkMode(e.target.value)}
                        disabled={punchLoading}
                      >
                        <option value="OFFICE">🏢 Campus Office (Kollam)</option>
                        <option value="REMOTE">💻 Work From Home (Remote)</option>
                        <option value="CLIENT_LOCATION">📍 Field / Client Location</option>
                      </select>
                    </div>

                    <div className="nz-form-group">
                      <label className="nz-form-label">Session Remarks</label>
                      <input
                        type="text"
                        className="nz-form-input"
                        placeholder="e.g. Morning lab training / Post-lunch session"
                        value={punchRemarks}
                        onChange={(e) => setPunchRemarks(e.target.value)}
                        disabled={punchLoading}
                      />
                    </div>
                  </div>

                  <div className="nz-punch-buttons-deck">
                    <button
                      type="button"
                      className="nz-punch-action-btn is-punch-in"
                      onClick={handleCheckIn}
                      disabled={punchLoading || punchStatus.isPunchedIn}
                    >
                      {punchLoading && !punchStatus.isPunchedIn
                        ? 'SAVING PUNCH...'
                        : punchStatus.todayRecordedMinutes > 0
                        ? 'PUNCH IN AGAIN (NEW SESSION) →'
                        : 'PUNCH IN (START SHIFT) →'}
                    </button>

                    <button
                      type="button"
                      className="nz-punch-action-btn is-punch-out"
                      onClick={handleCheckOut}
                      disabled={punchLoading || !punchStatus.isPunchedIn}
                    >
                      {punchLoading && punchStatus.isPunchedIn ? 'CALCULATING & SAVING...' : 'PUNCH OUT (END SESSION) →'}
                    </button>
                  </div>

                  {punchStatus.lastAction && (
                    <div className="nz-last-punch-notice">
                      ✓ {punchStatus.lastAction}
                    </div>
                  )}
                </div>
              </section>

              {/* Policy & Monthly Performance Summary */}
              <section className="nz-dash-card nz-policy-deck-card">
                <div className="nz-card-top-bar">
                  <div>
                    <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>MONTHLY PERFORMANCE</span>
                    <h2 className="nz-card-heading">CALCULATED METRICS ({attendanceMonth})</h2>
                  </div>
                </div>

                <div className="nz-pillar-cards-stack">
                  <div className="nz-mini-pillar-card">
                    <div className="nz-mini-pillar-top">
                      <span className="nz-mini-pillar-num">{monthlyMetrics.presentDays} DAYS</span>
                      <span className="nz-tag-badge is-emerald">PRESENT DAYS</span>
                    </div>
                    <div className="nz-mini-pillar-title">Total Working Hours: {monthlyMetrics.totalWorkedHours} hrs</div>
                    <div className="nz-mini-pillar-desc">
                      Credited duty hours: {monthlyMetrics.totalCreditedHours} hrs across {monthlyMetrics.recordCount} ledger days.
                    </div>
                  </div>

                  <div className="nz-mini-pillar-card">
                    <div className="nz-mini-pillar-top">
                      <span className="nz-mini-pillar-num">{monthlyMetrics.totalPermissionMinutes} / 240m</span>
                      <span className="nz-tag-badge is-dark">PERMISSION QUOTA</span>
                    </div>
                    <div className="nz-mini-pillar-title">Grace & Permission Usage</div>
                    <div className="nz-mini-pillar-desc">
                      {Math.max(0, 240 - monthlyMetrics.totalPermissionMinutes)} minutes remaining before automated half-day deduction.
                    </div>
                  </div>

                  <div className="nz-mini-pillar-card">
                    <div className="nz-mini-pillar-top">
                      <span className="nz-mini-pillar-num">{monthlyMetrics.halfDays + monthlyMetrics.absences}</span>
                      <span className="nz-tag-badge is-purple">LEAVES & ABSENCE</span>
                    </div>
                    <div className="nz-mini-pillar-title">{monthlyMetrics.halfDays} Half Days • {monthlyMetrics.absences} Absences</div>
                    <div className="nz-mini-pillar-desc">
                      Standard policy: General shift 09:00 AM - 05:30 PM (510 min).
                    </div>
                  </div>
                </div>

                <div className="nz-quick-triggers-section">
                  <div className="nz-quick-triggers-label">QUICK SHORTCUTS</div>
                  <div className="nz-quick-triggers-grid">
                    <button type="button" className="nz-quick-pill-btn" onClick={() => setActiveTab('leaves')}>
                      📝 Apply Leave
                    </button>
                    <button type="button" className="nz-quick-pill-btn" onClick={() => setActiveTab('outside')}>
                      🚗 Outside Work
                    </button>
                    <button type="button" className="nz-quick-pill-btn" onClick={() => setActiveTab('reports')}>
                      📊 View Reports
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* ── Monthly Timesheet & Working Hours Ledger Table ──────── */}
            <section className="nz-dash-card nz-timesheet-ledger-card">
              <div className="nz-card-top-bar">
                <div>
                  <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>POSTGRESQL ATTENDANCE LEDGER</span>
                  <h2 className="nz-card-heading">
                    DAILY PUNCH & BACKEND WORKING HOURS TIMESHEET
                  </h2>
                </div>

                <div className="nz-timesheet-filters-row">
                  {/* Staff Switcher for Super Admin, HR Admin, Manager */}
                  {(isSuperAdmin || isHR || isManager) && employees.length > 0 && (
                    <div className="nz-admin-staff-selector-wrap">
                      <span className="nz-selector-label">STAFF:</span>
                      <select
                        className="nz-form-input nz-emp-select"
                        value={selectedEmpId}
                        onChange={(e) => setSelectedEmpId(Number(e.target.value))}
                      >
                        {employees.map((emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.fullName} ({emp.employeeCode})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <input
                    type="month"
                    className="nz-form-input nz-month-picker"
                    value={attendanceMonth}
                    onChange={(e) => setAttendanceMonth(e.target.value)}
                  />

                  <button
                    type="button"
                    className="nz-table-refresh-btn"
                    onClick={() => fetchDailyAttendance(selectedEmpId, attendanceMonth)}
                    title="Reload ledger from Database"
                  >
                    🔄 Sync DB
                  </button>
                </div>
              </div>

              {loadingDailyRecords ? (
                <div className="nz-table-state-box">Loading attendance and working hours ledger from database...</div>
              ) : dailyRecords.length > 0 ? (
                <div className="nz-editorial-table-wrapper">
                  <table className="nz-editorial-table">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>DAY TYPE</th>
                        <th>FIRST IN</th>
                        <th>LAST OUT</th>
                        <th>BACKEND WORKED TIME</th>
                        <th>PUNCH SESSIONS</th>
                        <th>LATE / PERM</th>
                        <th>CALCULATED STATUS</th>
                        <th>REMARKS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyRecords.map((rec) => {
                        const isToday = rec.workDate === new Date().toISOString().split('T')[0];
                        const workedDisplay =
                          rec.recordedMinutes > 0
                            ? `${formatMinutesToHours(rec.recordedMinutes)} (${(rec.recordedMinutes / 60).toFixed(1)} hrs)`
                            : isToday && rec.isPunchedIn
                            ? `${calculateLiveDuration(rec.inTime, currentTime)} (Live)`
                            : '--';

                        const sessionCount = rec.sessions?.length || 0;

                        return (
                          <tr key={rec.id || rec.workDate} className={isToday ? 'nz-today-row' : ''}>
                            <td className="nz-table-code">
                              {rec.workDate}{' '}
                              <span className="nz-date-day-tag">
                                {new Date(rec.workDate).toLocaleString('default', { weekday: 'short' })}
                              </span>
                              {isToday && <span className="nz-today-pill">TODAY</span>}
                            </td>
                            <td>
                              <span className={`nz-tag-badge ${rec.dayType === 'WORK_DAY' ? 'is-emerald' : rec.dayType === 'COMPANY_HOLIDAY' ? 'is-purple' : 'is-dark'}`}>
                                {rec.dayType?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="nz-time-cell">
                              {rec.inTime ? (
                                <span className="nz-in-badge">
                                  <span className="nz-punch-in-dot" /> {rec.inTime}
                                </span>
                              ) : (
                                '--'
                              )}
                            </td>
                            <td className="nz-time-cell">
                              {rec.outTime ? (
                                <span className="nz-out-badge">
                                  <span className="nz-punch-out-dot" /> {rec.outTime}
                                </span>
                              ) : (
                                '--'
                              )}
                            </td>
                            <td className="nz-worked-hours-cell">
                              <strong>{workedDisplay}</strong>
                            </td>
                            <td>
                              {sessionCount > 0 ? (
                                <button
                                  type="button"
                                  className="nz-session-view-btn"
                                  onClick={() => setSelectedRecordForSessions(rec)}
                                >
                                  {sessionCount} Session{sessionCount > 1 ? 's' : ''} 🔍
                                </button>
                              ) : (
                                <span className="nz-no-session-text">--</span>
                              )}
                            </td>
                            <td>
                              {rec.permissionMinutes && rec.permissionMinutes > 0 ? (
                                <span className="nz-perm-used-tag">{rec.permissionMinutes} min</span>
                              ) : (
                                '0 min'
                              )}
                            </td>
                            <td>
                              <span
                                className={`nz-tag-badge ${
                                  rec.calculatedStatus === 'PRESENT'
                                    ? 'is-emerald'
                                    : rec.calculatedStatus === 'HALF_DAY_LEAVE'
                                    ? 'is-amber'
                                    : rec.calculatedStatus === 'ABSENT'
                                    ? 'is-red'
                                    : rec.calculatedStatus === 'COMPANY_HOLIDAY'
                                    ? 'is-purple'
                                    : 'is-dark'
                                }`}
                              >
                                {rec.calculatedStatus?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="nz-remarks-cell">{rec.remarks || '--'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="nz-table-state-box">
                  No attendance records found for {attendanceMonth}. Punch in or create records to populate ledger.
                </div>
              )}
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: LEAVE MANAGEMENT DECK
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'leaves' && (
          <div className="nz-dash-deck-grid">
            {/* Submit Leave Application */}
            <section className="nz-dash-card">
              <div className="nz-card-top-bar">
                <div>
                  <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>TIME-OFF REQUEST</span>
                  <h2 className="nz-card-heading">SUBMIT LEAVE APPLICATION</h2>
                </div>
              </div>

              <form onSubmit={handleSubmitLeave} className="nz-editorial-form">
                <div className="nz-form-group">
                  <label className="nz-form-label">Leave Type</label>
                  <select
                    className="nz-form-input nz-form-select"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                  >
                    <option value="CASUAL_LEAVE">Casual Leave (CL)</option>
                    <option value="SICK_LEAVE">Sick Leave (SL)</option>
                    <option value="EARNED_LEAVE">Earned Leave (EL)</option>
                    <option value="HALF_DAY">Half Day Leave</option>
                    <option value="COMPENSATORY_OFF">Compensatory Off (Comp-Off)</option>
                    <option value="LOSS_OF_PAY">Loss of Pay (LOP)</option>
                  </select>
                </div>

                <div className="nz-form-grid-2">
                  <div className="nz-form-group">
                    <label className="nz-form-label">From Date</label>
                    <input
                      type="date"
                      className="nz-form-input"
                      value={leaveFromDate}
                      onChange={(e) => setLeaveFromDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="nz-form-group">
                    <label className="nz-form-label">To Date</label>
                    <input
                      type="date"
                      className="nz-form-input"
                      value={leaveToDate}
                      onChange={(e) => setLeaveToDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="nz-form-group">
                  <label className="nz-checkbox-label">
                    <input
                      type="checkbox"
                      checked={leaveIsHalfDay}
                      onChange={(e) => setLeaveIsHalfDay(e.target.checked)}
                    />
                    <span>Is this a Half-Day Leave?</span>
                  </label>
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Reason / Justification</label>
                  <textarea
                    className="nz-form-input nz-form-textarea"
                    rows="3"
                    placeholder="Provide context for manager approval..."
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="nz-editorial-submit-btn"
                  disabled={submittingLeave}
                >
                  {submittingLeave ? 'SAVING TO DATABASE...' : 'SUBMIT LEAVE REQUEST →'}
                </button>
              </form>
            </section>

            {/* Pending Approvals Queue for Managers / HR */}
            <section className="nz-dash-card">
              <div className="nz-card-top-bar">
                <div>
                  <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>MANAGEMENT QUEUE</span>
                  <h2 className="nz-card-heading">PENDING LEAVE APPROVALS</h2>
                </div>
                <button type="button" className="nz-table-refresh-btn" onClick={fetchPendingLeaves} title="Reload">
                  🔄
                </button>
              </div>

              {loadingLeaves ? (
                <div className="nz-table-state-box">Loading pending leave applications...</div>
              ) : pendingLeaves.length > 0 ? (
                <div className="nz-approvals-stack">
                  {pendingLeaves.map((req) => (
                    <div key={req.id} className="nz-approval-item-card">
                      <div className="nz-approval-header">
                        <div className="nz-approval-applicant">
                          <span className="nz-table-avatar-badge">{(req.employeeName || 'E').charAt(0)}</span>
                          <div>
                            <div className="nz-applicant-name">{req.employeeName || `Employee #${req.employeeId}`}</div>
                            <div className="nz-applicant-meta">{req.employeeCode || 'EMP'} • {req.leaveType}</div>
                          </div>
                        </div>
                        <span className="nz-tag-badge is-dark">{req.durationDays || 1} DAY(S)</span>
                      </div>

                      <div className="nz-approval-details">
                        <strong>Period:</strong> {req.fromDate} to {req.toDate}
                        <br />
                        <strong>Reason:</strong> {req.reason || 'No reason provided'}
                      </div>

                      {(isSuperAdmin || isHR || isManager) && (
                        <div className="nz-approval-actions-row">
                          <button
                            type="button"
                            className="nz-action-pill-btn is-approve"
                            onClick={() => handleApproveLeave(req.id, 'APPROVED')}
                          >
                            ✓ APPROVE
                          </button>
                          <button
                            type="button"
                            className="nz-action-pill-btn is-reject"
                            onClick={() => handleApproveLeave(req.id, 'REJECTED')}
                          >
                            ✕ REJECT
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="nz-empty-queue-box">
                  <div className="nz-empty-symbol">✓</div>
                  <div className="nz-empty-title">All Caught Up!</div>
                  <p className="nz-empty-desc">No pending leave requests requiring manager review.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: OUTSIDE WORK / ON-DUTY DECK
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'outside' && (
          <div className="nz-dash-deck-grid">
            {/* Submit Outside Work Form */}
            <section className="nz-dash-card">
              <div className="nz-card-top-bar">
                <div>
                  <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>FIELD & CLIENT ASSIGNMENT</span>
                  <h2 className="nz-card-heading">SUBMIT OUTSIDE WORK</h2>
                </div>
              </div>

              <form onSubmit={handleSubmitOutsideWork} className="nz-editorial-form">
                <div className="nz-form-group">
                  <label className="nz-form-label">Work Date</label>
                  <input
                    type="date"
                    className="nz-form-input"
                    value={owDate}
                    onChange={(e) => setOwDate(e.target.value)}
                    required
                  />
                </div>

                <div className="nz-form-grid-2">
                  <div className="nz-form-group">
                    <label className="nz-form-label">Start Time</label>
                    <input
                      type="time"
                      step="1"
                      className="nz-form-input"
                      value={owStartTime}
                      onChange={(e) => setOwStartTime(e.target.value)}
                      required
                    />
                  </div>

                  <div className="nz-form-group">
                    <label className="nz-form-label">End Time</label>
                    <input
                      type="time"
                      step="1"
                      className="nz-form-input"
                      value={owEndTime}
                      onChange={(e) => setOwEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Destination / Purpose</label>
                  <textarea
                    className="nz-form-input nz-form-textarea"
                    rows="3"
                    placeholder="e.g. Client onsite technical training at Technopark, Trivandrum..."
                    value={owPurpose}
                    onChange={(e) => setOwPurpose(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="nz-editorial-submit-btn"
                  disabled={submittingOw}
                >
                  {submittingOw ? 'SAVING TO DATABASE...' : 'SUBMIT OUTSIDE WORK DUTY →'}
                </button>
              </form>
            </section>

            {/* Pending Outside Work Approvals */}
            <section className="nz-dash-card">
              <div className="nz-card-top-bar">
                <div>
                  <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>MANAGEMENT QUEUE</span>
                  <h2 className="nz-card-heading">OUTSIDE WORK APPROVALS</h2>
                </div>
                <button type="button" className="nz-table-refresh-btn" onClick={fetchPendingOw} title="Reload">
                  🔄
                </button>
              </div>

              {loadingOw ? (
                <div className="nz-table-state-box">Loading pending outside assignments...</div>
              ) : pendingOw.length > 0 ? (
                <div className="nz-approvals-stack">
                  {pendingOw.map((req) => (
                    <div key={req.id} className="nz-approval-item-card">
                      <div className="nz-approval-header">
                        <div className="nz-approval-applicant">
                          <span className="nz-table-avatar-badge">{(req.employeeName || 'E').charAt(0)}</span>
                          <div>
                            <div className="nz-applicant-name">{req.employeeName || `Employee #${req.employeeId}`}</div>
                            <div className="nz-applicant-meta">{req.employeeCode || 'EMP'} • {req.workDate}</div>
                          </div>
                        </div>
                        <span className="nz-tag-badge is-emerald">{req.creditedMinutes || 0} MIN</span>
                      </div>

                      <div className="nz-approval-details">
                        <strong>Time:</strong> {req.startTime} to {req.endTime}
                        <br />
                        <strong>Purpose:</strong> {req.purpose || 'Official assignment'}
                      </div>

                      {(isSuperAdmin || isHR || isManager) && (
                        <div className="nz-approval-actions-row">
                          <button
                            type="button"
                            className="nz-action-pill-btn is-approve"
                            onClick={() => handleApproveOw(req.id, 'APPROVED')}
                          >
                            ✓ APPROVE DUTY
                          </button>
                          <button
                            type="button"
                            className="nz-action-pill-btn is-reject"
                            onClick={() => handleApproveOw(req.id, 'REJECTED')}
                          >
                            ✕ REJECT
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="nz-empty-queue-box">
                  <div className="nz-empty-symbol">✓</div>
                  <div className="nz-empty-title">Queue Clear</div>
                  <p className="nz-empty-desc">No outside work or on-duty requests waiting for review.</p>
                </div>
              )}
            </section>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: STAFF DIRECTORY & ONBOARDING DECK
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'employees' && (
          <section className="nz-dash-card nz-directory-deck-card">
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>ENTERPRISE ROSTER</span>
                <h2 className="nz-card-heading">STAFF & EMPLOYEE DIRECTORY</h2>
              </div>
              <div className="nz-directory-search-box">
                <input
                  type="text"
                  className="nz-form-input nz-table-search-input"
                  placeholder="Search by name, code, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {(isSuperAdmin || isHR) && (
                  <button
                    type="button"
                    className="nz-editorial-small-btn is-primary"
                    onClick={() => setShowAddEmpModal(true)}
                  >
                    + ADD EMPLOYEE
                  </button>
                )}
                <button
                  type="button"
                  className="nz-table-refresh-btn"
                  onClick={fetchEmployees}
                  title="Reload from Spring Boot"
                >
                  🔄
                </button>
              </div>
            </div>

            {loadingEmployees ? (
              <div className="nz-table-state-box">Loading active records from database...</div>
            ) : filteredEmployees.length > 0 ? (
              <div className="nz-editorial-table-wrapper">
                <table className="nz-editorial-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>EMPLOYEE NAME</th>
                      <th>OFFICIAL EMAIL</th>
                      <th>PHONE</th>
                      <th>DEPARTMENT / CAMPUS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id || emp.employeeCode}>
                        <td className="nz-table-code">{emp.employeeCode || `EMP-${emp.id}`}</td>
                        <td className="nz-table-name">
                          <span className="nz-table-avatar-badge">
                            {(emp.fullName || 'E').charAt(0)}
                          </span>
                          <span>{emp.fullName}</span>
                        </td>
                        <td>{emp.email}</td>
                        <td>{emp.phone || '+91 80890 30405'}</td>
                        <td>{emp.departmentName || 'Software Engineering'} ({emp.branchName || 'Kollam'})</td>
                        <td>
                          <span className="nz-tag-badge is-emerald">
                            {emp.status || 'ACTIVE'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="nz-table-state-box">No employee records found matching your query.</div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: REPORTS & PAYROLL DECK
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'reports' && (
          <section className="nz-dash-card">
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>AUDIT & PAYROLL RECONCILIATION</span>
                <h2 className="nz-card-heading">MONTHLY ATTENDANCE SUMMARIES</h2>
              </div>
              <div className="nz-reports-controls">
                <input
                  type="month"
                  className="nz-form-input nz-month-picker"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    fetchReports(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="nz-editorial-small-btn is-emerald"
                  onClick={handleDownloadExcel}
                  disabled={exportingExcel}
                >
                  {exportingExcel ? 'EXPORTING...' : '📥 EXPORT EXCEL (.XLSX)'}
                </button>
                {(isSuperAdmin || isHR) && (
                  <button
                    type="button"
                    className="nz-editorial-small-btn is-primary"
                    onClick={handleFinalizeMonth}
                    disabled={finalizingMonth}
                  >
                    {finalizingMonth ? 'LOCKING...' : '🔒 FINALIZE MONTH'}
                  </button>
                )}
              </div>
            </div>

            {loadingReports ? (
              <div className="nz-table-state-box">Loading monthly payroll records from DB...</div>
            ) : monthlySummaries.length > 0 ? (
              <div className="nz-editorial-table-wrapper">
                <table className="nz-editorial-table">
                  <thead>
                    <tr>
                      <th>CODE</th>
                      <th>EMPLOYEE</th>
                      <th>PAYABLE DAYS</th>
                      <th>CREDITED HRS</th>
                      <th>PERMISSION HRS</th>
                      <th>FULL LEAVES</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySummaries.map((sum) => (
                      <tr key={sum.id || sum.employeeId}>
                        <td className="nz-table-code">{sum.employeeCode}</td>
                        <td className="nz-table-name">{sum.employeeName}</td>
                        <td><strong>{sum.payableDays ?? '--'}</strong> / {sum.requiredWorkingDays ?? 22}</td>
                        <td>{sum.creditedHours ?? (sum.creditedMinutes ? (sum.creditedMinutes / 60).toFixed(1) : 0)} hrs</td>
                        <td>{sum.permissionHours ?? (sum.permissionMinutes ? (sum.permissionMinutes / 60).toFixed(1) : 0)} hrs</td>
                        <td>{sum.fullLeaveDays ?? 0}</td>
                        <td>
                          <span className={`nz-tag-badge ${sum.status === 'FINALIZED' ? 'is-purple' : 'is-emerald'}`}>
                            {sum.status || 'CALCULATED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="nz-table-state-box">
                No monthly attendance calculations found for {selectedMonth}. Punches recorded during this period will automatically populate here.
              </div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 6: HOLIDAY CALENDAR DECK
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'holidays' && (
          <section className="nz-dash-card">
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>CAMPUS SCHEDULE</span>
                <h2 className="nz-card-heading">COMPANY & PUBLIC HOLIDAYS (2026)</h2>
              </div>
              {(isSuperAdmin || isHR) && (
                <button
                  type="button"
                  className="nz-editorial-small-btn is-primary"
                  onClick={() => setShowAddHolidayModal(true)}
                >
                  + ADD HOLIDAY
                </button>
              )}
            </div>

            {loadingHolidays ? (
              <div className="nz-table-state-box">Loading holiday calendar...</div>
            ) : holidays.length > 0 ? (
              <div className="nz-holidays-grid">
                {holidays.map((h) => (
                  <div key={h.id} className="nz-holiday-card">
                    <div className="nz-holiday-date-block">
                      <span className="nz-holiday-day">{new Date(h.holidayDate).getDate()}</span>
                      <span className="nz-holiday-month">
                        {new Date(h.holidayDate).toLocaleString('default', { month: 'short' }).toUpperCase()}
                      </span>
                    </div>
                    <div className="nz-holiday-info">
                      <div className="nz-holiday-title">{h.name}</div>
                      <div className="nz-holiday-date-full">
                        {new Date(h.holidayDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <span className={`nz-tag-badge ${h.holidayType === 'NATIONAL' ? 'is-purple' : h.holidayType === 'REGIONAL' ? 'is-emerald' : 'is-dark'}`}>
                      {h.holidayType}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="nz-table-state-box">No holidays configured for the current calendar year.</div>
            )}
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 7: AUDIT LOGS DECK (Super Admin & HR)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === 'audit' && (isSuperAdmin || isHR) && (
          <section className="nz-dash-card">
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow" style={{ marginBottom: '0.2rem' }}>IMMUTABLE SECURITY TRAIL</span>
                <h2 className="nz-card-heading">SYSTEM & PAYROLL AUDIT LOGS</h2>
              </div>
              <button type="button" className="nz-table-refresh-btn" onClick={fetchAuditLogs} title="Reload">
                🔄
              </button>
            </div>

            {loadingAudit ? (
              <div className="nz-table-state-box">Loading immutable audit logs...</div>
            ) : auditLogs.length > 0 ? (
              <div className="nz-editorial-table-wrapper">
                <table className="nz-editorial-table">
                  <thead>
                    <tr>
                      <th>TIMESTAMP</th>
                      <th>ACTION</th>
                      <th>PERFORMED BY</th>
                      <th>ENTITY TYPE</th>
                      <th>DESCRIPTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="nz-mono-cell">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString() : '--'}
                        </td>
                        <td>
                          <span className="nz-tag-badge is-dark">{log.action}</span>
                        </td>
                        <td><strong>{log.performedByName || `User #${log.performedByUserId || '1'}`}</strong></td>
                        <td>{log.entityName || 'ATTENDANCE'}</td>
                        <td>{log.description || log.newValue || 'Action recorded successfully'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="nz-table-state-box">No administrative audit events recorded yet.</div>
            )}
          </section>
        )}
      </main>

      {/* ── MODAL: Detailed Punch Sessions Breakdown ─────────────── */}
      {selectedRecordForSessions && (
        <div className="nz-editorial-modal-backdrop" onClick={() => setSelectedRecordForSessions(null)}>
          <div className="nz-editorial-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow">PUNCH SESSIONS AUDIT</span>
                <h2 className="nz-card-heading">{selectedRecordForSessions.workDate} TIMELOG</h2>
              </div>
              <button
                type="button"
                className="nz-modal-close-btn"
                onClick={() => setSelectedRecordForSessions(null)}
              >
                ✕
              </button>
            </div>

            <div className="nz-session-modal-summary">
              <div className="nz-session-summary-item">
                <span className="nz-meta-pill-label">EMPLOYEE</span>
                <span className="nz-meta-pill-val">{selectedRecordForSessions.employeeName || `Employee #${selectedRecordForSessions.employeeId}`}</span>
              </div>
              <div className="nz-session-summary-item">
                <span className="nz-meta-pill-label">BACKEND WORKED TIME</span>
                <span className="nz-meta-pill-val nz-accent-val">
                  {formatMinutesToHours(selectedRecordForSessions.recordedMinutes)} ({selectedRecordForSessions.workedHours ?? (selectedRecordForSessions.recordedMinutes / 60).toFixed(1)} hrs)
                </span>
              </div>
              <div className="nz-session-summary-item">
                <span className="nz-meta-pill-label">STATUS</span>
                <span className="nz-meta-pill-val">{selectedRecordForSessions.calculatedStatus}</span>
              </div>
            </div>

            <div className="nz-sessions-timeline-list">
              {selectedRecordForSessions.sessions && selectedRecordForSessions.sessions.length > 0 ? (
                selectedRecordForSessions.sessions.map((s) => (
                  <div key={s.sessionIndex} className="nz-session-timeline-card">
                    <div className="nz-session-card-header">
                      <span className="nz-session-num-badge">SESSION #{s.sessionIndex}</span>
                      <span className="nz-tag-badge is-emerald">
                        {s.isCompleted ? formatMinutesToHours(s.durationMinutes) : 'In Progress'}
                      </span>
                    </div>
                    <div className="nz-session-card-body">
                      <div className="nz-session-time-row">
                        <span>🟢 <strong>Punch In:</strong> {s.inTime || '--'}</span>
                        <span>🔴 <strong>Punch Out:</strong> {s.outTime || 'Currently Active'}</span>
                      </div>
                      <div className="nz-session-meta-row">
                        <span>🏢 <strong>Mode:</strong> {s.workingMode || 'OFFICE'}</span>
                        {s.remarks && <span>💬 <strong>Notes:</strong> {s.remarks}</span>}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="nz-table-state-box">No individual punch session events logged for this date.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: Add New Employee Profile ───────────────────────── */}
      {showAddEmpModal && (
        <div className="nz-editorial-modal-backdrop" onClick={() => setShowAddEmpModal(false)}>
          <div className="nz-editorial-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow">HR ONBOARDING</span>
                <h2 className="nz-card-heading">NEW EMPLOYEE PROFILE</h2>
              </div>
              <button
                type="button"
                className="nz-modal-close-btn"
                onClick={() => setShowAddEmpModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="nz-editorial-form">
              <div className="nz-form-grid-2">
                <div className="nz-form-group">
                  <label className="nz-form-label">Employee Code</label>
                  <input
                    type="text"
                    className="nz-form-input"
                    placeholder="EMP1003"
                    value={newEmpCode}
                    onChange={(e) => setNewEmpCode(e.target.value)}
                    required
                  />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Full Name</label>
                  <input
                    type="text"
                    className="nz-form-input"
                    placeholder="e.g. Vignesh Kumar"
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="nz-form-grid-2">
                <div className="nz-form-group">
                  <label className="nz-form-label">Official Email</label>
                  <input
                    type="email"
                    className="nz-form-input"
                    placeholder="vignesh@networkz.com"
                    value={newEmpEmail}
                    onChange={(e) => setNewEmpEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Contact Phone</label>
                  <input
                    type="text"
                    className="nz-form-input"
                    placeholder="+91 80890 30405"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="nz-form-grid-2">
                <div className="nz-form-group">
                  <label className="nz-form-label">Department</label>
                  <select
                    className="nz-form-input nz-form-select"
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                  >
                    <option value="1">Software Engineering</option>
                    <option value="2">Human Resources</option>
                    <option value="3">Sales & Marketing</option>
                    <option value="4">Finance & Accounts</option>
                  </select>
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Campus Branch</label>
                  <select
                    className="nz-form-input nz-form-select"
                    value={newEmpBranch}
                    onChange={(e) => setNewEmpBranch(e.target.value)}
                  >
                    <option value="1">Kollam Main Campus</option>
                    <option value="2">Trivandrum Tech Hub</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="nz-editorial-submit-btn"
                disabled={submittingEmp}
              >
                {submittingEmp ? 'CREATING EMPLOYEE...' : 'SAVE EMPLOYEE PROFILE →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Add Company Holiday ────────────────────────────── */}
      {showAddHolidayModal && (
        <div className="nz-editorial-modal-backdrop" onClick={() => setShowAddHolidayModal(false)}>
          <div className="nz-editorial-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="nz-card-top-bar">
              <div>
                <span className="nz-eyebrow">CAMPUS SCHEDULE</span>
                <h2 className="nz-card-heading">ADD COMPANY HOLIDAY</h2>
              </div>
              <button
                type="button"
                className="nz-modal-close-btn"
                onClick={() => setShowAddHolidayModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHoliday} className="nz-editorial-form">
              <div className="nz-form-group">
                <label className="nz-form-label">Holiday Name</label>
                <input
                  type="text"
                  className="nz-form-input"
                  placeholder="e.g. Diwali Festival"
                  value={newHolidayName}
                  onChange={(e) => setNewHolidayName(e.target.value)}
                  required
                />
              </div>

              <div className="nz-form-grid-2">
                <div className="nz-form-group">
                  <label className="nz-form-label">Holiday Date</label>
                  <input
                    type="date"
                    className="nz-form-input"
                    value={newHolidayDate}
                    onChange={(e) => setNewHolidayDate(e.target.value)}
                    required
                  />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label">Category</label>
                  <select
                    className="nz-form-input nz-form-select"
                    value={newHolidayType}
                    onChange={(e) => setNewHolidayType(e.target.value)}
                  >
                    <option value="PUBLIC">Public Holiday</option>
                    <option value="NATIONAL">National Holiday</option>
                    <option value="REGIONAL">Regional / State Holiday</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="nz-editorial-submit-btn"
                disabled={submittingHoliday}
              >
                {submittingHoliday ? 'SAVING HOLIDAY...' : 'ADD TO CAMPUS CALENDAR →'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
