document.addEventListener("DOMContentLoaded", function () {
  const text = document.getElementById("text");
  const video = document.getElementById("videoFeed");
  const flipButton = document.getElementById("flip-button");
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");
  const button3 = document.getElementById("button3");
  const backButton = document.getElementById("back-button");

  let currentStream = null;
  let currentFacingMode = "environment";

  function displayError(message) {
    text.style.display = "block";
    text.textContent = message;
    text.scrollTop = text.scrollHeight;
    speakText(message);
  }

  function stopCurrentStream() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
  }

  function startWebcam(facingMode = "environment") {
    stopCurrentStream();

    navigator.mediaDevices.getUserMedia({ video: { facingMode } })
      .then((stream) => {
        currentStream = stream;
        video.srcObject = stream;
        video.style.display = "block";
        video.style.transform = facingMode === "user" ? "scaleX(-1)" : "scaleX(1)";
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        displayError("Unable to access webcam.");
      });
  }

  function flipCamera() {
    currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
    startWebcam(currentFacingMode);
  }

  function speakText(textContent) {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(textContent);
      window.speechSynthesis.speak(utterance);
    }
  }

  function show() {
    window.speechSynthesis.cancel();
    video.style.display = "block";
    button1.style.display = "inline-flex";
    button2.style.display = "inline-flex";
    button3.style.display = "inline-flex";
    flipButton.style.display = "inline-flex";
    backButton.style.display = "none";
    text.style.display = "none";
  }

  function replace(query) {
    window.speechSynthesis.cancel();
    video.style.display = "none";
    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";
    flipButton.style.display = "none";
    backButton.style.display = "inline-flex";
    text.style.display = "none";

    if (video.readyState < 2) {
      video.addEventListener("loadeddata", () => replace(query), { once: true });
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");

    fetch("/submit_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame: dataURL, query: query }),
    })
      .then((response) => response.json())
      .then((result) => {
        text.style.display = "block";
        text.textContent = result.response;
        text.scrollTop = text.scrollHeight;
        speakText(result.response);
      })
      .catch((error) => {
        console.error("Error:", error);
        displayError("An error occurred.");
      });
  }

  // Event listeners
  button1.addEventListener("click", () => 
    replace("Give me the only text in this image without any introduction or any other information.")
  );

  button2.addEventListener("click", () => 
    replace("Describe this image briefly but with necessary details. Do not give any preface. Just give me the description.")
  );

  button3.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      displayError("Speech recognition is not supported in this browser.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    // Show listening message
    text.style.display = "block";
    text.textContent = "Listening...";
    text.scrollTop = text.scrollHeight;
    console.log("Listening...");
  
    recognition.onresult = function (event) {
      const spokenText = event.results[0][0].transcript;
      console.log("Heard:", spokenText);
  
      // Give time for "Listening..." to render
      setTimeout(() => replace(spokenText), 100);
    };
  
    recognition.onerror = function (event) {
      if (event.error === "no-speech") {
        displayError("No speech detected.");
      } else {
        console.error("Speech recognition error:", event.error);
        displayError("Sorry, I didn't catch that. Try again.");
      }
    };
  
    recognition.onend = function () {
      console.log("Speech recognition ended.");
    };
  
    recognition.start();
  });  

  backButton.addEventListener("click", show);
  flipButton.addEventListener("click", flipCamera);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      replace("Describe this image briefly but with necessary details.");
    }
  });

  startWebcam(currentFacingMode);
});
