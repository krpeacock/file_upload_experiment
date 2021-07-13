import { file_upload } from "../../declarations/file_upload";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with file_upload actor, calling the greet method
  const greeting = await file_upload.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
