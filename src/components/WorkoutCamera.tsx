import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Play, Pause, Square, Upload } from 'lucide-react';

interface WorkoutCameraProps {
  onVideoRecorded: (videoBlob: Blob) => void;
  onVideoUploaded: (file: File) => void;
}

const WorkoutCamera: React.FC<WorkoutCameraProps> = ({ 
  onVideoRecorded, 
  onVideoUploaded
}) => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLive, setIsLive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setAiFeedback('AI Coach: Analyzing your live workout...');
      }
    }
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      onVideoRecorded(blob);
      setAiFeedback('AI Coach: Great form! Keep your core tight and maintain steady breathing.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLive(false);
      onVideoUploaded(file);
      setAiFeedback('AI Coach: Analyzing uploaded workout video...');
      setTimeout(() => {
        setAiFeedback('AI Coach: Good form overall. Focus on keeping your back straight during squats.');
      }, 2000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-2xl mx-auto">
        {isLive ? (
          <Webcam
            ref={webcamRef}
            audio={false}
            className="w-full rounded-lg shadow-lg"
          />
        ) : (
          <div className="w-full h-[400px] bg-gray-100 rounded-lg shadow-lg flex items-center justify-center">
            <p className="text-gray-500">Uploaded video will be processed here</p>
          </div>
        )}
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
          {!isRecording ? (
            <>
              <button
                onClick={handleStartRecording}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
                title="Start Recording"
              >
                <Play size={24} />
              </button>
              <button
                onClick={triggerFileUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full"
                title="Upload Video"
              >
                <Upload size={24} />
              </button>
            </>
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/*"
        className="hidden"
      />

      {aiFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-blue-800 font-medium">{aiFeedback}</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutCamera;