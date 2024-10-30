import pandas as pd
import matplotlib.pylab as plt
from glob import glob
import librosa

color_pal = plt.rcParams["axes.prop_cycle"].by_key()["color"]

audio_files = glob('backend/audio_tests/audio_files/*.wav')
song = audio_files[0]

# Load audio data
y, sr = librosa.load(song)

# Create subplots
fig, axs = plt.subplots(2, 1, figsize=(10, 5))

# Plot 1: Raw Audio
pd.Series(y).plot(ax=axs[0], lw=1, title='Raw Audio Example', color=color_pal[0])
axs[0].set_xlabel('Sample')
axs[0].set_ylabel('Amplitude')

# Plot 2: Zoomed-In Audio
pd.Series(y[5000:6000]).plot(ax=axs[1], lw=1, title='Raw Audio Zoomed In Example (y[5000:6000])',
                             color=color_pal[1])
axs[1].set_xlabel('Sample')
axs[1].set_ylabel('Amplitude')

# Show plots
plt.tight_layout()
plt.show()
