import React, { useState } from 'react';
import { Dumbbell, Activity, Video, BarChart3 } from 'lucide-react';
import WorkoutCamera from '../components/WorkoutCamera';
import ProgressChart from '../components/ProgressChart';
import WorkoutCard from '../components/WorkoutCard';
import Dashboard from '../components/Dashboard';
import type { Exercise, WorkoutSession, UserProgress } from '../types';

// Mock data - replace with actual API calls
const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Push-ups',
    type: 'strength',
    difficulty: 'intermediate',
    targetMuscles: ['chest', 'shoulders', 'triceps'],
    description: 'Classic push-up exercise for upper body strength',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Squats',
    type: 'strength',
    difficulty: 'beginner',
    targetMuscles: ['quadriceps', 'hamstrings', 'glutes'],
    description: 'Basic squat movement for lower body strength',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop'
  }
];

const mockProgress: UserProgress = {
  workoutsCompleted: 24,
  totalMinutes: 720,
  averageAccuracy: 85,
  streak: 5
};

const mockSessions: WorkoutSession[] = [
  { id: '1', date: '2024-03-01', type: 'strength', duration: 30, calories: 150, accuracy: 82 },
  { id: '2', date: '2024-03-02', type: 'cardio', duration: 45, calories: 300, accuracy: 88 },
  { id: '3', date: '2024-03-03', type: 'strength', duration: 40, calories: 200, accuracy: 85 }
];

function Main() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'analysis' | 'progress'>('dashboard');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleVideoRecorded = async (videoBlob: Blob) => {
    // TODO: Send to your FastAPI backend for analysis
    console.log('Video recorded, size:', videoBlob.size);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Dumbbell className="text-blue-600" size={32} />
              <span className="ml-2 text-xl font-bold">AI Fitness Coach</span>
            </div>
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'dashboard' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <Activity className="mr-2" size={20} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('workout')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'workout' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <Video className="mr-2" size={20} />
                Workout
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex items-center px-3 py-2 text-sm font-medium ${
                  activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
                }`}
              >
                <BarChart3 className="mr-2" size={20} />
                Progress
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <Dashboard progress={mockProgress} />
            <div>
              <h3 className="text-xl font-semibold mb-4">Recommended Workouts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockExercises.map((exercise) => (
                  <WorkoutCard
                    key={exercise.id}
                    exercise={exercise}
                    onSelect={(ex) => {
                      setSelectedExercise(ex);
                      setActiveTab('workout');
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {selectedExercise ? `Workout: ${selectedExercise.name}` : 'Start a Workout'}
              </h2>
            </div>
            <WorkoutCamera onVideoRecorded={handleVideoRecorded} />
            {selectedExercise && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-4">Exercise Details</h3>
                <p className="text-gray-600 mb-4">{selectedExercise.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700">Target Muscles</h4>
                    <p className="text-gray-600">{selectedExercise.targetMuscles.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700">Difficulty</h4>
                    <p className="text-gray-600 capitalize">{selectedExercise.difficulty}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Your Progress</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Workout History</h3>
              <ProgressChart data={mockSessions} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Main;