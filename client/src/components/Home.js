import { Calendar, Clock, User, Users, History } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to AppointmentX</h1>
        <p className="text-lg text-gray-600">Streamlined scheduling for service providers and clients</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Section */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <User className="h-6 w-6" />
              Client Features
            </h2>
            <p className="text-gray-600 mt-1">Everything you need as a client</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Browse available appointment slots
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Schedule and reschedule appointments
            </li>
            <li className="flex items-center gap-2">
              <History className="h-4 w-4 text-blue-500" />
              View appointment history
            </li>
          </ul>
        </div>

        {/* Provider Section */}
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="mb-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Users className="h-6 w-6" />
              Provider Features
            </h2>
            <p className="text-gray-600 mt-1">Tools to manage your services</p>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" />
              Set and update availability
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              View upcoming appointments
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-green-500" />
              Manage client bookings
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Create an account to get started with AppointmentX
        </p>
      </div>
    </div>
  );
};

export default Home;