'use client';
import { User } from "lucide-react";
import { useAuth } from "@/context/Authcontext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
        <User size={24} className="text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-lg">Tariq</h3>
        <p className="text-gray-600">{user?.email}</p>
        <p className="text-sm text-gray-500">+23412345678899</p>
      </div>
    </div>
  )
}
