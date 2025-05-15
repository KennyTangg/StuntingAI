import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GetStarted() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 5MB.');
      return;
    }

    setPhotoFile(file);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    if (e.dataTransfer.files.length) {
      const file = e.dataTransfer.files[0];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }

      setPhotoFile(file);
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (e) => {
    e.stopPropagation();
    setPhotoFile(null);
    setPhotoPreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(e.target);
    const ageYears = formData.get('ageYears');
    const ageMonths = formData.get('ageMonths');
    const gender = formData.get('gender');
    const height = formData.get('height');
    const weight = formData.get('weight');

    // Create child info object
    const childInfo = {
      ageYears,
      ageMonths,
      gender,
      height,
      weight,
      photo: photoFile ? photoFile.name : null
    };

    // Display collected data (for demo purposes)
    console.log(childInfo);

    // Show success message
    setShowSuccess(true);

    // Navigate to assessment results page with the collected data
    setTimeout(() => {
      navigate('/assessment-results', { state: { childInfo } });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-[#0a1122]">
      {/* Back Button */}
      <div className="max-w-md mx-auto w-full mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </button>
      </div>

      <div className="flex items-center justify-center flex-grow">
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Get Started</h1>
            <p className="text-gray-600">Please provide your child's information to continue</p>
          </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          {/* Age Field */}
          <div className="mb-5">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  type="number"
                  id="ageYears"
                  name="ageYears"
                  placeholder="Years"
                  min="0"
                  max="5"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
              <div className="w-1/2">
                <input
                  type="number"
                  id="ageMonths"
                  name="ageMonths"
                  placeholder="Months"
                  min="0"
                  max="11"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Gender Field */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <div className="flex gap-4">
              <label className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="gender" value="M" className="mr-2" required />
                <span>Male</span>
              </label>
              <label className="flex-1 flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="gender" value="F" className="mr-2" />
                <span>Female</span>
              </label>
            </div>
          </div>

          {/* Height Field */}
          <div className="mb-5">
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <div className="relative">
              <input
                type="number"
                id="height"
                name="height"
                placeholder="Enter child's height"
                min="1"
                max="300"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">cm</span>
            </div>
          </div>

          {/* Weight Field */}
          <div className="mb-5">
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <div className="relative">
              <input
                type="number"
                id="weight"
                name="weight"
                placeholder="Enter child's weight"
                min="1"
                max="500"
                step="0.1"
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                required
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
            </div>
          </div>

          {/* Photo Upload Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <p className="text-xs text-gray-500 mb-2">Please attach a clear shirtless photo of baby</p>

            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${photoPreview ? 'border-blue-500' : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'}`}
              onClick={() => fileInputRef.current.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                id="photoUpload"
                name="photoUpload"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                required
              />

              {!photoPreview ? (
                <div className="py-8">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img className="max-h-[200px] object-contain rounded mb-2" src={photoPreview} alt="Preview" />
                  <p className="text-sm text-gray-600 truncate max-w-full">{fileName}</p>
                  <button
                    type="button"
                    className="text-xs text-red-500 mt-1"
                    onClick={removePhoto}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg"
          >
            Continue
          </button>
        </form>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg">
            Information submitted successfully!
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
