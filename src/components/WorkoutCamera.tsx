import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Play, Pause, Square } from 'lucide-react';

interface WorkoutCameraProps {
  onVideoRecorded: (videoBlob: Blob) => void;
}

const WorkoutCamera: React.FC<WorkoutCameraProps> = ({ onVideoRecorded }) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);

  const handleStartRecording = () => {
    setRecordedChunks([]);
    if (webcamRef.current) {
      const stream = webcamRef.current.video?.srcObject as MediaStream;
      if (stream) {
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Combine recorded chunks and send to parent
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onVideoRecorded(blob);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Webcam
        ref={webcamRef}
        audio={false}
        className="w-full rounded-lg shadow-lg"
      />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
          >
            <Play size={24} />
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsRecording(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full"
            >
              <Pause size={24} />
            </button>
            <button
              onClick={handleStopRecording}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
            >
              <Square size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WorkoutCamera;