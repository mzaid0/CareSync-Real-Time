const AuthLeftContent = () => {
    return (
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 p-8 flex flex-col justify-center">
            <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                    Welcome to <span className="text-green-400">CareCollab</span>
                </h1>
                <p className="text-gray-600 mb-6">
                    Your collaborative platform for seamless care coordination, schedule management, and real-time team communication.
                </p>

                {["Coordinate care tasks efficiently", "Manage schedules in real-time", "Stay connected with your care team"].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 mb-4">
                        <div className="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <p className="text-gray-700">{item}</p>
                    </div>
                ))}

                <div className="mt-8 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Tip:</span> Use your organization email if you're part of a care team. Contact support if you need help accessing your account.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLeftContent;
