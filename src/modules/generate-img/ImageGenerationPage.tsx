import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { instance } from "../../config,axios";
import { getSub } from "../authentication/util/auth.helper";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ImageGenerationPage = () => {
  const subject = getSub();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const audioChunks = useRef<Blob[]>([]);

  const navigate = useNavigate();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedBlob(audioUrl);
        audioChunks.current = [];
        stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchPrompts = async () => {
    try {
      const response = await instance.get(`/user/get_prompts/${subject}`);
      setPrompts(response.data.prompts);
    } catch (error) {
      console.error("Error fetching prompts:", error);
    }
  };

  useEffect(() => {
    if (subject) {
      fetchPrompts();
    }
  }, [imageUrl, subject]);

  const onSubmit = async (data: unknown | { prompt: string }) => {
    setLoading(true);
    const prompt = (data as { prompt: string }).prompt;
    try {
      const response = await instance.post("/image/generate_image", { prompt });
      const image = response.data.image_url;
      setImageUrl(image);

      // Add the new prompt to the list
      await instance.post("/user/track_prompt", { username: subject, prompt });
      fetchPrompts();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="bg-light container p-4" style={{ height: "100vh" }}>
      <nav className="bg-white w-100 p-3 mb-4">
        <div className="d-flex justify-content-between">
          <div style={{ fontSize: "1.2rem" }}>AI Image Gen</div>
          <div>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="row">
        <div className="col-md-8">
          <div className="d-flex align-items-center">
            <div className="card py-2" style={{ width: "100%" }}>
              <div className="card-body">
                <div className="card-title">
                  <h3>Hello, {subject}</h3>
                  <h6>How can I help you today?</h6>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-3">
                    <div className="textarea-container">
                      <textarea
                        className="voice-textarea form-control w-100"
                        {...register("prompt", { required: true })}
                        style={{ resize: "none" }}
                      />
                      <button
                        className="mic-button"
                        onClick={startRecording}
                        disabled={isRecording}
                      >
                        <FaMicrophone color={isRecording ? "red" : "black"} />
                      </button>
                      <button
                        className="stop-button"
                        onClick={stopRecording}
                        disabled={!isRecording}
                      >
                        Stop
                      </button>
                      {errors.textareaField && (
                        <span className="text-danger">
                          This field is required
                        </span>
                      )}
                    </div>
                    {/* {recordedBlob && (
                      <audio controls src={recordedBlob}>
                        Your browser does not support the audio element.
                      </audio>
                    )} */}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-gradient w-100 my-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        <span className="ms-2">Loading...</span>
                      </>
                    ) : (
                      "Generate"
                    )}
                  </button>
                </form>
                <hr></hr>
                {imageUrl && (
                  <div>
                    <h5 className="my-4">Generated Image</h5>
                    <img
                      src={imageUrl}
                      className="img-fluid"
                      alt="Generated"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card py-2" style={{ width: "100%" }}>
            <div className="card-body">
              <div className="card-title">Your prompts history</div>
              <hr />
              <ul>
                {prompts.map((prompt, index) => (
                  <li key={index}>{prompt.prompt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerationPage;
