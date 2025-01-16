import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Play, Pause, Square, Upload } from 'lucide-react';
import { Pose } from "@mediapipe/pose";
import * as mpPose from "@mediapipe/pose";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import * as cam from "@mediapipe/camera_utils";
import axios from "axios";

interface WorkoutCameraProps {
  onVideoRecorded: (videoBlob: Blob, duration: number) => void;
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timer, setTimer] = useState(0);
  const [showCongrats, setShowCongrats] = useState(false);
  const [frameList, setFrameList] = useState<string[]>([]); 
  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setRecordedChunks([]);
    setTimer(0);
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
        analyzePose();
      }
    }
  };

  const analyzePose = () => {
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    const camera = new cam.Camera(webcamRef.current.video, {
      onFrame: async () => {
         await pose.send({ image: webcamRef.current.video });
      },
      width: 640,  
      height: 480,
    });
    camera.start();

    pose.onResults((results) => {
      if (canvasRef.current) {
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext("2d");

        if (canvasCtx) {
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

          drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 4,
          });
          drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
          canvasCtx.restore();
        }

        // Convert frame to image data and send to backend
        const frameData = canvasElement.toDataURL("image/jpeg");
        setFrameList((prevList) => [...prevList, frameData]);
        // sendFrameToBackend(frameData);
      }
    });
  };

  const handleStopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAiFeedback("Processing your recorded video...");
    }
    try {
      const response = await axios.post("http://localhost:8000/upload-frames", { frames: frameList });
      console.log("Frames uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading frames:", error);
    }
  };
  
  // Handle recordedChunks updates
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const mimeType =
        recordedChunks[0].type || "video/webm" || "video/x-matroska;codecs=avc1";
      const blob = new Blob(recordedChunks, { type: mimeType });
  
      // Call the callback with the video Blob
      onVideoRecorded(blob, timer);
      setAiFeedback(
        "AI Coach: Great form! Keep your core tight and maintain steady breathing."
      );
  
      // Show congratulatory message
      setShowCongrats(true);
      setTimeout(() => setShowCongrats(false), 5000);
    }
  }, [recordedChunks]); // Trigger when recordedChunks updates

  

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLive(false);
      // Get video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        setTimer(duration);
        onVideoUploaded(file);
        setAiFeedback('AI Coach: Analyzing uploaded workout video...');
        setShowCongrats(true);
        setTimeout(() => {
          setAiFeedback('AI Coach: Good form overall. Focus on keeping your back straight during squats.');
          setTimeout(() => setShowCongrats(false), 5000);
        }, 2000);
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Timer Display */}
        <div className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-full text-white font-mono text-xl">
          {formatTime(timer)}
        </div>

        {isLive ? (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            audio={false}
            className="w-full rounded-lg shadow-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            width="640"
            height="480"
          ></canvas>
        </div>
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

      {/* Congratulations Popup */}
      {showCongrats && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-lg p-8 shadow-xl transform animate-bounce">
            <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Congratulations!</h3>
            <p className="text-gray-700 text-lg">
              You've completed {formatTime(timer)} of workout!
              <br />
              Keep up the great work! 💪
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutCamera;