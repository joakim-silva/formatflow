const form = document.querySelector("#converter-form");
const fileInput = document.querySelector("#file-input");
const fileInfo = document.querySelector("#file-info");
const dropZone = document.querySelector("#drop-zone");
const submitButton = form.querySelector("button");
const message = document.querySelector("#message");


// ---------- Show Message ----------

function showMessage(text, type) {

    message.textContent = text;

    message.className = `message ${type}`;

}


// ---------- Clear Message ----------

function clearMessage() {

    message.textContent = "";

    message.className = "message";

}


// ---------- Display Selected File ----------

function displayFile(file) {

    clearMessage();

    if (!file) {

        fileInfo.innerHTML = "";

        return;

    }

    const fileSizeMB = (
        file.size / 1024 / 1024
    ).toFixed(2);

    fileInfo.innerHTML = `
        <strong>${file.name}</strong>
        <span>${fileSizeMB} MB</span>
    `;

}


// ---------- Normal File Selection ----------

fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    displayFile(file);

});


// ---------- Drag Over ----------

dropZone.addEventListener(
    "dragover",
    (event) => {

        event.preventDefault();

        dropZone.classList.add(
            "drag-over"
        );

    }
);


// ---------- Drag Leave ----------

dropZone.addEventListener(
    "dragleave",
    () => {

        dropZone.classList.remove(
            "drag-over"
        );

    }
);


// ---------- Drop File ----------

dropZone.addEventListener(
    "drop",
    (event) => {

        event.preventDefault();

        dropZone.classList.remove(
            "drag-over"
        );

        clearMessage();

        const files =
            event.dataTransfer.files;

        if (files.length === 0) {
            return;
        }

        const file = files[0];


        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "image/webp"
        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            showMessage(
                "Please upload a PNG, JPG or WEBP image.",
                "error"
            );

            return;

        }


        if (
            file.size >
            20 * 1024 * 1024
        ) {

            showMessage(
                "The maximum file size is 20 MB.",
                "error"
            );

            return;

        }


        const dataTransfer =
            new DataTransfer();

        dataTransfer.items.add(file);

        fileInput.files =
            dataTransfer.files;


        displayFile(file);

    }
);


// ---------- Convert File ----------

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        clearMessage();


        const file =
            fileInput.files[0];


        if (!file) {

            showMessage(
                "Please choose a file first.",
                "error"
            );

            return;

        }


        if (
            file.size >
            20 * 1024 * 1024
        ) {

            showMessage(
                "The maximum file size is 20 MB.",
                "error"
            );

            return;

        }


        submitButton.disabled = true;

        submitButton.textContent =
            "Converting...";


        const formData =
            new FormData(form);


        try {

            const response =
                await fetch(
                    "/convert",
                    {
                        method: "POST",
                        body: formData
                    }
                );


            if (!response.ok) {

                const errorMessage =
                    await response.text();

                throw new Error(
                    errorMessage
                );

            }


            const blob =
                await response.blob();


            const disposition =
                response.headers.get(
                    "Content-Disposition"
                );


            let filename =
                "converted-file";


            if (disposition) {

                const match =
                    disposition.match(
                        /filename="?([^"]+)"?/
                    );

                if (match) {

                    filename =
                        match[1];

                }

            }


            const downloadURL =
                URL.createObjectURL(
                    blob
                );


            const downloadLink =
                document.createElement(
                    "a"
                );


            downloadLink.href =
                downloadURL;

            downloadLink.download =
                filename;


            document.body.appendChild(
                downloadLink
            );

            downloadLink.click();

            downloadLink.remove();


            URL.revokeObjectURL(
                downloadURL
            );


            showMessage(
                "Conversion complete. Your file has been downloaded.",
                "success"
            );


            submitButton.textContent =
                "Converted ✓";


            setTimeout(() => {

                submitButton.textContent =
                    "Convert File";

                submitButton.disabled =
                    false;

            }, 1500);


        } catch (error) {

            showMessage(
                error.message ||
                "Something went wrong during conversion.",
                "error"
            );


            submitButton.textContent =
                "Convert File";

            submitButton.disabled =
                false;

        }

    }
);