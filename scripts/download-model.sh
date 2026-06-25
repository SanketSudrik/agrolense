#!/bin/bash
# ============================================================
# Download ONNX model from Hugging Face on startup
# Add this to your Program.cs startup or run before dotnet
# ============================================================

MODEL_DIR="/app/AIModels"
MODEL_PATH="$MODEL_DIR/model.onnx"
HF_URL="${HUGGINGFACE_MODEL_URL}"

mkdir -p "$MODEL_DIR"

if [ ! -f "$MODEL_PATH" ]; then
    echo "==> Downloading ONNX model from Hugging Face..."
    curl -L "$HF_URL" -o "$MODEL_PATH"
    echo "==> Model downloaded successfully!"
else
    echo "==> Model already exists, skipping download."
fi

echo "==> Starting application..."
dotnet SmartCropAPI.dll
