import firebase_admin
cred_object = firebase_admin.credentials.Certificate('/home/pi/credentials.json')
databaseURL = 'https://mirror-c9884-default-rtdb.firebaseio.com'
default_app = firebase_admin.initialize_app(cred_object, {
    'databaseURL':databaseURL
    })
from firebase_admin import db
import speech_recognition as sr
import gtts
import time
import subprocess
import os
import pygame as pg
from pygame import mixer
from gtts import gTTS
from playsound import playsound

listening = True

while listening:
    with sr.Microphone() as source:
        recognizer = sr.Recognizer()
        recognizer.adjust_for_ambient_noise(source)
        recognizer.dynamic_energy_threshold = 3000
        try:
            print("Listening...")
            audio = recognizer.listen(source)
            response = recognizer.recognize_google(audio)
            print(response)
            pg.init()
            check = response.find("go to sleep")
            check1 = response.find("wake up")
            check2 = response.find("read notes")
            check3 = response.find("read news")
            check4 = response.find("motivation")
            check5 = response.find("upcoming event")
            check6 = response.find("today's forecast")
            check7 = response.find("what time is it")
            check8 = response.find("what time should I leave")
            check9 = response.find("good morning")
            check10 = response.find("I want to scan my clothes")
            check11 = response.find("I'm ready")

            if check != -1:
                text="Turning off Screen"
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
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
                mixer.music.load('temp.mp3')
                time.sleep(5)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check2 != -1:
                ref = db.reference("/modules/notes/text/")
                text = "In your notes you have, " + ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check3 != -1:
                ref = db.reference("/modules/news/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check4 != -1:
                ref = db.reference("/modules/motivation/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check5 != -1:
                ref = db.reference("/modules/calendar/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check6 != -1:
                ref = db.reference("/modules/weather/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check7 != -1:
                ref = db.reference("/modules/time/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check8 != -1:
                ref = db.reference("/modules/traffic/text/text/")
                text = ref.get()
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
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
                text = "Good morning " + ref7.get() + ", " + ref.get() + ". " + ref1.get() + ". " + ref2.get() + ". On your calendar, " + ref3.get() +  ". Also, " + ref4.get() + " A reminder thatin your notes, you have, " + ref5.get() + ". And " + ref6.get() + " I hope you have a great day."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check10 != -1:
                ref = db.reference("/scan/")
                ref.update({"stage": 1})
                text = "Please lift the camera up. Then center yourself to scan your clothes. Once you are centered, please say I'm ready."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                os.remove("temp.mp3")
            elif check11 != -1:
                ref = db.reference("/scan/")
                ref2 = db.reference("/scan/camera/")
                ref.update({"stage":2})
                ref2.update({"capture": True})
                text = "Please stay still while capturing your image. Results are generating."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                ref.update({"stage":3})
                text = "Please check app for clothing recommendations. You may now put the camera back down if desired."
                tts = gTTS(text=text, lang="en")
                tts.save("temp.mp3")
                mixer.music.load('temp.mp3')
                time.sleep(2)
                mixer.music.play(1)
                while pg.mixer.music.get_busy():
                    print("Translating text to speech")
                    time.sleep(1)
                print("Finished translating")
                ref.update({"stage":0})
                os.remove("temp.mp3")
        except sr.UnknownValueError:
            print("Didn't recognize that.")
