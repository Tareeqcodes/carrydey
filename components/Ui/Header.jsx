const Header = ({ showBack = false, onGoBack }) => (
    <div className="flex items-center justify-between mb-8 pt-5">
        {showBack ? (
            <button
                onClick={onGoBack}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all"
            >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </button>
        ) : (
            <div className="w-9"></div>
        )}
        <div className='flex-1 text-center'>
            <div className="text-3xl font-bold text-orange-600">Sendr</div>
            <p>Send Smarter.</p>
            <p>Travel Richer.</p>
        </div>
        <div className="w-9"></div>
    </div>
);

export default Header;