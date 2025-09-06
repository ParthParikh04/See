document.addEventListener("DOMContentLoaded", () => {
  const readButton = document.getElementById("readButton");

  const instructionsText = `
    Welcome to See++. This app lets you interact with images and live video
    in three ways and can be selected with the buttons at the bottom of the page. 
    From left to right, they are: Text recognition, Image recognition, and Voice commands.
    Click anywhere to proceed to the app."
  `;

  readButton.addEventListener("click", () => {
    event.stopPropagation();
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(instructionsText);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis is not supported in this browser.");
    }
  });

  document.body.addEventListener("click", () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    window.location.href = "/app";
  });
});
