import React from 'react';
import type { Exercise } from '../types';
import { Clock, Dumbbell, Target } from 'lucide-react';

interface WorkoutCardProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ exercise, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={exercise.imageUrl}
        alt={exercise.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{exercise.name}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Dumbbell size={16} />
          <span className="capitalize">{exercise.type}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <Target size={16} />
          <span>{exercise.targetMuscles.join(', ')}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Clock size={16} />
          <span className="capitalize">{exercise.difficulty}</span>
        </div>
        <button
          onClick={() => onSelect(exercise)}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Start Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutCard;