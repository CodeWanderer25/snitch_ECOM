
import { useNavigate } from "react-router";
import {
    User,
    Mail,
    ShieldCheck,
    CheckCircle,
    ArrowLeft,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";

const Profile = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    const userInitial = user.name
        ? user.name.charAt(0).toUpperCase()
        : "U";

    const formattedRole = user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User";

    // const handleLogout = async () => {
    //     await logout();
    //     navigate("/login", { replace: true });
    // };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Main Container */}
            <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                
                <button onClick={() => navigate("/")} className="mb-6 inline-flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:bg-slate-800 hover:text-white" > <ArrowLeft size={17} /> Back to Dashboard </button>

                {/* Page Header */}
                <div className="mb-8">
                    <p className="mb-2 text-sm font-medium text-indigo-400">
                        Account
                    </p>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        My Profile
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Manage your personal information and account settings.
                    </p>
                </div>

                {/* Profile Header Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

               
                    <div className="border-b border-slate-800  from-slate-900 via-slate-900 to-indigo-950/40 p-6 sm:p-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                      
                            <div className="flex items-center gap-5">

               
                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold shadow-lg shadow-indigo-600/20">
                                    {userInitial}
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold">
                                        {user.name}
                                    </h2>

                                    <p className="mt-1 text-slate-400">
                                        {user.email}
                                    </p>

                                    <div className="mt-3">
                                        <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-400">
                                            <ShieldCheck size={15} />
                                            {formattedRole}
                                        </span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Account Information */}
                    <div className="p-6 sm:p-8">

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold">
                                Personal Information
                            </h3>

                            <p className="mt-1 text-sm text-slate-400">
                                Your basic account information.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">

                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                                <div className="mb-3 flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                                        <User size={18} />
                                    </div>

                                    <p className="text-sm text-slate-400">
                                        Full Name
                                    </p>
                                </div>

                                <p className="text-lg font-semibold">
                                    {user.name}
                                </p>
                            </div>

                       
                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                                <div className="mb-3 flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                                        <Mail size={18} />
                                    </div>

                                    <p className="text-sm text-slate-400">
                                        Email Address
                                    </p>
                                </div>

                                <p className="break-all text-lg font-semibold">
                                    {user.email}
                                </p>
                            </div>

                  
                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                                <div className="mb-3 flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                                        <ShieldCheck size={18} />
                                    </div>

                                    <p className="text-sm text-slate-400">
                                        Account Role
                                    </p>
                                </div>

                                <p className="text-lg font-semibold capitalize">
                                    {user.role}
                                </p>
                            </div>

                   
                            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                                <div className="mb-3 flex items-center gap-3">

                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                        <CheckCircle size={18} />
                                    </div>

                                    <p className="text-sm text-slate-400">
                                        Account Status
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                                    <p className="text-lg font-semibold text-emerald-400">
                                        Active
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </main>
        </div>
    );
};

export default Profile;

