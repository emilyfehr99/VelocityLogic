"""
Voice Service
Handles audio transcription using Whisper.
"""

import os
import whisper
from typing import Optional

class VoiceService:
    def __init__(self, model_name: str = "base"):
        """Initialize Whisper model."""
        print(f"🎙 Loading Whisper model: {model_name}...")
        self.model = whisper.load_model(model_name)
        print("✓ Whisper model loaded")

    def transcribe(self, audio_path: str) -> Optional[str]:
        """Transcribe audio file to text."""
        try:
            if not os.path.exists(audio_path):
                print(f"✗ Audio file not found: {audio_path}")
                return None
            
            print(f"🎙 Transcribing {audio_path}...")
            result = self.model.transcribe(audio_path)
            text = result.get("text", "").strip()
            print(f"✓ Transcription complete: '{text[:50]}...'")
            return text
        except Exception as e:
            print(f"✗ Error transcribing audio: {e}")
            return None

# Mock Voice Service for testing without heavy model loading if needed
class MockVoiceService:
    def transcribe(self, audio_path: str) -> str:
        return "I need a furnace replacement in Brandon, 1200 square foot home, 40-gallon gas."
