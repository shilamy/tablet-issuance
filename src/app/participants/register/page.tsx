"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Save
} from "lucide-react";
import Layout from "@/components/Layout";
import { cn } from "@/lib/utils";

export default function RegisterParticipant() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: "",
        idNumber: "",
        role: "Enumerator",
        email: "",
        phone: "",
        location: "",
        activity: "Household Survey",
        division: "",
        startDate: new Date().toISOString().split('T')[0],
        expectedReturnDate: "",
        notes: ""
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.idNumber.trim()) newErrors.idNumber = "ID Number is required";
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.location.trim()) newErrors.location = "Location/Region is required";
        if (!formData.expectedReturnDate) newErrors.expectedReturnDate = "Expected return date is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("Registering participant:", formData);
            router.push("/participants");
        } catch (error) {
            console.error("Error registering participant:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3 mb-6">
                    <Link
                        href="/participants"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Register Participant</h1>
                        <p className="text-sm text-gray-500">Register a new participant for tablet issuance</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-knbs-600" />
                                Personal Details
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. John Doe"
                                    className={cn(
                                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500",
                                        errors.name ? "border-red-300 focus:ring-red-200" : "border-gray-300"
                                    )}
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">ID / Payroll Number</label>
                                <input
                                    type="text"
                                    name="idNumber"
                                    value={formData.idNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. 12345678"
                                    className={cn(
                                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500",
                                        errors.idNumber ? "border-red-300 focus:ring-red-200" : "border-gray-300"
                                    )}
                                />
                                {errors.idNumber && <p className="text-xs text-red-500">{errors.idNumber}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Role / Title</label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                >
                                    <option value="Enumerator">Enumerator</option>
                                    <option value="Supervisor">Supervisor</option>
                                    <option value="Coordinator">Coordinator</option>
                                    <option value="Data Clerk">Data Clerk</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Mail className="w-5 h-5 text-knbs-600" />
                                Contact Information
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500",
                                            errors.email ? "border-red-300 focus:ring-red-200" : "border-gray-300"
                                        )}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+254 7..."
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500",
                                            errors.phone ? "border-red-300 focus:ring-red-200" : "border-gray-300"
                                        )}
                                    />
                                </div>
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Location / Region</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Nairobi, Westlands"
                                        className={cn(
                                            "w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500",
                                            errors.location ? "border-red-300 focus:ring-red-200" : "border-gray-300"
                                        )}
                                    />
                                </div>
                                {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-knbs-600" />
                                Assignment Details
                            </h2>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Activity / Survey</label>
                                <select
                                    name="activity"
                                    value={formData.activity}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                >
                                    <option value="Household Survey">Household Survey</option>
                                    <option value="Agricultural Census">Agricultural Census</option>
                                    <option value="Business Survey">Business Survey</option>
                                    <option value="Population Census">Population Census</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Division / Department</label>
                                <input
                                    type="text"
                                    name="division"
                                    value={formData.division}
                                    onChange={handleChange}
                                    placeholder="e.g. IT Department"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Expected Return Date</label>
                                <input
                                    type="date"
                                    name="expectedReturnDate"
                                    value={formData.expectedReturnDate}
                                    onChange={handleChange}
                                    className={cn(
                                        "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500",
                                        errors.expectedReturnDate ? "border-red-300 focus:ring-red-200" : "border-gray-300"
                                    )}
                                />
                                {errors.expectedReturnDate && <p className="text-xs text-red-500">{errors.expectedReturnDate}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Notes (Optional)</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-knbs-500 resize-none"
                                    placeholder="Additional notes about this participant..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4">
                        <Link
                            href="/participants"
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                                "flex items-center justify-center px-4 py-2 bg-knbs-600 text-white rounded-lg text-sm font-medium hover:bg-knbs-700 transition-colors shadow-sm min-w-[120px]",
                                isSubmitting && "opacity-75 cursor-not-allowed"
                            )}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Register Participant
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}