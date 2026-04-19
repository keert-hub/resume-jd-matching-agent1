async function compare() {

    const fileInput = document.getElementById("resume");
    const jd = document.getElementById("jd").value;

    if (!fileInput.files[0]) {
        alert("Please upload a resume");
        return;
    }

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);
    formData.append("jd", jd);

    try {
        const response = await fetch("http://localhost:5000/compare", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        // Show error
        if (data.error) {
            document.getElementById("result").innerHTML = data.error;
            return;
        }

        // Show result
        document.getElementById("result").innerHTML =
            "Match Score: " + data.score + "%<br><br>" +
            "Matching Skills: " + data.matching.join(", ") + "<br><br>" +
            "Missing Skills: " + data.missing.join(", ");

    } catch (error) {
        console.error(error);
        alert("Error connecting to backend");
    }
}