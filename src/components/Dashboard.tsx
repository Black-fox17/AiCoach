import React from 'react';
import { Activity, Flame, Calendar, Trophy, Clock , Target} from 'lucide-react';
import type { UserProgress } from '../types';

interface DashboardProps {
  progress: UserProgress;
}

const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Activity className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500">Workouts</p>
            <h3 className="text-2xl font-bold">{progress.workoutsCompleted}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Clock className="text-green-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500">Total Minutes</p>
            <h3 className="text-2xl font-bold">{progress.totalMinutes}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <Target className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500">Avg. Accuracy</p>
            <h3 className="text-2xl font-bold">{progress.averageAccuracy}%</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Flame className="text-orange-600" size={24} />
          </div>
          <div>
            <p className="text-gray-500">Streak</p>
            <h3 className="text-2xl font-bold">{progress.streak} days</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;