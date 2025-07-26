import Header from "@/components/Header";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 pt-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Secure File
              <span className="text-blue-600"> Storage</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload, manage, and store your files safely in the cloud. Access
              your documents from anywhere with enterprise-grade security.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🚀 Start Free
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-lg text-lg font-medium border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              👤 Sign In
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Storage
              </h3>
              <p className="text-gray-600 text-sm">
                Your files are encrypted and stored with enterprise-grade
                security standards.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☁️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cloud Access
              </h3>
              <p className="text-gray-600 text-sm">
                Access your files from any device, anywhere in the world,
                anytime.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Fast Upload
              </h3>
              <p className="text-gray-600 text-sm">
                Lightning-fast upload speeds with drag-and-drop simplicity.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
