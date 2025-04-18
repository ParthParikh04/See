# See++

**See++** is a web app that lets users analyze their surroundings using a webcam, voice input, and AI — powered by Google's Gemini multimodal model. You can ask questions by clicking a button or speaking, and See++ will respond with both on-screen and spoken answers.

---

## 🚀 Features

- 📷 Uses your webcam to capture live images  
- 🔊 Converts AI responses to speech  
- 🗣️ Accepts spoken input through voice recognition  
- 🔄 Flip between front and rear cameras  
- 🧠 Sends queries and images to Gemini for intelligent answers  

---

## ⚙️ How to Set It Up (Step-by-Step)

### 1. Clone this repository

```bash
git clone https://github.com/ParthParikh04/See.git
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate 
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Get a Gemini API key from Google

1. Visit [https://makersuite.google.com/app](https://makersuite.google.com/app)  
2. Sign in with your Google account  
3. Click your profile icon (top right) → **"API Key"**  
4. Copy the key  

### 5. Store your API key securely

Create a `.env` file in the root of the project directory with the following contents:

```env
GEMINI_API_KEY=your_api_key_here
```

> 🔐 **Important:** Keep your `.env` file secret — never share it or commit it to version control.

### 6. Run the Flask app

```bash
python app.py
```

### 7. Open it in your browser

Go to: [http://localhost:5000](http://localhost:5000)

---

## 📱 Access the App on Your Phone (Optional with Ngrok)

Want to test **See++** on your phone? You can use [ngrok](https://ngrok.com/) to tunnel your localhost and expose it to the internet:

### 🔧 Steps:

1. **Install ngrok**

   If you haven't already, install it from [https://ngrok.com/download](https://ngrok.com/download), or use Homebrew:

   ```bash
   brew install ngrok
   ```

2. **Sign in and authenticate**

   Create an account on ngrok and get your auth token from your [dashboard](https://dashboard.ngrok.com/get-started/setup). Then run:

   ```bash
   ngrok config add-authtoken your_token_here
   ```

3. **Start your Flask app**

   In one terminal tab, run:

   ```bash
   python app.py
   ```

4. **Expose your local server with ngrok**

   In a new terminal tab, run:

   ```bash
   ngrok http 5000
   ```

5. **Get the public URL**

   ngrok will display a forwarding URL like:

   ```
   Forwarding                    https://abc123.ngrok.io -> http://localhost:5000
   ```

6. **Visit on your phone**

   Open the `https://abc123.ngrok.io` link on your phone (make sure your phone and computer are both online).

> 📸 Your phone will ask for access to the camera and mic — allow these for full functionality.

---

## 🧪 How to Use

- Allow access to your webcam and microphone when prompted
- Click a button to:
  - 📄 Extract text from the camera view
  - 🖼️ Describe the current scene
  - 🎤 Use your voice to ask a question
- The app will:
  1. Capture a webcam frame
  2. Send it (along with your question) to the Gemini API
  3. Display and speak the response

---

## 🔐 Requirements

- Python 3.7+
- A modern browser (Chrome recommended)
- Internet access
- A Gemini API key from Google

---

## 👥 Contributors

- **Andria Wang**
- **Colby Brown**
- **James Martin**

---

## 📄 License

MIT — use freely, modify creatively, and share responsibly!