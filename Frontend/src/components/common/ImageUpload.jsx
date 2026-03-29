import { useState, useRef } from 'react';
import { FiUpload, FiX, FiImage, FiAlertCircle } from 'react-icons/fi';

const ImageUpload = ({
  onImageSelect,
  multiple = false,
  existingImages = [],
  label = 'Upload Image',
}) => {
  const [previews, setPreviews] = useState(existingImages);
  const [dragging, setDragging] = useState(false);
  const [error, setError]       = useState('');
  const inputRef                = useRef(null);

  const MAX_FILES = 5;
  const MAX_SIZE  = 5 * 1024 * 1024; // 5 MB

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload  = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const processFiles = async (files) => {
    setError('');
    const fileArr = Array.from(files);

    if (multiple && previews.length + fileArr.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} images.`);
      return;
    }

    const base64Images = [];
    const newPreviews  = [];

    for (const file of fileArr) {
      if (file.size > MAX_SIZE) {
        setError(`"${file.name}" exceeds 5 MB limit.`);
        continue;
      }
      const b64 = await convertToBase64(file);
      base64Images.push(b64);
      newPreviews.push(b64);
    }

    if (multiple) {
      const merged = [...previews, ...newPreviews];
      setPreviews(merged);
      onImageSelect([
        ...previews.filter((p) => typeof p === 'object'),
        ...base64Images,
      ]);
    } else {
      setPreviews(newPreviews);
      onImageSelect(base64Images[0]);
    }
  };

  const handleFileChange = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const updated = previews.filter((_, i) => i !== index);
    setPreviews(updated);
    multiple ? onImageSelect(updated) : onImageSelect(null);
  };

  const canAddMore = multiple ? previews.length < MAX_FILES : previews.length === 0;

  return (
    <div className="space-y-3 animate-fade-in">
      {/* Label */}
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
        {label}
      </label>

      {/* Drop zone */}
      {canAddMore && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3
            p-8 rounded-2xl border-2 border-dashed cursor-pointer
            transition-all duration-300 group
            ${dragging
              ? 'border-[var(--color-forest)] bg-[var(--color-mint-light)] scale-[1.01]'
              : 'border-[var(--color-rose-beige)] bg-[var(--color-cream)] hover:border-[var(--color-sage)] hover:bg-[var(--color-mint-light)]/50'
            }
          `}
        >
          {/* Animated upload icon */}
          <div className={`
            w-14 h-14 rounded-2xl flex items-center justify-center
            transition-all duration-300
            ${dragging
              ? 'gradient-bg text-white scale-110 shadow-lg'
              : 'bg-[var(--color-mint-light)] text-[var(--color-forest)] group-hover:gradient-bg group-hover:text-white group-hover:scale-105 group-hover:shadow-md'
            }
          `}>
            {dragging
              ? <FiImage size={24} className="animate-bounce-soft" />
              : <FiUpload size={24} className="group-hover:animate-bounce-soft" />
            }
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700 group-hover:text-[var(--color-forest)] transition-colors">
              {dragging ? 'Drop to upload!' : `Click or drag & drop`}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {multiple
                ? `PNG, JPG, WEBP • Max 5MB each • Up to ${MAX_FILES} images`
                : 'PNG, JPG, WEBP • Max 5MB'
              }
            </p>
          </div>

          {/* Remaining count */}
          {multiple && (
            <span className="
              px-2.5 py-1 rounded-full text-xs font-medium
              bg-[var(--color-mint-light)] text-[var(--color-forest)]
              border border-[var(--color-mint)]/40
            ">
              {previews.length}/{MAX_FILES} uploaded
            </span>
          )}

          {/* Shimmer on drag */}
          {dragging && (
            <div className="
              absolute inset-0 rounded-2xl pointer-events-none
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              animate-[shimmer_1s_infinite]
            " />
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="
          flex items-center gap-2 px-3 py-2.5 rounded-xl
          bg-red-50 border border-red-200 animate-slide-down
        ">
          <FiAlertCircle size={14} className="text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 animate-fade-in">
          {previews.map((preview, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 60}ms` }}
              className="
                animate-scale-in relative group aspect-square
                rounded-xl overflow-hidden
                border-2 border-[var(--color-rose-beige)]/50
                hover:border-[var(--color-sage)]
                shadow-sm hover:shadow-md
                transition-all duration-200
              "
            >
              <img
                src={typeof preview === 'object' ? preview.url : preview}
                alt={`preview-${index}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Overlay on hover */}
              <div className="
                absolute inset-0 bg-black/40
                opacity-0 group-hover:opacity-100
                transition-opacity duration-200
                flex items-center justify-center
              ">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                  className="
                    w-8 h-8 rounded-full bg-red-500 text-white
                    flex items-center justify-center
                    hover:bg-red-600 hover:scale-110
                    cursor-pointer transition-all duration-150
                    shadow-lg
                  "
                >
                  <FiX size={14} />
                </button>
              </div>

              {/* Index badge */}
              <div className="
                absolute top-1 left-1 w-5 h-5 rounded-md
                gradient-bg text-white text-[10px] font-bold
                flex items-center justify-center shadow-sm
              ">
                {index + 1}
              </div>
            </div>
          ))}

          {/* Add more tile */}
          {multiple && previews.length < MAX_FILES && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="
                aspect-square rounded-xl border-2 border-dashed
                border-[var(--color-rose-beige)] bg-[var(--color-cream)]
                flex flex-col items-center justify-center gap-1
                hover:border-[var(--color-sage)] hover:bg-[var(--color-mint-light)]
                cursor-pointer transition-all duration-200 group
              "
            >
              <FiUpload size={16} className="text-gray-400 group-hover:text-[var(--color-forest)] transition-colors" />
              <span className="text-[10px] text-gray-400 group-hover:text-[var(--color-forest)] transition-colors">Add</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;