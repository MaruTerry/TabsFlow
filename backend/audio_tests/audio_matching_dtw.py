import librosa
import numpy as np
from librosa.sequence import dtw
import matplotlib.pyplot as plt


def load_audio(file_path):
    """Loads an audio file and returns the audio signal and sampling rate."""
    y, sr = librosa.load(file_path)
    return y, sr


def extract_mfcc(y, sr, n_mfcc=13):
    """Extracts MFCC features from an audio signal."""
    return librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)


def segment_song(y, sr, segment_duration=1, overlap=0.5):
    """Divides the song into overlapping segments and extracts MFCCs for each segment."""
    hop_length = int(sr * segment_duration * (1 - overlap))
    segment_samples = int(sr * segment_duration)

    segments_mfccs = []
    for i in range(0, len(y) - segment_samples, hop_length):
        segment = y[i:i + segment_samples]
        mfcc_segment = extract_mfcc(segment, sr)
        segments_mfccs.append((mfcc_segment, i / sr))  # Stores start time of the segment
    return segments_mfccs


def rank_segments_by_similarity(mfcc_snippet, segments_mfccs, top_n=5):
    """Computes DTW distances and returns a ranking of the best matches."""
    distances = []
    for segment_mfcc, start_time in segments_mfccs:
        D, _ = dtw(mfcc_snippet, segment_mfcc, subseq=True)
        distance = D[-1, -1]
        distances.append((start_time, distance))

    # Sort distances and return the top N results
    distances.sort(key=lambda x: x[1])  # Sort by distance
    return distances[:top_n]


def visualize_top_matches(y_full, sr_full, ranked_segments, segment_duration):
    """Visualizes the top N segments in the entire song."""
    plt.figure(figsize=(12, 6))
    plt.plot(y_full, color="gray", alpha=0.5, label="Full Song")

    colors = ['blue', 'orange', 'green', 'red', 'purple']
    for i, (start_time, distance) in enumerate(ranked_segments):
        start_sample = int(start_time * sr_full)
        end_sample = int((start_time + segment_duration) * sr_full)
        plt.plot(range(start_sample, end_sample), y_full[start_sample:end_sample], color=colors[i % len(colors)],
                 label=f"Match {i + 1} (Distance: {distance:.2f})")

    plt.title("Top Matches for the Played Segment in the Song")
    plt.xlabel("Samples")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.show()


def visualize_spectrograms(y_snippet, sr_snippet, y_full, sr_full, ranked_segments, segment_duration):
    """Displays the spectrogram for the snippet and each top match side by side."""

    # Prepare the spectrogram of the snippet (remains unchanged for all comparisons)
    D_snippet = librosa.amplitude_to_db(np.abs(librosa.stft(y_snippet)), ref=np.max)

    # Display the snippet and each top match in a two-row plot
    for i, (start_time, distance) in enumerate(ranked_segments):
        # Extract the corresponding song segment for the match
        start_sample = int(start_time * sr_full)
        end_sample = int((start_time + segment_duration) * sr_full)
        y_match = y_full[start_sample:end_sample]

        # Compute the spectrogram for the match
        D_match = librosa.amplitude_to_db(np.abs(librosa.stft(y_match)), ref=np.max)

        # Create a two-row plot
        fig, axs = plt.subplots(2, 1, figsize=(12, 6))

        # Plot for the spectrogram of the snippet
        img1 = librosa.display.specshow(D_snippet, sr=sr_snippet, x_axis='time', y_axis='log', ax=axs[0])
        axs[0].set(title='Spectrogram - Audio Snippet')
        plt.colorbar(img1, ax=axs[0], format='%+2.0f dB')

        # Plot for the spectrogram of the match
        img2 = librosa.display.specshow(D_match, sr=sr_full, x_axis='time', y_axis='log', ax=axs[1])
        axs[1].set(title=f'Spectrogram - Match {i + 1} (Start Time: {start_time:.2f} s, Distance: {distance:.2f})')
        plt.colorbar(img2, ax=axs[1], format='%+2.0f dB')

        # Show plot and a short pause before the next match
        plt.tight_layout()
        plt.show()


def main():
    # Load audio files for the full song and the snippet
    song_path = 'C:/Users/Marius/Uni-Repos/TabsFlow/backend/audio_tests/audio_files/01_AntoherBrickInTheWall_Start.wav'
    snippet_path = 'C:/Users/Marius/Uni-Repos/TabsFlow/backend/audio_tests/audio_files/samples/Kawai-K11-CleanGtr-C3.wav'

    y_full, sr_full = load_audio(song_path)
    y_snippet, sr_snippet = load_audio(snippet_path)

    # Extract MFCCs from the snippet
    mfcc_snippet = extract_mfcc(y_snippet, sr_snippet)

    # Segment the song and extract MFCCs for each segment
    segment_duration = 1
    overlap = 0.5
    segments_mfccs = segment_song(y_full, sr_full, segment_duration, overlap)

    # Compute the ranking of the best matches
    top_n = 5
    ranked_segments = rank_segments_by_similarity(mfcc_snippet, segments_mfccs, top_n=top_n)

    # Output results
    for i, (start_time, distance) in enumerate(ranked_segments):
        print(f"Match {i + 1}: Start Time {start_time:.2f} s, DTW Distance {distance:.2f}")

    # Visualize the top matches in the song
    visualize_top_matches(y_full, sr_full, ranked_segments, segment_duration)

    # Display the spectrograms of the snippet and the top matches
    visualize_spectrograms(y_snippet, sr_snippet, y_full, sr_full, ranked_segments, segment_duration)


if __name__ == "__main__":
    main()
