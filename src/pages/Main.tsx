import  { useState,useEffect } from 'react';
import { Dumbbell, Activity, Video, BarChart3, LogOut } from 'lucide-react'; //RefreshCw
import WorkoutCamera from '../components/WorkoutCamera';
import ProgressChart from '../components/ProgressChart';
import WorkoutCard from '../components/WorkoutCard';
import Dashboard from '../components/Dashboard';
import type { Exercise, WorkoutSession, UserProgress } from '../types';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

function Main() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'analysis' | 'progress'>('dashboard');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [Progress, setProgress] = useState<UserProgress>({
    workoutsCompleted: 0,
    totalMinutes: 0,
    averageAccuracy: 0,
    streak: 0
  });
  const [fullname,Setfullname] = useState('');
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear local storage
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    // Navigate to home page
    navigate('/');
  };

  const handleVideoRecorded = async (videoBlob: Blob, duration: number) => {
    try {
      const formData = new FormData();
      formData.append('video', videoBlob, 'workout.webm');
      console.log(duration);
      const progressData = {
        workouts: 1,
        duration: Math.floor(duration / 60), // Convert seconds to minutes
        accuracy: 85,
        streak: 1
      };
      updateProgress(progressData);
      // const response = await axios.post('http://localhost:8000/api/analyze-workout', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${localStorage.getItem('email')}`,
      //   },
      // });
      console.log(progressData);
      // await updateProgress(progressData);
    } catch (error) {
      console.error('Failed to analyze workout video:', error);
    }
  };

  const handleVideoUploaded = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      const response = await axios.post('http://localhost:8000/api/analyze-workout', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('email')}`,
        },
      });

      // Get video duration and update progress
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = async () => {
        const duration = Math.floor(video.duration);
        const progressData = {
          duration: Math.floor(duration / 60), // Convert seconds to minutes
          accuracy: response.data.accuracy || 85,
          type: selectedExercise?.type || 'strength'
        };

        // await updateProgress(progressData);
      };
      
      video.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Failed to analyze uploaded video:', error);
    }
  };

  const updateProgress = async (progressData: {workouts:number, duration: number; accuracy: number; streak:number }) => {
    try {

      setProgress(prevState => ({
        ...prevState,
        workoutsCompleted: prevState.workoutsCompleted + progressData.workouts,
        averageAccuracy: parseFloat(((prevState.averageAccuracy + progressData.accuracy) / 100).toFixed(2)),
        totalMinutes: prevState.totalMinutes + progressData.duration,
        streak: prevState.streak + progressData.streak,
      }))
      const token = localStorage.getItem('email');
      console.log(Progress);
      // Update progress in the backend
      const response = await axios.post('http://localhost:8000/api/update_progress', {"progress":Progress,"email":token})
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('email');
        const rawName = localStorage.getItem('name');
        const name = rawName ? rawName.trim() : "";
        Setfullname(name);
        const response = await axios.get('http://localhost:8000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSessions(response.data.workout_sessions);
        setProgress(response.data.user_progress);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);



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
            <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="mr-2" size={20} />
                Sign Out
              </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Welcome Back {fullname}!</h2>
            <Dashboard progress={Progress} />
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
            <WorkoutCamera 
              onVideoRecorded={handleVideoRecorded}
              onVideoUploaded={handleVideoUploaded}
            />
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
              <ProgressChart data={sessions} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Main;