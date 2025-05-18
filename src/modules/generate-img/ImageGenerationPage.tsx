import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { instance } from "../../config,axios";
import { getSub } from "../authentication/util/auth.helper";
import { useNavigate } from "react-router-dom";

const ImageGenerationPage = () => {
  const subject = getSub();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [prompts, setPrompts] = useState<{prompt:string}[]>([]);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
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

  /* 
   -----------------------------
   Voice to Text Module
   -----------------------------
  */
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition>(null);

  const startListening = () => {
    if (!recognitionRef.current) {
      console.error(
        "SpeechRecognition is not available. Ensure your browser supports it."
      );
      return;
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (!recognitionRef.current) {
      console.error(
        "SpeechRecognition instance is not available. Ensure your browser supports it."
      );
      return;
    }
    setIsListening(false);
    recognitionRef.current.stop();
  };

  /* 
   -----------------------------
    UseEffect
   -----------------------------
  */
  useEffect(() => {
    if (subject) {
      fetchPrompts();
    }

    /* Voice to Text */
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1][0].transcript;
      setValue("prompt", result);
    };

    recognitionRef.current = recognition;

    // cleanups
    return () => {
      recognition.abort();
    };
  }, [imageUrl, subject]);

  const isSupported =
    !!window.SpeechRecognition || !!window.webkitSpeechRecognition;

  if (!isSupported) {
    return (
      <p>Your browser doesn't support voice search. Please type your query.</p>
    );
  }

  /* Form submission functionality */
  const onSubmit = async (data: unknown | { prompt: string }) => {
    setLoading(true);
    const prompt = (data as { prompt: string }).prompt;
    try {
      const response = await instance.post("/image/generate_image", { prompt });
      const image = response.data.image_url;
      setImageUrl(image);
      setValue("prompt", "");

      // Add the new prompt to the list
      await instance.post("/user/track_prompt", { username: subject, prompt });
      fetchPrompts();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* Logout functionality */
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
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Logout
            </button>
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
                      <div className="d-flex gap-4">
                        <button
                          onClick={startListening}
                          disabled={isListening}
                          className="mic-button"
                        >
                          🎙️ Start Voice Search
                        </button>

                        <button
                          onClick={stopListening}
                          disabled={!isListening}
                          className="stop-button"
                        >
                          🛑 Stop
                        </button>

                        <p
                          style={{
                            fontSize: "18px",
                            marginTop: "20px",
                            color: "#333",
                          }}
                        ></p>
                      </div>
                      {errors.textareaField && (
                        <span className="text-danger">
                          This field is required
                        </span>
                      )}
                    </div>
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
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="my-4">Generated Image</h5>

                      <a
                        href={imageUrl}
                        target="_blank"
                        download="my-picture.jpg"
                      >
                        <button className="btn btn-success btn-sm">Download</button>
                      </a>
                    </div>
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
