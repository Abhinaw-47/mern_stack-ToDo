import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 

export function TermsAndConditions() {
    return (
        <div className="min-h-screen font-display w-full flex flex-col bg-red-50 justify-center items-center">
            <Link to="/signup" className="flex m-8 p-2 items-center hover:bg-jade-400 rounded-2xl hover:cursor-pointer">
                <FaArrowLeft className="text-gray-800 cursor-pointer" />
                <p className="px-4">Go back to the Sign Up page</p>
            </Link>
        
            <p  className="p-12 border-2 border-gray-800 border-solid"
               
                width="480"
                height="480"
                title="giphy-embed"
                allowFullScreen>
                    <p>1.Account Responsibility: Users are responsible for maintaining the confidentiality of their account credentials. They must notify the app's support team immediately of any unauthorized use of their account.</p>
                    <p>2.Data Ownership: Users retain ownership of the data they input into the app, including to-do lists and associated information. The app respects user privacy and does not share personal data with third parties without explicit consent, except as required by law.</p>
                    <p>3.Acceptable Use: Users agree not to use the app for any unlawful purposes or in a manner that could harm the app or its users. This includes but is not limited to spamming, distributing malware, or engaging in activities that violate the app's terms of service.</p>
                    <p>  4.Data Deletion: Users can delete their to-dos and associated data at any time. Deleted data may remain in backups for a reasonable period before being permanently erased. The app takes reasonable measures to securely store and handle user data in accordance with applicable laws and regulations.</p>
                
      
            </p>
        </div>
    );
}
