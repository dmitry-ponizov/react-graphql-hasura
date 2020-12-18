async function handleImageUpload(image) {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", "react12");
  formData.append("cloud_name", "podmge");
  const response = await fetch(
    "https://api.cloudinary.com/v1_1/podmge/image/upload",
    {
      method: "POST",
      accept: "application/json",
      body: formData,
    }
  );
  const jsonResponse = await response.json();
  return jsonResponse.url;
}

export default handleImageUpload;
