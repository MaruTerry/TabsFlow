import sounddevice
from scipy.io.wavfile import write

# sample_rate
fs = 44100

second = int(input("Enter the Recording Time in seconds: "))
print("Recording.....\n")

record_voice = sounddevice.rec(int(second * fs), samplerate=fs, channels=2)
sounddevice.wait()
write("backend/audio_tests/audio_files/snippets/MyRecording.wav", fs, record_voice)

print("Recording is done please check your folder to listen to the recording")
