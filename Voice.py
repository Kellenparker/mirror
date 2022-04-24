import firebase_admin
cred_object = firebase_admin.credentials.Certificate('/home/pi/credentials.json')
databaseURL = 'https://mirror-c9884-default-rtdb.firebaseio.com'
default_app = firebase_admin.initialize_app(cred_object, {
    'databaseURL':databaseURL
    })
from firebase_admin import db
import speech_recognition as sr
import time
import subprocess
import os
import pygame as pg
from gtts import gTTS

listening = True

while listening:
    with sr.Microphone() as source:
        print("Please wait. Calibrating microphone...")
        recognizer = sr.Recognizer()
        # Waits 1 seconds to calibrate microphone
        recognizer.adjust_for_ambient_noise(source) #, duration=2)
        # Picks up what's speech and what's noise
        recognizer.energy_threshold = 4000
        # Consitantly changes to adjust to environment
        recognizer.dynamic_energy_threshold = True
        try:
            print("Listening...")
            audio = recognizer.listen(source)
            response = recognizer.recognize_google(audio)
            print(response)
            pg.init()
            check = response.find("go to sleep")
            check1 = response.find("wake up")
            check2 = response.find("read my notes")
            check3 = response.find("read the news")
            check4 = response.find("motivate me")
            check5 = response.find("read my calendar")
            check6 = response.find("today's forecast")
            check7 = response.find("what time is it")
            check8 = response.find("what time should I leave")
            check9 = response.find("good morning")
            check10 = response.find("I want to scan my clothes")
            check11 = response.find("I'm ready")
            check12 = response.find("continue")
            check13 = response.find("retake picture")

            if check != -1:
                tts = gTTS(text="Turning off screen", lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
                bashCommand = "xset -display :0 s blank"
                process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
                output, error = process.communicate()
                bashCommand = "xset -display :0 s reset"
                process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
                output, error = process.communicate()
                bashCommand = "xset -display :0 s activate"
                process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
                output, error = process.communicate()
            elif check1 != -1:
                bashCommand = "xset -display :0 s reset"
                process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
                output, error = process.communicate()
                bashCommand = "xset -display :0 s noblank"
                process = subprocess.Popen(bashCommand.split(), stdout=subprocess.PIPE)
                output, error = process.communicate()
                text="Turning on Screen"
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                time.sleep(6)
                while pg.mixer.music.get_busy():
                    time.sleep(1)
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check2 != -1:
                ref = db.reference("/modules/notes/text/")
                text = "In your notes you have, " + ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check3 != -1:
                ref = db.reference("/modules/news/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check4 != -1:
                ref = db.reference("/modules/motivation/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check5 != -1:
                ref = db.reference("/modules/calendar/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check6 != -1:
                ref = db.reference("/modules/weather/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check7 != -1:
                ref = db.reference("/modules/time/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check8 != -1:
                ref = db.reference("/modules/traffic/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check9 != -1:
                ref = db.reference("/modules/time/text/text/")
                ref1 = db.reference("/modules/weather/text/text/")
                ref2 = db.reference("/modules/news/text/text/")
                ref3 = db.reference("/modules/calendar/text/text/")
                ref4 = db.reference("modules/traffic/text/text/")
                ref5 = db.reference("/modules/notes/text/")
                ref6 = db.reference("/modules/motivation/text/text/")
                ref7 = db.reference("/user/name/")
                name = ref7.get()
                if(name == ""):
                    text = "Please log in to app"
                    tts = gTTS(text=text, lang="en")
                    tts.save("temp.mp3")
                    os.system("mpg321 temp.mp3")
                    os.remove("temp.mp3")
                else:
                    text = "Good morning " + name + ", " + ref.get() + ". " + ref1.get() + ". " + ref2.get() + ". Also on your calendar, " + ref3.get() +  ". Also, " + ref4.get() + ".  Also in your notes, you have, " + ref5.get() + ". And " + ref6.get() + ".  I hope you have a great day."
                    tts = gTTS(text=text, lang="en")
                    tts.save("temp.mp3")
                    os.system("mpg321 temp.mp3")
                    os.remove("temp.mp3")
            elif check10 != -1 or check13 != -1:
                ref = db.reference("/scan/")
                ref.update({"stage": 1})
                text = "Please lift the camera up. Then center yourself to scan your clothes. Once you are centered, please say I'm ready."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check11 != -1:
                ref = db.reference("/scan/")
                ref2 = db.reference("/scan/camera/")
                text = "Please stay still while capturing your image."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
                ref2.update({"capture": True})
                ref2.update({"capture": False})
                ref.update({"stage":2})
                time.sleep(7)
                text = "Would you like to retake your picture? Please say 'continue' to generate results or 'retake picture' to capture your image again."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
            elif check12 != -1:
                ref = db.reference("/scan/")
                ref.update({"stage":3})
                text = "Please wait as results are generating. This might take a while"
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
                num = ref.child("stage").get();
                res = 4
                while num != res:
                    time.sleep(1)
                    num = ref.child("stage").get();
                text = "Please check app for clothing recommendations." 
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
                time.sleep(2)
                text = "You may now put the camera back down if desired."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                os.system("mpg321 temp.mp3")
                os.remove("temp.mp3")
        except sr.UnknownValueError:
            print("Didn't recognize that.")
