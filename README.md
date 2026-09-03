# FormatFlow

FormatFlow is a web-based image conversion application built using Python, Flask and JavaScript.

The application allows users to upload image files directly from their browser and convert them between common image formats through a Python backend.

## Live Demo

🌐 **Try FormatFlow:**  
https://formatflow-f8dc.onrender.com/

## Features

- Convert PNG images to JPG
- Convert JPG/JPEG images to PNG
- Convert PNG, JPG and JPEG images to WEBP
- Drag-and-drop file uploading
- Traditional file selection
- Displays selected filename and file size
- Asynchronous file conversion using the Fetch API
- Automatic download of converted files
- Client-side and server-side file validation
- 20 MB upload limit
- Responsive web interface
- In-memory file processing

## Technologies

- Python
- Flask
- Pillow
- JavaScript
- HTML
- CSS
- Git
- GitHub

## How It Works

FormatFlow uses a frontend and backend architecture:

```text
Browser
   │
   │ Upload image
   ▼
JavaScript Fetch API
   │
   │ POST /convert
   ▼
Flask Backend
   │
   ▼
Pillow
   │
   │ Image conversion
   ▼
In-memory buffer
   │
   ▼
Flask Response
   │
   ▼
Browser downloads converted file
```

Uploaded images are processed in memory using Python's `BytesIO` rather than being permanently stored by the application.

## Supported Formats

| Input | Output |
|---|---|
| PNG | JPG |
| PNG | WEBP |
| JPG / JPEG | PNG |
| JPG / JPEG | WEBP |
| WEBP | PNG |
| WEBP | JPG |

## Project Structure

```text
formatflow/
├── app.py
├── requirements.txt
├── static/
│   ├── script.js
│   └── style.css
├── templates/
│   └── index.html
└── README.md
```

## Running Locally

Clone the repository:

```bash
git clone https://github.com/joakim-silva/formatflow.git
cd formatflow
```

Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask application:

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

## Development

FormatFlow was created as a full-stack development project to explore:

- Flask routing and backend development
- HTTP POST requests
- File uploads and multipart form data
- Image processing with Pillow
- JavaScript asynchronous requests
- Browser file handling
- Input validation
- Frontend/backend communication
- Git and GitHub workflow

## Future Development

Potential future features include:

- Additional image formats
- PDF conversion tools
- Document conversion
- Batch file conversion
- Image compression
- Image resizing
- Conversion history
- Additional user interface improvements

## Author

**Joakim Silva**

GitHub: https://github.com/joakim-silva

Portfolio: https://joakim-silva.github.io/
