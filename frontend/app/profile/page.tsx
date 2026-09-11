"use client";

import React, { useState, useEffect } from "react";
import { StatutoryHeader } from "@/components/layout/StatutoryHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import {
  User, Building2, Mail, Phone, Shield, ShieldCheck, ShieldAlert,
  CheckCircle2, AlertCircle, RefreshCw, ExternalLink, ArrowRight,
  FileCheck, Check, X, Building, Award, Info, Lock, ChevronRight,
  Sparkles, CheckCheck
} from "lucide-react";

interface UserProfileData {
  user: {
    id: string;
    full_name: string;
    email: string;
    mobile: string;
    role: string;
    account_type: string;
    organization?: string;
    email_verified: boolean;
    mobile_verified: boolean;
    is_account_verified: boolean;
    created_at: string;
  };
  business_profile: {
    id: string | null;
    business_name: string;
    business_type: string;
    gstin: string;
    udyam_number: string;
    pan: string;
    factory_address: string;
    state: string;
    district: string;
    contact_number: string;
    has_details_submitted: boolean;
  } | null;
  verification_summary: {
    account_level: string;
    business_level: string;
    business_status_badge: {
      status: string;
      label: string;
      color: string;
    };
    gstin_verified: boolean;
    udyam_verified: boolean;
    bis_license_count: number;
    has_operative_bis_license: boolean;
  };
  verification_records: Array<{
    id: string;
    verification_type: string;
    status: string;
    source: string;
    reference_number: string;
    verified_at: string;
    failure_reason: string | null;
  }>;
  bis_licenses: Array<{
    id: string;
    cm_l_number: string;
    standard_number: string;
    firm_name: string;
    status: string;
    validity_date: string;
    verification_status: string;
    last_checked: string;
  }>;
  statutory_notice: {
    title: string;
    message: string;
    official_portal_url: string;
  };
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "business" | "bis" | "audit">("overview");

  // OTP Verification Modal State
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpType, setOtpType] = useState<"EMAIL" | "MOBILE">("EMAIL");
  const [otpTarget, setOtpTarget] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [sandboxOtp, setSandboxOtp] = useState("");
  const [otpStatusMsg, setOtpStatusMsg] = useState("");

  // Create Account Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [regForm, setRegForm] = useState({
    full_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    account_type: "MANUFACTURER",
    organization: ""
  });
  const [regError, setRegError] = useState("");

  // Business Profile Form State
  const [bizForm, setBizForm] = useState({
    business_name: "",
    business_type: "MSME Manufacturer",
    gstin: "",
    udyam_number: "",
    pan: "",
    factory_address: "",
    state: "",
    district: "",
    contact_number: ""
  });
  const [bizSaveSuccess, setBizSaveSuccess] = useState(false);

  // BIS License Lookup Form State
  const [bisCmlInput, setBisCmlInput] = useState("");
  const [bisLookupResult, setBisLookupResult] = useState<any>(null);

  // Status Notification
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 5000);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/me");
      if (res.ok) {
        const data: UserProfileData = await res.json();
        setProfileData(data);
        if (data.business_profile) {
          setBizForm({
            business_name: data.business_profile.business_name || "",
            business_type: data.business_profile.business_type || "MSME Manufacturer",
            gstin: data.business_profile.gstin || "",
            udyam_number: data.business_profile.udyam_number || "",
            pan: data.business_profile.pan || "",
            factory_address: data.business_profile.factory_address || "",
            state: data.business_profile.state || "",
            district: data.business_profile.district || "",
            contact_number: data.business_profile.contact_number || ""
          });
        }
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      showToast("Backend connection offline. Using cached state.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSwitchUser = async (mode: "demo" | "fresh") => {
    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/switch-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        if (data.profile.business_profile) {
          setBizForm({
            business_name: data.profile.business_profile.business_name || "",
            business_type: data.profile.business_profile.business_type || "MSME Manufacturer",
            gstin: data.profile.business_profile.gstin || "",
            udyam_number: data.profile.business_profile.udyam_number || "",
            pan: data.profile.business_profile.pan || "",
            factory_address: data.profile.business_profile.factory_address || "",
            state: data.profile.business_profile.state || "",
            district: data.profile.business_profile.district || "",
            contact_number: data.profile.business_profile.contact_number || ""
          });
        } else {
          setBizForm({
            business_name: "",
            business_type: "MSME Manufacturer",
            gstin: "",
            udyam_number: "",
            pan: "",
            factory_address: "",
            state: "",
            district: "",
            contact_number: ""
          });
        }
        setBisLookupResult(null);
        showToast(
          mode === "demo"
            ? "Switched to Seed Demo Profile: Rajesh Sharma (Verified MSME)"
            : "Switched to Fresh Test Applicant: Unverified Onboarding State",
          "info"
        );
      }
    } catch (e) {
      showToast("Error switching profile mode", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetTestUser = async () => {
    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/reset-test-user", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        setBizForm({
          business_name: "",
          business_type: "MSME Manufacturer",
          gstin: "",
          udyam_number: "",
          pan: "",
          factory_address: "",
          state: "",
          district: "",
          contact_number: ""
        });
        setBisLookupResult(null);
        showToast("Fresh applicant reset to zero verification. Ready for new user demo!", "success");
      }
    } catch (e) {
      showToast("Error resetting test applicant", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const triggerOtpModal = async (type: "EMAIL" | "MOBILE") => {
    if (!profileData) return;
    const target = type === "EMAIL" ? profileData.user.email : (profileData.user.mobile || "+91 98450 12345");
    setOtpType(type);
    setOtpTarget(target);
    setOtpCode("");
    setOtpStatusMsg("");
    setOtpModalOpen(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profileData.user.id,
          type,
          target
        })
      });
      const data = await res.json();
      if (data.success) {
        setSandboxOtp(data.otp_sandbox_code);
        setOtpStatusMsg(data.message);
      }
    } catch (e) {
      setOtpStatusMsg("Failed to dispatch OTP gateway request.");
    }
  };

  const submitVerifyOtp = async () => {
    if (!profileData || !otpCode) return;
    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profileData.user.id,
          type: otpType,
          otp: otpCode
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        setOtpModalOpen(false);
        showToast(data.message, "success");
      } else {
        setOtpStatusMsg(data.detail || "Invalid code. Please try again.");
      }
    } catch (e) {
      setOtpStatusMsg("Verification failed. Please retry.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveBusiness = async () => {
    if (!profileData) return;
    if (!bizForm.business_name.trim()) {
      showToast("Company / Organization Name is required", "error");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profileData.user.id,
          ...bizForm
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        setBizSaveSuccess(true);
        setTimeout(() => setBizSaveSuccess(false), 3000);
        showToast("Business profile saved! Status: Verification Pending (Level 2)", "info");
      }
    } catch (e) {
      showToast("Error saving business profile", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyBusinessKYC = async (field: "GSTIN" | "UDYAM" | "ALL") => {
    if (!profileData) return;
    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/verify-business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profileData.user.id,
          verification_type: field,
          gstin: bizForm.gstin,
          udyam_number: bizForm.udyam_number
        })
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        showToast("✓ Statutory Government KYC Verified! Business status updated to Verified Business (Level 3)", "success");
      } else {
        showToast(data.message || "KYC check failed. Check format of GSTIN / Udyam.", "error");
      }
    } catch (e) {
      showToast("KYC verification request failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyBISLicense = async (cmlToTest?: string) => {
    if (!profileData) return;
    const targetCml = cmlToTest || bisCmlInput;
    if (!targetCml.trim()) {
      showToast("Please enter a CM/L or CRS number to verify", "error");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/verify-bis-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: profileData.user.id,
          cm_l_number: targetCml
        })
      });
      const data = await res.json();
      setBisLookupResult(data);
      if (data.profile) {
        setProfileData(data.profile);
      }
      if (data.match) {
        showToast(`✓ Registry Match: ${data.license.firm_name} (${data.license.standard_number})`, "success");
      } else {
        showToast("No active registry match found for this number in BIS CARE.", "error");
      }
    } catch (e) {
      showToast("BIS license lookup failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regForm.password !== regForm.confirm_password) {
      setRegError("Passwords do not match");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch("http://127.0.0.1:8000/api/profile/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (data.success) {
        setProfileData(data.profile);
        setCreateModalOpen(false);
        showToast("Account created! Now complete Level 1 OTP verification.", "success");
        setRegForm({
          full_name: "",
          email: "",
          mobile: "",
          password: "",
          confirm_password: "",
          account_type: "MANUFACTURER",
          organization: ""
        });
      } else {
        setRegError(data.detail || "Registration failed");
      }
    } catch (err: any) {
      setRegError(err.message || "Network error during registration");
    } finally {
      setActionLoading(false);
    }
  };

  const isDemoUser = profileData?.user?.id === "usr_demo_001";
  const user = profileData?.user;
  const bprof = profileData?.business_profile;
  const vsummary = profileData?.verification_summary;

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <StatutoryHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Toast Notification */}
          {toastMsg && (
            <div
              className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-medium border transition-all animate-in fade-in slide-in-from-top-4 ${
                toastMsg.type === "success"
                  ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/40"
                  : toastMsg.type === "error"
                  ? "bg-rose-950/90 text-rose-200 border-rose-500/40"
                  : "bg-navy-950/90 text-sky-200 border-sky-500/40"
              }`}
            >
              {toastMsg.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : toastMsg.type === "error" ? (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              ) : (
                <Info className="w-5 h-5 text-sky-400 shrink-0" />
              )}
              <span>{toastMsg.text}</span>
            </div>
          )}

          {/* Prototype Architecture Disclaimer Banner */}
          <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-navy-950 border-l-4 border-amber-500 rounded-xl p-4 md:p-5 shadow-sm text-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
                  SIH Prototype Architecture
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  Independent Verification Tiers (Account ≠ Business ≠ BIS)
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-4xl leading-relaxed">
                NexaStandards never creates false statutory authority. Account creation verifies user credentials (Level 1),
                enterprise identity requires external government KYC (Level 3), and BIS licence claims are matched against the public
                BIS CARE registry (Level 4). Official certification remains on Manakonline.
              </p>
            </div>

            {/* Switcher Controls for Judges */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleSwitchUser("demo")}
                disabled={actionLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isDemoUser
                    ? "bg-amber-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
                title="View Seed MSME Manufacturer Profile (Rajesh Sharma)"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Seed Demo MSME</span>
              </button>

              <button
                onClick={() => handleSwitchUser("fresh")}
                disabled={actionLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  !isDemoUser
                    ? "bg-sky-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
                title="Switch to unverified user to experience onboarding step-by-step"
              >
                <User className="w-3.5 h-3.5" />
                <span>Fresh Test Applicant</span>
              </button>

              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center space-x-1"
              >
                <span>+ Create Account</span>
              </button>

              {!isDemoUser && (
                <button
                  onClick={handleResetTestUser}
                  disabled={actionLoading}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center space-x-1"
                  title="Reset test applicant back to 0% unverified state"
                >
                  <RefreshCw className={`w-3 h-3 ${actionLoading ? "animate-spin" : ""}`} />
                  <span>Reset Blank</span>
                </button>
              )}
            </div>
          </div>

          {/* Page Heading & Tiers Summary Cards */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-navy-900 tracking-tight flex items-center space-x-3">
                <span>User Profile & Statutory Verification Hub</span>
                {isDemoUser ? (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold border border-slate-300">
                    Seed Demo Dataset
                  </span>
                ) : (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold border border-sky-300">
                    Active Test Registrant
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Multi-tier identity verification, Ministry of MSME / GSTIN government validation, and BIS CARE public licence registry lookup.
              </p>
            </div>

            {/* Tiers Badge Progression Strip */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm text-[11px] font-medium">
              <span className="text-slate-400 font-bold px-1">STATUS:</span>
              <div
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md border ${
                  user?.is_account_verified
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-500 border-slate-200"
                }`}
              >
                {user?.is_account_verified ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
                <span>Level 1: Account</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <div
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md border ${
                  vsummary?.business_status_badge.status === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold"
                    : bprof
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                {vsummary?.business_status_badge.status === "VERIFIED" ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                ) : bprof ? (
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Level 3: Business KYC</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <div
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-md border ${
                  vsummary?.has_operative_bis_license
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 font-bold"
                    : "bg-slate-50 text-slate-400 border-slate-200"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                <span>Level 4: BIS Registry</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 space-x-8 text-sm font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition-colors flex items-center space-x-2 ${
                activeTab === "overview"
                  ? "border-b-2 border-navy-900 text-navy-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <User className="w-4 h-4" />
              <span>User Profile (Level 1)</span>
            </button>
            <button
              onClick={() => setActiveTab("business")}
              className={`pb-3 transition-colors flex items-center space-x-2 ${
                activeTab === "business"
                  ? "border-b-2 border-navy-900 text-navy-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Business Profile & Government KYC (Levels 2 & 3)</span>
            </button>
            <button
              onClick={() => setActiveTab("bis")}
              className={`pb-3 transition-colors flex items-center space-x-2 ${
                activeTab === "bis"
                  ? "border-b-2 border-navy-900 text-navy-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Award className="w-4 h-4" />
              <span>BIS Licence Lookup (Level 4)</span>
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`pb-3 transition-colors flex items-center space-x-2 ${
                activeTab === "audit"
                  ? "border-b-2 border-navy-900 text-navy-900 font-bold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Statutory Verification Audit Log</span>
            </button>
          </div>

          {/* TAB 1: USER PROFILE & LEVEL 1 ACCOUNT VERIFICATION */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Identity Card */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-navy-900 text-saffron flex items-center justify-center text-xl font-bold border-2 border-saffron shadow-sm">
                        {user?.full_name ? user.full_name.slice(0, 2).toUpperCase() : "NA"}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-navy-900">{user?.full_name || "New Applicant"}</h2>
                        <p className="text-xs text-slate-500">{bprof?.business_name || user?.organization || "Independent Registrant"}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Category: {user?.account_type || "MSME Manufacturer"}
                          </span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            Role: {user?.role || "USER"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col sm:items-end">
                      <span className="text-[10px] text-slate-400 font-medium">Account ID</span>
                      <span className="text-xs font-mono font-bold text-slate-700">{user?.id}</span>
                      <span className="text-[10px] text-slate-400 mt-1">Joined: {user?.created_at || "2026-09-11"}</span>
                    </div>
                  </div>

                  {/* Level 1 Verification Status Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        <span>Level 1: NexaStandards Account Verification</span>
                      </h3>
                      {user?.is_account_verified ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Account Verified</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center space-x-1">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Verification Incomplete</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Email Box */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700">Email Address</span>
                          </div>
                          {user?.email_verified ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Email Verified</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                              Unverified
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-xs font-semibold text-slate-900 truncate">
                          {user?.email || "newuser@example.com"}
                        </div>

                        <div>
                          {user?.email_verified ? (
                            <p className="text-[11px] text-slate-500">✓ Cryptographic email ownership token validated.</p>
                          ) : (
                            <button
                              onClick={() => triggerOtpModal("EMAIL")}
                              className="w-full py-1.5 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1"
                            >
                              <span>Verify Email with OTP</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mobile Box */}
                      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-slate-500" />
                            <span className="text-xs font-bold text-slate-700">Mobile Number</span>
                          </div>
                          {user?.mobile_verified ? (
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Mobile Verified</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                              Unverified
                            </span>
                          )}
                        </div>

                        <div className="font-mono text-xs font-semibold text-slate-900">
                          {user?.mobile || "+91 98450 12345"}
                        </div>

                        <div>
                          {user?.mobile_verified ? (
                            <p className="text-[11px] text-slate-500">✓ TRAI DLT 2FA SMS verification completed.</p>
                          ) : (
                            <button
                              onClick={() => triggerOtpModal("MOBILE")}
                              className="w-full py-1.5 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1"
                            >
                              <span>Verify Mobile with OTP</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Callout */}
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 text-xs text-sky-900 space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-sky-600" />
                      <span>Account Verification Principle</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      Completing Email and Mobile verification confirms your account identity. However, this does <strong>not</strong> grant
                      &ldquo;Verified MSME&rdquo; or &ldquo;BIS Certified&rdquo; status. Enterprise credentials must be confirmed via statutory GSTIN/Udyam verification under Level 3.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Next Steps & Quick Jump */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-navy-900">Applicant Journey Checklist</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className={`mt-0.5 p-1 rounded-full ${user?.is_account_verified ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Step 1: Account Verification</span>
                        <span className="text-slate-500">Email & Mobile 2FA OTP verification.</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className={`mt-0.5 p-1 rounded-full ${bprof?.has_details_submitted ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Step 2: Business Details Submission</span>
                        <span className="text-slate-500">Enter GSTIN, Udyam, and factory location.</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className={`mt-0.5 p-1 rounded-full ${vsummary?.business_status_badge.status === "VERIFIED" ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Step 3: Government KYC Verification</span>
                        <span className="text-slate-500">Official GSTN & MSME registry checksum validation.</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className={`mt-0.5 p-1 rounded-full ${vsummary?.has_operative_bis_license ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">Step 4: BIS Licence Registry Match</span>
                        <span className="text-slate-500">Cross-check CM/L number against BIS CARE database.</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("business")}
                    className="w-full py-2 bg-navy-900 hover:bg-navy-800 text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-2"
                  >
                    <span>Proceed to Business Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Statutory Manakonline Callout */}
                <div className="bg-gradient-to-br from-navy-950 to-slate-900 border border-slate-800 rounded-xl p-5 text-white space-y-3">
                  <div className="flex items-center space-x-2 text-saffron text-xs font-bold">
                    <ExternalLink className="w-4 h-4" />
                    <span>Official BIS Manakonline Integration</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Formal application for ISI mark grant, surveillance fee deposits, and renewal submissions are legal proceedings governed under
                    the Bureau of Indian Standards Act, 2016.
                  </p>
                  <a
                    href="https://www.manakonline.in"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 text-xs font-bold text-saffron hover:underline"
                  >
                    <span>Visit Manakonline Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BUSINESS PROFILE & GOVERNMENT KYC (LEVEL 2 & LEVEL 3) */}
          {activeTab === "business" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Government KYC Badge Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
                        <Building2 className="w-5 h-5 text-navy-800" />
                        <span>Enterprise KYC & Statutory Registration</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Separates registered corporate entities from simple website logins.
                      </p>
                    </div>

                    <div>
                      {vsummary?.business_status_badge.status === "VERIFIED" ? (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs shadow-sm">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>🟢 Verified Business</span>
                        </div>
                      ) : bprof?.has_details_submitted ? (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-800 font-bold text-xs shadow-sm">
                          <RefreshCw className="w-4 h-4 text-amber-600" />
                          <span>🟡 Verification Pending</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs">
                          <span>⚪ Details Not Submitted</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KYC Verification Audit Info if Verified */}
                  {vsummary?.business_status_badge.status === "VERIFIED" && (
                    <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between font-bold text-emerald-900">
                        <span className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Official Government Verification Confirmed</span>
                        </span>
                        <span className="text-[11px] font-mono text-emerald-700">Audit Status: VALID</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 text-[11px]">
                        <div>
                          <span className="font-semibold text-slate-700">Verification Source: </span>
                          <span>GST Portal & MSME Udyam Sandbox Gateway</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-700">Verified Timestamp: </span>
                          <span>11 Sep 2026</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name *</label>
                        <input
                          type="text"
                          value={bizForm.business_name}
                          onChange={(e) => setBizForm({ ...bizForm, business_name: e.target.value })}
                          placeholder="e.g. Sharma Metalcrafts Pvt Ltd"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Enterprise Type *</label>
                        <select
                          value={bizForm.business_type}
                          onChange={(e) => setBizForm({ ...bizForm, business_type: e.target.value })}
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none bg-white"
                        >
                          <option value="MSME Manufacturer">MSME Manufacturer (Micro / Small / Medium)</option>
                          <option value="Large Scale Manufacturer">Large Scale Enterprise</option>
                          <option value="Recognized Testing Laboratory">Recognized Testing Laboratory</option>
                          <option value="Regulatory Consultant">BIS Regulatory Consultant</option>
                        </select>
                      </div>
                    </div>

                    {/* GSTIN & Udyam with Interactive Verification Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">GSTIN (15-digit)</label>
                          {vsummary?.gstin_verified ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>GSTIN Verified</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 font-semibold">Unverified</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={bizForm.gstin}
                            onChange={(e) => setBizForm({ ...bizForm, gstin: e.target.value.toUpperCase() })}
                            placeholder="e.g. 07AAAAA0000A1Z5"
                            maxLength={15}
                            className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none uppercase"
                          />
                          <button
                            onClick={() => handleVerifyBusinessKYC("GSTIN")}
                            disabled={actionLoading || !bizForm.gstin}
                            className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg disabled:opacity-50 transition-all shrink-0"
                          >
                            Verify GST
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">Sample: 07AAAAA0000A1Z5 (Delhi) or 29AAAAA0000A1Z5 (Karnataka)</p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-slate-700">Udyam Registration Number</label>
                          {vsummary?.udyam_verified ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center space-x-1">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Udyam Verified</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-700 font-semibold">Unverified</span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={bizForm.udyam_number}
                            onChange={(e) => setBizForm({ ...bizForm, udyam_number: e.target.value.toUpperCase() })}
                            placeholder="UDYAM-UP-28-0012345"
                            className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none uppercase"
                          />
                          <button
                            onClick={() => handleVerifyBusinessKYC("UDYAM")}
                            disabled={actionLoading || !bizForm.udyam_number}
                            className="px-3 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-lg disabled:opacity-50 transition-all shrink-0"
                          >
                            Verify Udyam
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400">Sample: UDYAM-UP-28-0012345 or UDYAM-KR-03-0012345</p>
                      </div>
                    </div>

                    {/* Address Fields */}
                    <div className="pt-2 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Factory / Manufacturing Unit Address</label>
                        <input
                          type="text"
                          value={bizForm.factory_address}
                          onChange={(e) => setBizForm({ ...bizForm, factory_address: e.target.value })}
                          placeholder="e.g. Plot 45, Industrial Area Phase 2, Noida"
                          className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                          <input
                            type="text"
                            value={bizForm.state}
                            onChange={(e) => setBizForm({ ...bizForm, state: e.target.value })}
                            placeholder="Uttar Pradesh"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                          <input
                            type="text"
                            value={bizForm.district}
                            onChange={(e) => setBizForm({ ...bizForm, district: e.target.value })}
                            placeholder="Gautam Buddha Nagar"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Unit Contact Number</label>
                          <input
                            type="text"
                            value={bizForm.contact_number}
                            onChange={(e) => setBizForm({ ...bizForm, contact_number: e.target.value })}
                            placeholder="+91 98765 43210"
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {bizSaveSuccess ? (
                          <span className="text-emerald-600 font-bold flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Business profile saved!</span>
                          </span>
                        ) : (
                          <span>Saving details updates status to Level 2 (Verification Pending).</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button
                          onClick={handleSaveBusiness}
                          disabled={actionLoading}
                          className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition-all"
                        >
                          Save Profile
                        </button>

                        <button
                          onClick={() => handleVerifyBusinessKYC("ALL")}
                          disabled={actionLoading || (!bizForm.gstin && !bizForm.udyam_number)}
                          className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-400" />
                          <span>Verify Business (Level 3)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Information / Statutory Rules Card */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Statutory Guardrails</span>
                  </h3>
                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <p>
                      <strong>Why separate verification levels?</strong> In legal regulatory proceedings, anyone can create an email login.
                      Awarding a &ldquo;Verified MSME&rdquo; badge without government cross-checking creates severe compliance liabilities.
                    </p>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                      <span className="font-bold text-slate-800 block">Level 1 — Account Verified:</span>
                      <span className="text-slate-500">Confirms email & phone ownership via OTP.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                      <span className="font-bold text-slate-800 block">Level 2 — Business Submitted:</span>
                      <span className="text-slate-500">Applicant declares manufacturing unit data. Status: Verification Pending.</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                      <span className="font-bold text-slate-800 block">Level 3 — Verified Business:</span>
                      <span className="text-slate-500">GSTIN / Udyam validated against official government gateways.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BIS LICENCE REGISTRY LOOKUP (LEVEL 4) */}
          {activeTab === "bis" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-navy-900 flex items-center space-x-2">
                      <Award className="w-5 h-5 text-indigo-600" />
                      <span>BIS Licence Verification & Registry Matching</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      A company having an account or GSTIN does not automatically possess a BIS license. Enter the CM/L or CRS number to cross-check with the official BIS CARE registry.
                    </p>
                  </div>

                  {/* Input & Lookup Box */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Enter BIS Licence CM/L Number</label>
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={bisCmlInput}
                          onChange={(e) => setBisCmlInput(e.target.value.toUpperCase())}
                          placeholder="e.g. CM/L-8400192 or CM/L-9102456"
                          className="flex-1 px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none uppercase font-bold"
                        />
                        <button
                          onClick={() => handleVerifyBISLicense()}
                          disabled={actionLoading || !bisCmlInput.trim()}
                          className="px-4 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-saffron" />
                          <span>Verify BIS Licence</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Test Preset Chips for Evaluators */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500">Quick Test Evaluation Chips:</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            setBisCmlInput("CM/L-9102456");
                            handleVerifyBISLicense("CM/L-9102456");
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg transition-all"
                        >
                          CM/L-9102456 (SharmaCraft - Operative)
                        </button>
                        <button
                          onClick={() => {
                            setBisCmlInput("CM/L-8400192");
                            handleVerifyBISLicense("CM/L-8400192");
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-all"
                        >
                          CM/L-8400192 (Hawkins - Operative)
                        </button>
                        <button
                          onClick={() => {
                            setBisCmlInput("CM/L-7123456");
                            handleVerifyBISLicense("CM/L-7123456");
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg transition-all"
                        >
                          CM/L-7123456 (Milton - Operative)
                        </button>
                        <button
                          onClick={() => {
                            setBisCmlInput("CM/L-6543210");
                            handleVerifyBISLicense("CM/L-6543210");
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg transition-all"
                        >
                          CM/L-6543210 (Apex - Suspended)
                        </button>
                        <button
                          onClick={() => {
                            setBisCmlInput("CM/L-9999999");
                            handleVerifyBISLicense("CM/L-9999999");
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all"
                        >
                          CM/L-9999999 (Unregistered Counterfeit)
                        </button>
                      </div>
                    </div>

                    {/* Result Display Card */}
                    {bisLookupResult && (
                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            BIS CARE Registry Search Result
                          </h3>
                          {bisLookupResult.match ? (
                            bisLookupResult.status === "OPERATIVE" ? (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1 rounded-full flex items-center space-x-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>🟢 BIS Registry Match (Active)</span>
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full flex items-center space-x-1">
                                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                <span>🟡 License {bisLookupResult.status}</span>
                              </span>
                            )
                          ) : (
                            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-300 px-3 py-1 rounded-full flex items-center space-x-1">
                              <X className="w-3.5 h-3.5 text-rose-600" />
                              <span>🔴 No Registry Match Found</span>
                            </span>
                          )}
                        </div>

                        {bisLookupResult.match ? (
                          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <span className="text-slate-400 block font-medium">Licensed Firm:</span>
                                <span className="font-bold text-navy-900 text-sm block">{bisLookupResult.license.firm_name}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-medium">Operative Indian Standard:</span>
                                <span className="font-mono font-bold text-indigo-700 block">{bisLookupResult.license.standard_number}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                              <div>
                                <span className="text-slate-400 block font-medium">Product Scope:</span>
                                <span className="font-medium text-slate-800 block">{bisLookupResult.license.product_name}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block font-medium">Validity Period:</span>
                                <span className="font-mono font-medium text-slate-800 block">
                                  {bisLookupResult.license.valid_from} to {bisLookupResult.license.valid_to}
                                </span>
                              </div>
                            </div>

                            {bisLookupResult.license.factory_address && (
                              <div className="pt-2 border-t border-slate-200">
                                <span className="text-slate-400 block font-medium">Certified Factory Location:</span>
                                <span className="text-slate-700">{bisLookupResult.license.factory_address}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60 text-xs text-rose-900 space-y-2">
                            <p className="font-semibold">{bisLookupResult.message}</p>
                            <p className="text-[11px] text-rose-700">
                              If you hold a valid paper grant from a BIS Branch Office, ensure renewal has been processed on Manakonline.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Linked User Licences List */}
                    <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                      <h3 className="text-xs font-bold text-slate-700">Licenses Linked to this Account:</h3>
                      {profileData?.bis_licenses && profileData.bis_licenses.length > 0 ? (
                        <div className="space-y-2">
                          {profileData.bis_licenses.map((lic) => (
                            <div key={lic.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                              <div className="space-y-0.5">
                                <span className="font-mono font-bold text-navy-900">{lic.cm_l_number}</span>
                                <span className="text-slate-500 block text-[11px]">{lic.firm_name} ({lic.standard_number})</span>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    lic.status === "OPERATIVE"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {lic.status}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">Valid till: {lic.validity_date || "N/A"}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No BIS licenses linked yet. Enter a CM/L number above to verify and link.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Guidance Box */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-navy-900">How BIS Certification Works</h3>
                  <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                    <p>
                      In India, BIS Product Certification operates primarily under two schemes:
                    </p>
                    <ul className="space-y-2 pl-4 list-disc text-[11px]">
                      <li>
                        <strong>Scheme I (ISI Mark):</strong> Factory inspection + in-house laboratory testing + independent verification samples.
                      </li>
                      <li>
                        <strong>Scheme II (CRS Registration):</strong> MeitY / Meity electronic products tested at NABL accredited labs.
                      </li>
                    </ul>
                    <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-900 text-[11px] space-y-1">
                      <span className="font-bold block">Official Action Protocol:</span>
                      <span>To apply for a new license or submit standard conformance reports, visit the official BIS portal:</span>
                      <a
                        href="https://www.manakonline.in"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-indigo-700 underline block mt-1"
                      >
                        https://www.manakonline.in ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOG */}
          {activeTab === "audit" && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-bold text-navy-900">Statutory Verification Audit Trail</h2>
                <p className="text-xs text-slate-500">
                  Immutable record of independent statutory authentication events.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                      <th className="py-2.5 px-3 font-bold">Verification Tier</th>
                      <th className="py-2.5 px-3 font-bold">Status</th>
                      <th className="py-2.5 px-3 font-bold">Audit Reference</th>
                      <th className="py-2.5 px-3 font-bold">Verification Source</th>
                      <th className="py-2.5 px-3 font-bold">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profileData?.verification_records && profileData.verification_records.length > 0 ? (
                      profileData.verification_records.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-bold text-navy-900">{rec.verification_type}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rec.status === "VERIFIED"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : rec.status === "FAILED"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-700 text-[11px]">{rec.reference_number || "N/A"}</td>
                          <td className="py-2.5 px-3 text-slate-600">{rec.source}</td>
                          <td className="py-2.5 px-3 text-slate-500">{rec.verified_at || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                          No audit records found. Complete Level 1 or Level 3 verification to log audit trail.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* OTP Verification Modal */}
          {otpModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-navy-900 flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-emerald-600" />
                    <span>Verify {otpType === "EMAIL" ? "Email Address" : "Mobile Number"}</span>
                  </h3>
                  <button onClick={() => setOtpModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    A 6-digit one-time password (OTP) has been dispatched to:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-100 font-mono font-bold text-slate-800 text-center">
                    {otpTarget}
                  </div>
                </div>

                {/* Sandbox Auto-Fill Code for Judges */}
                {sandboxOtp && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1.5">
                    <span className="font-bold text-amber-900 block flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Sandbox Prototype Auto-Dispatch:</span>
                    </span>
                    <p className="text-slate-600 text-[11px]">
                      Simulated OTP Gateway returned: <strong className="font-mono text-slate-900">{sandboxOtp}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setOtpCode(sandboxOtp)}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold transition-all"
                    >
                      Auto-Fill Code ({sandboxOtp})
                    </button>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Enter 6-digit OTP Code:</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>

                {otpStatusMsg && (
                  <p className="text-xs text-slate-500 text-center italic">{otpStatusMsg}</p>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOtpModalOpen(false)}
                    className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitVerifyOtp}
                    disabled={actionLoading || otpCode.length < 6}
                    className="flex-1 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm disabled:opacity-50 transition-all flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm & Verify</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Create Account Modal */}
          {createModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg">Create your NexaStandards Account</h3>
                    <p className="text-xs text-slate-500">Step 1 in the statutory user onboarding journey.</p>
                  </div>
                  <button onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {regError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg">
                    {regError}
                  </div>
                )}

                <form onSubmit={handleCreateAccount} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={regForm.full_name}
                      onChange={(e) => setRegForm({ ...regForm, full_name: e.target.value })}
                      placeholder="e.g. Shashikumar Raj Urs"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="shashi@example.com"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                      <input
                        type="text"
                        required
                        value={regForm.mobile}
                        onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value })}
                        placeholder="+91 98450 12345"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Password *</label>
                      <input
                        type="password"
                        required
                        value={regForm.password}
                        onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        required
                        value={regForm.confirm_password}
                        onChange={(e) => setRegForm({ ...regForm, confirm_password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Account Category *</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { val: "INDIVIDUAL", label: "Individual" },
                        { val: "MANUFACTURER", label: "Manufacturer / MSME" },
                        { val: "LABORATORY", label: "Testing Laboratory" },
                        { val: "CONSULTANT", label: "Consultant" },
                        { val: "CONSUMER", label: "Consumer" }
                      ].map((cat) => (
                        <label
                          key={cat.val}
                          className={`p-2 rounded-lg border text-xs flex items-center space-x-2 cursor-pointer transition-all ${
                            regForm.account_type === cat.val
                              ? "bg-navy-900 text-white border-navy-900 font-bold"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <input
                            type="radio"
                            name="account_type"
                            value={cat.val}
                            checked={regForm.account_type === cat.val}
                            onChange={() => setRegForm({ ...regForm, account_type: cat.val })}
                            className="sr-only"
                          />
                          <span>{cat.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setCreateModalOpen(false)}
                      className="flex-1 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="flex-1 py-2 text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white rounded-lg shadow-sm transition-all flex items-center justify-center space-x-1"
                    >
                      <span>Create Account</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
