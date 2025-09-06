document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const text = document.getElementById("text");
  const video = document.getElementById("videoFeed");
  const flipButton = document.getElementById("flip-button");
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");
  const button3 = document.getElementById("button3");
  const backButton = document.getElementById("back-button");
  const backToSplashButton = document.getElementById("backToSplash");
  const status = document.getElementById("statusText");

  let currentStream = null;
  let currentFacingMode = "environment";

  // Utility functions
  const displayError = (msg) => {
    status.style.display = "block";
    status.textContent = msg;
    text.scrollTop = text.scrollHeight;
    speakText(msg);
  };

  const speakText = (content) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopCurrentStream = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
  };

  const startWebcam = (facingMode = "environment") => {
    stopCurrentStream();
    navigator.mediaDevices.getUserMedia({ video: { facingMode } })
      .then((stream) => {
        currentStream = stream;
        video.srcObject = stream;
        video.style.display = "block";
        video.style.transform = facingMode === "user" ? "scaleX(-1)" : "scaleX(1)";
      })
      .catch((err) => {
        console.error("Webcam error:", err);
        displayError("Unable to access webcam.");
      });
  };

  const flipCamera = () => {
    currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
    startWebcam(currentFacingMode);
  };

  const setView = ({ showVideo = false, showButtons = false, showBack = false, showText = false }) => {
    window.speechSynthesis.cancel();
    video.style.display = showVideo ? "block" : "none";
    [button1, button2, button3, flipButton].forEach(btn => btn.style.display = showButtons ? "inline-flex" : "none");
    backButton.style.display = showBack ? "inline-flex" : "none";
    text.style.display = showText ? "block" : "none";
  };

  const replace = (query) => {
    setView({ showVideo: false, showButtons: false, showBack: true, showText: false });

    if (video.readyState < 2) {
      video.addEventListener("loadeddata", () => replace(query), { once: true });
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);

    fetch("/submit_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame: canvas.toDataURL("image/png"), query }),
    })
      .then(res => res.json())
      .then(result => {
        text.style.display = "block";
        text.style.maxHeight = "80vh";
        text.textContent = result.response;
        text.scrollTop = text.scrollHeight;
        speakText(result.response);
      })
      .catch(err => {
        console.error("Error:", err);
        displayError("An error occurred.");
      });
  };

  // Event listeners
  backToSplashButton.addEventListener("click", () => {
    window.speechSynthesis.cancel();
    window.location.href = "/";
  });

  button1.addEventListener("click", () =>
    replace("Give me the only text in this image without any introduction or other info.")
  );

  button2.addEventListener("click", () =>
    replace("Describe this image briefly but with necessary details. No preface.")
  );

  button3.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return displayError("Speech recognition not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    status.style.display = "block";
    status.textContent = "Listening...";

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      status.style.display = "none";
      replace(spokenText);
    };

    recognition.onerror = (event) => {
      if (event.error === "no-speech") displayError("No speech detected.");
      else displayError("Sorry, I didn't catch that. Try again.");
      setTimeout(() => { status.style.display = "none"; }, 2000);
    };

    recognition.start();
  });

  backButton.addEventListener("click", () => setView({ showVideo: true, showButtons: true }));
  flipButton.addEventListener("click", flipCamera);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") replace("Describe this image briefly but with necessary details.");
  });

  startWebcam(currentFacingMode);
});
