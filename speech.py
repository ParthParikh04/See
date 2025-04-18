import speech_recognition as sr
import pyttsx3 

# Initialize the recognizer 
r = sr.Recognizer() 

# Function to convert text to
# speech
def speakText(command):
    # Initialize the engine
    engine = pyttsx3.init()
    engine.say(command) 
    engine.runAndWait()
    
def textToSpeech():
    try:
        # use the microphone as source for input.
        with sr.Microphone() as source2:
            # wait for a second to let the recognizer
            # adjust the energy threshold based on
            # the surrounding noise level 
            r.adjust_for_ambient_noise(source2, duration=0.2)

            print("You may speak!")
            
            #listens for the user's input 
            audio2 = r.listen(source2)
            
            # Using google to recognize audio
            myText = r.recognize_google(audio2)
            myText = myText.lower()
            
            return myText
            
    except sr.RequestError as e:
        raise Exception(sr.RequestError)
        
    except sr.UnknownValueError:
        raise Exception("Unknown Error")
