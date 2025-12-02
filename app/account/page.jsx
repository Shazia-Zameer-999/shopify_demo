"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

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

    // Redirect unauthenticated users to login
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/account");
        }
    }, [status, router]);


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



    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
                Loading your account...
            </div>
        );
    }


    // While redirecting, don't flash content
    if (!session) return null;

    const user = session.user;

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
        <div className="min-h-screen bg-slate-950 py-10 px-4">
            <div className="mx-auto w-full max-w-5xl space-y-8">
                {/* Heading */}
                <div>
                    <h1 className="text-3xl font-bold text-slate-100 mb-2">
                        My Account
                    </h1>
                    <p className="text-sm text-slate-400">
                        View and manage your profile, password, and future orders.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
                    {/* Profile card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30">
                        <h2 className="text-lg font-semibold text-slate-100 mb-4">
                            Profile
                        </h2>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
                                    Name
                                </p>
                                <p className="text-slate-100">
                                    {user.name || "No name set"}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
                                    Email
                                </p>
                                <p className="text-slate-100">
                                    {user.email || "No email available"}
                                </p>
                            </div>

                            {user.shopifyCustomerId && (
                                <div>
                                    <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">
                                        Shopify Customer ID
                                    </p>
                                    <p className="text-[11px] text-slate-300 break-all">
                                        {user.shopifyCustomerId}
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="mt-4 text-xs text-slate-500">
                            Later we can add address book, order history, and preferences here.
                        </p>
                    </div>

                    {/* Password change card */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30">
                        <h2 className="text-lg font-semibold text-slate-100 mb-2">
                            Security
                        </h2>
                        <p className="text-xs text-slate-400 mb-4">
                            Change your password to keep your account secure.
                        </p>

                        {error && (
                            <div className="mb-3 rounded-lg border border-rose-500/60 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
                                {error}
                            </div>
                        )}

                        {msg && (
                            <div className="mb-3 rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200">
                                {msg}
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Current password
                                </label>
                                <input
                                    type="password"
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                                    placeholder="••••••••"
                                    value={form.currentPassword}
                                    onChange={(e) =>
                                        setForm({ ...form, currentPassword: e.target.value })
                                    }
                                />
                                <p className="mt-1 text-[10px] text-slate-500">
                                    If you signed up with Google/GitHub and never set a password,
                                    you can leave this empty and just choose a new one.
                                </p>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        New password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                                        placeholder="••••••••"
                                        value={form.newPassword}
                                        onChange={(e) =>
                                            setForm({ ...form, newPassword: e.target.value })
                                        }
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-300 mb-1">
                                        Confirm new password
                                    </label>
                                    <input
                                        type="password"
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                                        placeholder="••••••••"
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
                                className="mt-2 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:from-sky-400 hover:to-blue-500 hover:shadow-sky-500/60 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                {loading ? "Updating..." : "Update password"}
                            </button>
                        </form>
                    </div>
                </div>
                {/* My Orders card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-black/30">
                    <h2 className="text-lg font-semibold text-slate-100 mb-2">
                        My Orders
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">
                        View your recent orders placed through this store.
                    </p>

                    {ordersLoading && (
                        <p className="text-sm text-slate-300">Loading orders...</p>
                    )}

                    {ordersError && (
                        <p className="text-xs text-rose-300 mb-2">{ordersError}</p>
                    )}

                    {!ordersLoading && !ordersError && orders.length === 0 && (
                        <p className="text-sm text-slate-400">
                            You have not placed any orders yet.
                        </p>
                    )}

                    {!ordersLoading && orders.length > 0 && (
                        <div className="space-y-3">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                >
                                    <div>
                                        <p className="font-medium text-slate-100">
                                            {order.name}{" "}
                                            <span className="text-xs text-slate-500">
                                                • {order.currency} {order.totalPrice}
                                            </span>
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Placed on{" "}
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-1">
                                        <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
                                            Payment: {order.financialStatus || "N/A"}
                                        </span>
                                        <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
                                            Fulfillment: {order.fulfillmentStatus || "Unfulfilled"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}