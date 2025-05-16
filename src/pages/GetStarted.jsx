import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/icons/Logo';

export default function GetStarted() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
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

  const handleGenderChange = (e) => {
    setSelectedGender(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get form values
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const ageYears = parseInt(formData.get('ageYears'), 10);
    const ageMonths = parseInt(formData.get('ageMonths'), 10);
    const gender = formData.get('gender');
    const height = parseFloat(formData.get('height'));
    const weight = parseFloat(formData.get('weight'));

    // Create child info object
    const childInfo = {
      name,
      ageYears,
      ageMonths,
      gender,
      height,
      weight,
      photo: photoPreview // Pass the actual image data URL
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
    <div className="h-screen flex items-center justify-center p-3 bg-gradient-to-br from-[#0a1122] to-[#1a2342]">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-xl p-4 rounded-xl shadow-xl border border-blue-100/20 relative">
        {/* Back Button - Positioned at top left corner of the card */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-3 top-3 flex items-center text-blue-500 hover:text-blue-600 transition-colors bg-white/80 backdrop-blur-sm py-1 px-2 rounded-lg shadow-sm"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-sm">Back</span>
        </button>

        <div className="mb-3 text-center">
          <div className="w-12 h-12 border-blue-500 border-2 rounded-full mx-auto mb-2 flex items-center justify-center">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Get Started</h1>
          <p className="text-sm text-gray-600">Please provide your child's information</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
          {/* Name Field */}
          <div className="mb-2">
            <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">Child's Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter child's name"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm text-black placeholder-gray-400"
              required
            />
          </div>

          {/* Age and Gender in one row */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            {/* Age Field */}
            <div>
              <label htmlFor="age" className="block text-xs font-medium text-gray-700 mb-1">Age</label>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <div className="relative">
                    <input
                      type="number"
                      id="ageYears"
                      name="ageYears"
                      placeholder="0"
                      min="0"
                      max="5"
                      className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm text-black placeholder-gray-400"
                      required
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">Yrs</span>
                  </div>
                </div>
                <div className="w-1/2">
                  <div className="relative">
                    <input
                      type="number"
                      id="ageMonths"
                      name="ageMonths"
                      placeholder="0"
                      min="0"
                      max="11"
                      className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm text-black placeholder-gray-400"
                      required
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">Mo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
              <div className="flex gap-2">
                <label
                  className={`flex-1 flex items-center justify-center py-2.5 border rounded-lg cursor-pointer transition-colors ${
                    selectedGender === 'M'
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    className="mr-1 w-3 h-3 text-blue-500 focus:ring-blue-500"
                    required
                    onChange={handleGenderChange}
                    checked={selectedGender === 'M'}
                  />
                  <span className="text-sm font-medium text-gray-800">Male</span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center py-2.5 border rounded-lg cursor-pointer transition-colors ${
                    selectedGender === 'F'
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    className="mr-1 w-3 h-3 text-blue-500 focus:ring-blue-500"
                    onChange={handleGenderChange}
                    checked={selectedGender === 'F'}
                  />
                  <span className="text-sm font-medium text-gray-800">Female</span>
                </label>
              </div>
            </div>
          </div>

          {/* Height and Weight Fields with improved styling */}
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div>
              <label htmlFor="height" className="block text-xs font-medium text-gray-700 mb-1">Height</label>
              <div className="relative">
                <input
                  type="number"
                  id="height"
                  name="height"
                  placeholder="0.0"
                  min="1"
                  max="300"
                  step="0.1"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm text-black placeholder-gray-400"
                  required
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">cm</span>
              </div>
            </div>
            <div>
              <label htmlFor="weight" className="block text-xs font-medium text-gray-700 mb-1">Weight</label>
              <div className="relative">
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="0.0"
                  min="1"
                  max="500"
                  step="0.1"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all text-sm text-black placeholder-gray-400"
                  required
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">kg</span>
              </div>
            </div>
          </div>

          {/* Photo Upload Field - Compact Version */}
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Photo (Optional)</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition-all ${
                photoPreview ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />

              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="mx-auto h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="mt-1 flex flex-col items-center">
                    <p className="text-xs text-gray-600 truncate max-w-full">{fileName}</p>
                    <button
                      type="button"
                      className="mt-1 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium hover:bg-red-200 transition-colors"
                      onClick={removePhoto}
                    >
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-3">
                  <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-2 text-xs text-gray-500">Click or drag to upload a photo</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-sm rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg mt-2"
          >
            Continue to Assessment
          </button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-3 p-2 bg-green-50 text-green-700 rounded-lg flex items-center">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Information submitted successfully!</span>
            </div>
          )}
      </div>
    </div>
  );
}
