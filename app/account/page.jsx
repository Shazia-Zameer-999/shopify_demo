// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function AccountPage() {
//     const { data: session, status } = useSession();
//     const router = useRouter();

//     const [form, setForm] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: "",
//     });
//     const [loading, setLoading] = useState(false);
//     const [msg, setMsg] = useState("");
//     const [error, setError] = useState("");

//     const [orders, setOrders] = useState([]);
//     const [ordersLoading, setOrdersLoading] = useState(false);
//     const [ordersError, setOrdersError] = useState("");

//     // Redirect unauthenticated users to login
//     useEffect(() => {
//         if (status === "unauthenticated") {
//             router.push("/auth/login?callbackUrl=/account");
//         }
//     }, [status, router]);


//     useEffect(() => {
//         async function loadOrders() {
//             if (!session || status !== "authenticated") return;

//             setOrdersLoading(true);
//             setOrdersError("");

//             try {
//                 const res = await fetch("/api/account/orders");
//                 const data = await res.json();

//                 if (!res.ok || !data.success) {
//                     setOrdersError(data.message || "Could not load orders.");
//                     return;
//                 }

//                 setOrders(data.orders || []);
//             } catch (err) {
//                 console.error(err);
//                 setOrdersError("Something went wrong while loading orders.");
//             } finally {
//                 setOrdersLoading(false);
//             }
//         }

//         loadOrders();
//     }, [session, status]);



//     if (status === "loading") {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
//                 Loading your account...
//             </div>
//         );
//     }


//     // While redirecting, don't flash content
//     if (!session) return null;

//     const user = session.user;

//     async function handlePasswordChange(e) {
//         e.preventDefault();
//         setError("");
//         setMsg("");

//         if (!form.newPassword || form.newPassword.length < 6) {
//             setError("New password must be at least 6 characters.");
//             return;
//         }

//         if (form.newPassword !== form.confirmPassword) {
//             setError("New password and confirm password do not match.");
//             return;
//         }

//         setLoading(true);
//         try {
//             const res = await fetch("/api/account/change-password", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     currentPassword: form.currentPassword,
//                     newPassword: form.newPassword,
//                 }),
//             });

//             const data = await res.json();

//             if (!res.ok || !data.success) {
//                 setError(data.message || "Failed to update password.");
//                 return;
//             }

//             setMsg(data.message || "Password updated successfully.");
//             setForm({
//                 currentPassword: "",
//                 newPassword: "",
//                 confirmPassword: "",
//             });
//         } catch (err) {
//             console.error(err);
//             setError("Something went wrong. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     }

//     return (
//         <div className="min-h-screen bg-slate-950 py-10 px-4">
//             <div className="mx-auto w-full max-w-5xl space-y-8">
//                 {/* Heading */}
//                 <div>
//                     <h1 className="text-3xl font-bold text-slate-100 mb-2">
//                         My Account
//                     </h1>
//                     <p className="text-sm text-slate-400">
//                         View and manage your profile, password, and future orders.
//                     </p>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
//                     {/* Profile card */}
//                     <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30">
//                         <h2 className="text-lg font-semibold text-slate-100 mb-4">
//                             Profile
//                         </h2>
//                         <div className="space-y-3 text-sm">
//                             <div>
//                                 <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
//                                     Name
//                                 </p>
//                                 <p className="text-slate-100">
//                                     {user.name || "No name set"}
//                                 </p>
//                             </div>

//                             <div>
//                                 <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
//                                     Email
//                                 </p>
//                                 <p className="text-slate-100">
//                                     {user.email || "No email available"}
//                                 </p>
//                             </div>

//                             {user.shopifyCustomerId && (
//                                 <div>
//                                     <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
//                                         Shopify Customer ID
//                                     </p>
//                                     <p className="text-[11px] text-slate-300 break-all">
//                                         {user.shopifyCustomerId}
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         <p className="mt-4 text-xs text-slate-500">
//                             Later we can add address book, order history, and preferences here.
//                         </p>
//                     </div>

//                     {/* Password change card */}
//                     <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30">
//                         <h2 className="text-lg font-semibold text-slate-100 mb-2">
//                             Security
//                         </h2>
//                         <p className="text-xs text-slate-400 mb-4">
//                             Change your password to keep your account secure.
//                         </p>

//                         {error && (
//                             <div className="mb-3 rounded-lg border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
//                                 {error}
//                             </div>
//                         )}

//                         {msg && (
//                             <div className="mb-3 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
//                                 {msg}
//                             </div>
//                         )}

//                         <form onSubmit={handlePasswordChange} className="space-y-3">
//                             <div>
//                                 <label className="block text-xs font-medium text-slate-300 mb-1">
//                                     Current password
//                                 </label>
//                                 <input
//                                     type="password"
//                                     className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
//                                     placeholder="••••••••"
//                                     value={form.currentPassword}
//                                     onChange={(e) =>
//                                         setForm({ ...form, currentPassword: e.target.value })
//                                     }
//                                 />
//                                 <p className="mt-1 text-[10px] text-slate-500">
//                                     If you signed up with Google/GitHub and never set a password,
//                                     you can leave this empty and just choose a new one.
//                                 </p>
//                             </div>

//                             <div className="grid gap-3 md:grid-cols-2">
//                                 <div>
//                                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                                         New password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
//                                         placeholder="••••••••"
//                                         value={form.newPassword}
//                                         onChange={(e) =>
//                                             setForm({ ...form, newPassword: e.target.value })
//                                         }
//                                         required
//                                     />
//                                 </div>

//                                 <div>
//                                     <label className="block text-xs font-medium text-slate-300 mb-1">
//                                         Confirm new password
//                                     </label>
//                                     <input
//                                         type="password"
//                                         className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
//                                         placeholder="••••••••"
//                                         value={form.confirmPassword}
//                                         onChange={(e) =>
//                                             setForm({ ...form, confirmPassword: e.target.value })
//                                         }
//                                         required
//                                     />
//                                 </div>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
//                             >
//                                 {loading ? "Updating..." : "Update password"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//                 {/* My Orders card */}
//                 <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30">
//                     <h2 className="text-lg font-semibold text-slate-100 mb-2">
//                         My Orders
//                     </h2>
//                     <p className="text-xs text-slate-400 mb-4">
//                         View your recent orders placed through this store.
//                     </p>

//                     {ordersLoading && (
//                         <p className="text-sm text-slate-300">Loading orders...</p>
//                     )}

//                     {ordersError && (
//                         <p className="text-xs text-rose-300 mb-2">{ordersError}</p>
//                     )}

//                     {!ordersLoading && !ordersError && orders.length === 0 && (
//                         <p className="text-sm text-slate-400">
//                             You have not placed any orders yet.
//                         </p>
//                     )}

//                     {!ordersLoading && orders.length > 0 && (
//                         <div className="space-y-3">
//                             {orders.map((order) => (
//                                 <div
//                                     key={order.id}
//                                     className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
//                                 >
//                                     <div>
//                                         <p className="font-medium text-slate-100">
//                                             {order.name}{" "}
//                                             <span className="text-xs text-slate-500">
//                                                 • {order.currency} {order.totalPrice}
//                                             </span>
//                                         </p>
//                                         <p className="text-[11px] text-slate-500">
//                                             Placed on{" "}
//                                             {new Date(order.createdAt).toLocaleDateString()}
//                                         </p>
//                                     </div>
//                                     <div className="flex flex-col items-start md:items-end gap-1">
//                                         <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
//                                             Payment: {order.financialStatus || "N/A"}
//                                         </span>
//                                         <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
//                                             Fulfillment: {order.fulfillmentStatus || "Unfulfilled"}
//                                         </span>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>

//     );
// }

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getCookie, THEME_COOKIE } from "@/utils/storage.client.js";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [theme, setTheme] = useState("dark");
    const [mounted, setMounted] = useState(false);
    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");
    const [error, setError] = useState("");

    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState("");

    // Theme management (matching other pages)
    useEffect(() => {
        const stored = getCookie(THEME_COOKIE);
        if (stored === "light" || stored === "dark") setTheme(stored);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const checkThemeChange = () => {
            const stored = getCookie(THEME_COOKIE);
            if (stored === "light" || stored === "dark") setTheme(stored);
        };
        const interval = setInterval(checkThemeChange, 100);
        return () => clearInterval(interval);
    }, [mounted]);

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/account");
        }
    }, [status, router]);

    // Load orders
    useEffect(() => {
        async function loadOrders() {
            if (!session || status !== "authenticated") return;

            setOrdersLoading(true);
            setOrdersError("");

            try {
                const res = await fetch("/api/account/orders");
                const data = await res.json();

                if (!res.ok || !data.success) {
                    setOrdersError(data.message || "Could not load orders.");
                    return;
                }

                setOrders(data.orders || []);
            } catch (err) {
                console.error(err);
                setOrdersError("Something went wrong while loading orders.");
            } finally {
                setOrdersLoading(false);
            }
        }

        loadOrders();
    }, [session, status]);

    if (!mounted || status === "loading") {
        return (
            <div className={`min-h-screen flex items-center justify-center ${
                theme === "dark" ? "bg-slate-950" : "bg-white"
            }`}>
                <div className="text-center">
                    <div className={`inline-flex h-16 w-16 animate-spin rounded-full border-4 ${
                        theme === "dark" 
                            ? "border-slate-700 border-t-sky-500" 
                            : "border-slate-200 border-t-sky-500"
                    } mb-4`} />
                    <p className={`text-lg ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                        Loading your account...
                    </p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    const user = session.user;
    const isDark = theme === "dark";

    async function handlePasswordChange(e) {
        e.preventDefault();
        setError("");
        setMsg("");

        if (!form.newPassword || form.newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }

        if (form.newPassword !== form.confirmPassword) {
            setError("New password and confirm password do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/account/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: form.currentPassword,
                    newPassword: form.newPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.message || "Failed to update password.");
                return;
            }

            setMsg(data.message || "Password updated successfully.");
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`min-h-screen ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
            {/* Hero Section */}
            <div className={`relative overflow-hidden border-b ${
                isDark
                    ? "bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800"
                    : "bg-gradient-to-b from-slate-100 via-white to-slate-50 border-slate-200"
            }`}>
                <div className={`absolute inset-0 ${
                    isDark
                        ? "bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent_70%)]"
                        : "bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_70%)]"
                }`} />
                
                <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className={`inline-flex items-center gap-2 mb-4`}>
                                <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${
                                    isDark
                                        ? "bg-gradient-to-br from-sky-500/20 to-blue-500/20 border-sky-500/30"
                                        : "bg-gradient-to-br from-sky-100 to-blue-100 border-sky-300/50"
                                }`}>
                                    <svg className={`h-6 w-6 ${isDark ? "text-sky-400" : "text-sky-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <h1 className={`text-4xl font-black tracking-tight sm:text-5xl mb-4 ${
                                isDark
                                    ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300"
                                    : "text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700"
                            }`}>
                                Welcome back, {user.name?.split(' ')[0] || 'there'}
                            </h1>
                            
                            <p className={`text-lg max-w-2xl ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}>
                                Manage your profile, security settings, and view your order history.
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="hidden lg:flex gap-4">
                            <div className={`rounded-2xl border px-6 py-4 min-w-[120px] ${
                                isDark
                                    ? "border-slate-800/60 bg-slate-900/40 backdrop-blur-xl"
                                    : "border-slate-200 bg-white/60 backdrop-blur-xl"
                            }`}>
                                <p className={`text-xs uppercase tracking-wide mb-1 ${
                                    isDark ? "text-slate-500" : "text-slate-600"
                                }`}>Orders</p>
                                <p className={`text-3xl font-black ${
                                    isDark ? "text-sky-400" : "text-sky-600"
                                }`}>{orders.length}</p>
                            </div>
                            <div className={`rounded-2xl border px-6 py-4 min-w-[120px] ${
                                isDark
                                    ? "border-slate-800/60 bg-slate-900/40 backdrop-blur-xl"
                                    : "border-slate-200 bg-white/60 backdrop-blur-xl"
                            }`}>
                                <p className={`text-xs uppercase tracking-wide mb-1 ${
                                    isDark ? "text-slate-500" : "text-slate-600"
                                }`}>Status</p>
                                <p className={`text-sm font-bold ${
                                    isDark ? "text-emerald-400" : "text-emerald-600"
                                }`}>Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Profile Card */}
                    <div className={`lg:col-span-1 rounded-2xl border overflow-hidden transition-all duration-300 ${
                        isDark
                            ? "border-slate-800/60 bg-slate-900/40 backdrop-blur-xl"
                            : "border-slate-200 bg-white/60 backdrop-blur-xl"
                    }`}>
                        <div className={`px-6 py-5 border-b ${
                            isDark ? "border-slate-800" : "border-slate-200"
                        }`}>
                            <h2 className={`text-xl font-bold ${
                                isDark ? "text-slate-100" : "text-slate-900"
                            }`}>Profile Information</h2>
                            <p className={`text-sm mt-1 ${
                                isDark ? "text-slate-400" : "text-slate-600"
                            }`}>Your account details</p>
                        </div>
                        
                        <div className="p-6 space-y-6">
                            <div>
                                <p className={`text-xs uppercase tracking-wider mb-2 ${
                                    isDark ? "text-slate-500" : "text-slate-600"
                                }`}>Full Name</p>
                                <p className={`text-base font-medium ${
                                    isDark ? "text-slate-100" : "text-slate-900"
                                }`}>{user.name || "Not set"}</p>
                            </div>

                            <div>
                                <p className={`text-xs uppercase tracking-wider mb-2 ${
                                    isDark ? "text-slate-500" : "text-slate-600"
                                }`}>Email Address</p>
                                <p className={`text-base font-medium break-all ${
                                    isDark ? "text-slate-100" : "text-slate-900"
                                }`}>{user.email || "No email available"}</p>
                            </div>

                            {user.shopifyCustomerId && (
                                <div>
                                    <p className={`text-xs uppercase tracking-wider mb-2 ${
                                        isDark ? "text-slate-500" : "text-slate-600"
                                    }`}>Customer ID</p>
                                    <p className={`text-xs font-mono break-all px-3 py-2 rounded-lg ${
                                        isDark 
                                            ? "bg-slate-950/50 text-slate-300 border border-slate-800" 
                                            : "bg-slate-100 text-slate-700 border border-slate-200"
                                    }`}>
                                        {user.shopifyCustomerId}
                                    </p>
                                </div>
                            )}

                            <div className={`pt-4 border-t ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                    <p className={`text-sm ${
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    }`}>Account Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security & Orders */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Security Card */}
                        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                            isDark
                                ? "border-slate-800/60 bg-slate-900/40 backdrop-blur-xl"
                                : "border-slate-200 bg-white/60 backdrop-blur-xl"
                        }`}>
                            <div className={`px-6 py-5 border-b ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <h2 className={`text-xl font-bold ${
                                    isDark ? "text-slate-100" : "text-slate-900"
                                }`}>Security Settings</h2>
                                <p className={`text-sm mt-1 ${
                                    isDark ? "text-slate-400" : "text-slate-600"
                                }`}>Update your password to keep your account secure</p>
                            </div>

                            <div className="p-6">
                                {error && (
                                    <div className={`mb-6 rounded-xl border px-4 py-3 flex items-start gap-3 ${
                                        isDark
                                            ? "border-rose-500/30 bg-rose-500/10"
                                            : "border-rose-300/50 bg-rose-50"
                                    }`}>
                                        <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                            isDark ? "text-rose-400" : "text-rose-600"
                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className={`text-sm ${
                                            isDark ? "text-rose-200" : "text-rose-700"
                                        }`}>{error}</p>
                                    </div>
                                )}

                                {msg && (
                                    <div className={`mb-6 rounded-xl border px-4 py-3 flex items-start gap-3 ${
                                        isDark
                                            ? "border-emerald-500/30 bg-emerald-500/10"
                                            : "border-emerald-300/50 bg-emerald-50"
                                    }`}>
                                        <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                            isDark ? "text-emerald-400" : "text-emerald-600"
                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className={`text-sm ${
                                            isDark ? "text-emerald-200" : "text-emerald-700"
                                        }`}>{msg}</p>
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} className="space-y-5">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${
                                            isDark ? "text-slate-300" : "text-slate-700"
                                        }`}>
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            className={`w-full rounded-xl border px-4 py-3 text-sm transition-all ${
                                                isDark
                                                    ? "border-slate-800 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:bg-slate-900/50"
                                                    : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:bg-slate-50"
                                            } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
                                            placeholder="Enter current password"
                                            value={form.currentPassword}
                                            onChange={(e) =>
                                                setForm({ ...form, currentPassword: e.target.value })
                                            }
                                        />
                                        <p className={`mt-2 text-xs ${
                                            isDark ? "text-slate-500" : "text-slate-600"
                                        }`}>
                                            Leave blank if you signed up with Google/GitHub
                                        </p>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? "text-slate-300" : "text-slate-700"
                                            }`}>
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all ${
                                                    isDark
                                                        ? "border-slate-800 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:bg-slate-900/50"
                                                        : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:bg-slate-50"
                                                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
                                                placeholder="Min. 6 characters"
                                                value={form.newPassword}
                                                onChange={(e) =>
                                                    setForm({ ...form, newPassword: e.target.value })
                                                }
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${
                                                isDark ? "text-slate-300" : "text-slate-700"
                                            }`}>
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all ${
                                                    isDark
                                                        ? "border-slate-800 bg-slate-950/50 text-slate-100 placeholder-slate-500 focus:border-sky-500/50 focus:bg-slate-900/50"
                                                        : "border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:bg-slate-50"
                                                } focus:outline-none focus:ring-2 focus:ring-sky-500/20`}
                                                placeholder="Re-enter password"
                                                value={form.confirmPassword}
                                                onChange={(e) =>
                                                    setForm({ ...form, confirmPassword: e.target.value })
                                                }
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/50 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-400/60 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                <span>Update Password</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Orders Card */}
                        <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                            isDark
                                ? "border-slate-800/60 bg-slate-900/40 backdrop-blur-xl"
                                : "border-slate-200 bg-white/60 backdrop-blur-xl"
                        }`}>
                            <div className={`px-6 py-5 border-b flex items-center justify-between ${
                                isDark ? "border-slate-800" : "border-slate-200"
                            }`}>
                                <div>
                                    <h2 className={`text-xl font-bold ${
                                        isDark ? "text-slate-100" : "text-slate-900"
                                    }`}>Order History</h2>
                                    <p className={`text-sm mt-1 ${
                                        isDark ? "text-slate-400" : "text-slate-600"
                                    }`}>Track and manage your recent orders</p>
                                </div>
                                {orders.length > 0 && (
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                        isDark
                                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                            : "bg-sky-100 text-sky-700 border border-sky-300"
                                    }`}>
                                        {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                                    </span>
                                )}
                            </div>

                            <div className="p-6">
                                {ordersLoading && (
                                    <div className="text-center py-12">
                                        <div className={`inline-flex h-12 w-12 animate-spin rounded-full border-4 ${
                                            isDark 
                                                ? "border-slate-700 border-t-sky-500" 
                                                : "border-slate-200 border-t-sky-500"
                                        } mb-4`} />
                                        <p className={`text-sm ${
                                            isDark ? "text-slate-400" : "text-slate-600"
                                        }`}>Loading your orders...</p>
                                    </div>
                                )}

                                {ordersError && (
                                    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${
                                        isDark
                                            ? "border-rose-500/30 bg-rose-500/10"
                                            : "border-rose-300/50 bg-rose-50"
                                    }`}>
                                        <svg className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                                            isDark ? "text-rose-400" : "text-rose-600"
                                        }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className={`text-sm ${
                                            isDark ? "text-rose-200" : "text-rose-700"
                                        }`}>{ordersError}</p>
                                    </div>
                                )}

                                {!ordersLoading && !ordersError && orders.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className={`inline-flex h-20 w-20 rounded-full border items-center justify-center mb-4 ${
                                            isDark
                                                ? "border-slate-800 bg-slate-900/50"
                                                : "border-slate-200 bg-slate-100"
                                        }`}>
                                            <svg className={`h-10 w-10 ${
                                                isDark ? "text-slate-600" : "text-slate-400"
                                            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <h3 className={`text-lg font-semibold mb-2 ${
                                            isDark ? "text-slate-200" : "text-slate-900"
                                        }`}>No orders yet</h3>
                                        <p className={`text-sm mb-6 ${
                                            isDark ? "text-slate-400" : "text-slate-600"
                                        }`}>Start shopping to see your orders here</p>
                                    </div>
                                )}

                                {!ordersLoading && orders.length > 0 && (
                                    <div className="space-y-4">
                                        {orders.map((order, index) => (
                                            <div
                                                key={order.id}
                                                className={`group rounded-xl border p-5 transition-all duration-200 hover:-translate-y-1 ${
                                                    isDark
                                                        ? "border-slate-800 bg-slate-950/40 hover:border-sky-500/40 hover:shadow-lg hover:shadow-sky-500/20"
                                                        : "border-slate-200 bg-white hover:border-sky-400/60 hover:shadow-lg hover:shadow-sky-400/20"
                                                }`}
                                            >
                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className={`text-lg font-bold ${
                                                                isDark ? "text-slate-100" : "text-slate-900"
                                                            }`}>{order.name}</h3>
                                                            <span className={`text-sm font-semibold ${
                                                                isDark ? "text-sky-400" : "text-sky-600"
                                                            }`}>
                                                                {order.currency} {order.totalPrice}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm flex items-center gap-2 ${
                                                            isDark ? "text-slate-400" : "text-slate-600"
                                                        }`}>
                                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2">
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                                                            order.financialStatus === 'paid'
                                                                ? isDark
                                                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                                                    : "bg-emerald-100 text-emerald-700 border border-emerald-300"
                                                                : isDark
                                                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                                                    : "bg-amber-100 text-amber-700 border border-amber-300"
                                                        }`}>
                                                            <div className={`h-1.5 w-1.5 rounded-full ${
                                                                order.financialStatus === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'
                                                            }`}></div>
                                                            {order.financialStatus || "Pending"}
                                                        </span>
                                                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                                                            order.fulfillmentStatus === 'fulfilled'
                                                                ? isDark
                                                                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                                                    : "bg-sky-100 text-sky-700 border border-sky-300"
                                                                : isDark
                                                                    ? "bg-slate-700/50 text-slate-300 border border-slate-700"
                                                                    : "bg-slate-100 text-slate-700 border border-slate-300"
                                                        }`}>
                                                            <div className={`h-1.5 w-1.5 rounded-full ${
                                                                order.fulfillmentStatus === 'fulfilled' ? 'bg-sky-500' : 'bg-slate-500'
                                                            }`}></div>
                                                            {order.fulfillmentStatus || "Processing"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}