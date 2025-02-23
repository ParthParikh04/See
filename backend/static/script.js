document.addEventListener("DOMContentLoaded", function () {
  const text = document.getElementById("text");
  const video = document.getElementById("videoFeed");
  const flipButton = document.getElementById("flip-button");
  const button1 = document.getElementById("button1");
  const button2 = document.getElementById("button2");
  const button3 = document.getElementById("button3");
  const backButton = document.getElementById("back-button");

  let currentStream = null;
  let currentFacingMode = "environment"; // Default to rear camera

  // Stop any active video stream
  function stopCurrentStream() {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
    }
  }

  // Start the webcam with specified facing mode
  function startWebcam(facingMode = "environment") {
    stopCurrentStream();

    navigator.mediaDevices.getUserMedia({ video: { facingMode } })
      .then((stream) => {
        currentStream = stream;
        video.srcObject = stream;
        video.style.display = "block";
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
        text.textContent = "Unable to access webcam.";
      });
  }

  // Flip camera function
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

  // ✅ Updated show function to stop speech when back arrow is clicked
  function show() {
    window.speechSynthesis.cancel(); // 🛑 Stop any ongoing speech
    video.style.display = "block";
    button1.style.display = "inline-flex";
    button2.style.display = "inline-flex";
    button3.style.display = "inline-flex";
    flipButton.style.display = "inline-flex";
    backButton.style.display = "none";
    text.style.display = "none";
  }

  function replace() {
    window.speechSynthesis.cancel(); // 🛑 Stop speech before starting new one
    video.style.display = "none";
    button1.style.display = "none";
    button2.style.display = "none";
    button3.style.display = "none";
    flipButton.style.display = "none";
    backButton.style.display = "inline-flex";
    text.style.display = "block";

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL("image/png");

    fetch("/submit_query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frame: dataURL, query: "Describe this image briefly but with necessary details." }),
    })
      .then((response) => response.json())
      .then((result) => {
        text.textContent = result.response;
        speakText(result.response); // Start speech after getting the response
      })
      .catch((error) => {
        console.error("Error:", error);
        text.textContent = "An error occurred.";
      });
  }

  // ✅ Event listeners
  button1.addEventListener("click", replace);
  button2.addEventListener("click", replace);
  button3.addEventListener("click", replace);
  backButton.addEventListener("click", show);
  flipButton.addEventListener("click", flipCamera);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      replace();
    }
  });

  // Start with rear camera by default
  startWebcam(currentFacingMode);
});
