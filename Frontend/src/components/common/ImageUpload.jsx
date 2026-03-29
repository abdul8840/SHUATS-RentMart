import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

const ImageUpload = ({ onImageSelect, multiple = false, existingImages = [], label = 'Upload Image' }) => {
  const [previews, setPreviews] = useState(existingImages);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = [];
    const newPreviews = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB');
        continue;
      }
      const base64 = await convertToBase64(file);
      base64Images.push(base64);
      newPreviews.push(base64);
    }

    if (multiple) {
      setPreviews(prev => [...prev, ...newPreviews]);
      onImageSelect([...previews.filter(p => typeof p === 'object'), ...base64Images]);
    } else {
      setPreviews(newPreviews);
      onImageSelect(base64Images[0]);
    }
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    if (multiple) {
      onImageSelect(updated);
    } else {
      onImageSelect(null);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <div>
        <label>
          <FiUpload />
          <span>Choose {multiple ? 'Images' : 'Image'}</span>
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            hidden
          />
        </label>
      </div>
      {previews.length > 0 && (
        <div>
          {previews.map((preview, index) => (
            <div key={index}>
              <img src={typeof preview === 'object' ? preview.url : preview} alt={`preview-${index}`} />
              <button onClick={() => removeImage(index)}><FiX /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;