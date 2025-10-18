"use client";

import { ResidentSidebar } from "@/components/resident-sidebar";
import HouseholdResidentForm from "@/components/HouseholdResidentForm";

export default function ResidentFormPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:block md:w-1/4 bg-white border-r">
        <ResidentSidebar />
      </div>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <HouseholdResidentForm />
        </div>
      </div>
    </div>
  );
}
