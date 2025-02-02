const handleFileUpload = async (file, setAttachment) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      setAttachment({
        data: base64Data,
        mimetype: file.type,
        name: file.name,
      });
    };
  
    reader.onerror = (error) => {
      console.error("File upload error:", error);
      setAttachment(null);
    };
  };
  
  export default handleFileUpload;
  