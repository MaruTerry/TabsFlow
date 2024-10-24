import asyncio
import websockets
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Flask setup for HTTP server
app = Flask(__name__)
CORS(app)

# Path to the 'songs' folder and allowed file types
UPLOAD_FOLDER = './backend/songs'
ALLOWED_EXTENSIONS = {'gp', 'gp3', 'gp4', 'gp5'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Endpoint to list song files
@app.route('/list-songs', methods=['GET'])
def list_songs():
    songs = []
    for filename in os.listdir(app.config['UPLOAD_FOLDER']):
        if allowed_file(filename):
            songs.append({'name': filename, 'path': f"../backend/songs/{filename}"})
    return jsonify(songs), 200

# Endpoint to upload files
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
    return jsonify({'message': f'File {file.filename} uploaded successfully!'}), 200

# Endpoint to delete files
@app.route('/delete', methods=['POST'])
def delete_file():
    data = request.get_json()  # Get JSON data from request body
    if not data or 'filename' not in data:
        return jsonify({'error': 'No file provided'}), 400
    filename = data['filename']
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    # Check if file exists
    if not os.path.exists(filepath):
        return jsonify({'error': 'File not found'}), 404
    try:
        os.remove(filepath)  # Deletes the file
        return jsonify({'message': f'File {filename} deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# WebSocket setup
async def websocket_send_data(websocket, path):
    while True:
        data = {
            'value': "Socket message from server",
        }
        print("Sending data: " + json.dumps(data))
        await websocket.send(json.dumps(data))
        await asyncio.sleep(5)


async def start_websocket_server():
    print("\nWebsocket server started...\n")
    async with websockets.serve(websocket_send_data, "localhost", 4200):
        await asyncio.Future()



async def main():
    loop = asyncio.get_event_loop()
    flask_future = loop.run_in_executor(None, app.run, "localhost", 5000)
    await start_websocket_server()

if __name__ == "__main__":
    asyncio.run(main())
