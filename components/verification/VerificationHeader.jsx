'use client'
import { ChevronLeft } from "lucide-react";

const VerificationHeader = ({ showBack = false, onGoBack }) => (
    <div className="flex items-center justify-between mb-8 pt-5">
        {showBack ? (
            <button
                onClick={onGoBack}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
            >
                <ChevronLeft className="w-5 h-5" />Back
            </button>
        ) : (
            <div className="w-9"></div>
        )}
        <div className="w-9"></div>
    </div>
);

export default VerificationHeader;