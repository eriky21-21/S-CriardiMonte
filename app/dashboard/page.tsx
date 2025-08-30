import Dashboard from '../../components/Dashboard'
import BatchCreator from '../../components/BatchCreator'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Dashboard />
            </div>
            <div className="lg:col-span-1">
              <BatchCreator />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
