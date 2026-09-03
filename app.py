from flask import Flask, render_template, request, send_file
from PIL import Image, UnidentifiedImageError
from io import BytesIO
from werkzeug.utils import secure_filename
import os


app = Flask(__name__)

# Maximum upload size: 20 MB
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp"
}


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/convert", methods=["POST"])
def convert():

    uploaded_file = request.files.get("file")
    output_format = request.form.get("output_format")


    # ---------- Basic Validation ----------

    if not uploaded_file:
        return "No file was uploaded.", 400

    if uploaded_file.filename == "":
        return "No file was selected.", 400


    # ---------- Filename Validation ----------

    filename = secure_filename(
        uploaded_file.filename
    )

    if not allowed_file(filename):
        return (
            "Only PNG, JPG, JPEG and WEBP files "
            "are supported."
        ), 400


    # ---------- Output Format Validation ----------

    allowed_output_formats = {
        "jpg",
        "png",
        "webp"
    }

    if output_format not in allowed_output_formats:
        return "Invalid output format.", 400


    # ---------- Open and Verify Image ----------

    try:

        image = Image.open(uploaded_file)

        # Forces Pillow to inspect the image data
        image.load()

    except UnidentifiedImageError:

        return (
            "The uploaded file is not a valid image."
        ), 400

    except Exception:

        return (
            "The image could not be processed."
        ), 400


    # ---------- Prepare Output ----------

    output = BytesIO()

    original_name = os.path.splitext(
        filename
    )[0]


    # ---------- Convert to JPG ----------

    if output_format == "jpg":

        # JPEG does not support transparency
        if image.mode != "RGB":
            image = image.convert("RGB")

        image.save(
            output,
            format="JPEG",
            quality=95
        )

        mime_type = "image/jpeg"


    # ---------- Convert to PNG ----------

    elif output_format == "png":

        image.save(
            output,
            format="PNG"
        )

        mime_type = "image/png"


    # ---------- Convert to WEBP ----------

    elif output_format == "webp":

        image.save(
            output,
            format="WEBP",
            quality=95
        )

        mime_type = "image/webp"


    output.seek(0)


    # ---------- Return Converted File ----------

    return send_file(
        output,
        mimetype=mime_type,
        as_attachment=True,
        download_name=(
            f"{original_name}.{output_format}"
        )
    )


@app.errorhandler(413)
def file_too_large(error):

    return (
        "The uploaded file is too large. "
        "Maximum file size is 20 MB."
    ), 413


if __name__ == "__main__":
    app.run(debug=True)