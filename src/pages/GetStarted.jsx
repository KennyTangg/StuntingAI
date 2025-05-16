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
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-[#0a1122] to-[#1a2342]">
      <div className="flex items-center justify-center flex-grow overflow-auto py-4 max-h-screen">
        <div className="bg-white/95 backdrop-blur-sm w-full max-w-xl p-6 rounded-xl shadow-xl border border-blue-100/20 relative my-auto">
          {/* Back Button - Positioned at top left corner of the card */}
          <button
            onClick={() => navigate('/')}
            className="absolute left-4 top-4 flex items-center text-blue-500 hover:text-blue-600 transition-colors bg-white/80 backdrop-blur-sm py-1.5 px-3 rounded-lg shadow-sm"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          <div className="mb-6 text-center">

            <div className="w-16 h-16 border-blue-500 border-2 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Get Started</h1>
            <p className="text-base text-gray-600">Please provide your child's information to continue</p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter child's name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            {/* Age Field */}
            <div className="mb-4">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <div className="relative">
                    <input
                      type="number"
                      id="ageYears"
                      name="ageYears"
                      placeholder="0"
                      min="0"
                      max="5"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base text-gray-900 placeholder-gray-400"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">Years</span>
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
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base text-gray-900 placeholder-gray-400"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">Months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="flex gap-4">
                <label
                  className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedGender === 'M'
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    className="mr-3 w-5 h-5 text-blue-500 focus:ring-blue-500"
                    required
                    onChange={handleGenderChange}
                    checked={selectedGender === 'M'}
                  />
                  <span className="text-base font-medium text-gray-800">Male</span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedGender === 'F'
                      ? 'bg-blue-50 border-blue-500 shadow-sm'
                      : 'border-gray-300 hover:bg-blue-50 hover:border-blue-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    className="mr-3 w-5 h-5 text-blue-500 focus:ring-blue-500"
                    onChange={handleGenderChange}
                    checked={selectedGender === 'F'}
                  />
                  <span className="text-base font-medium text-gray-800">Female</span>
                </label>
              </div>
            </div>

            {/* Height and Weight Fields with improved styling */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <div className="relative">
                  <input
                    type="number"
                    id="height"
                    name="height"
                    placeholder="0.0"
                    min="1"
                    max="300"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base text-gray-900 placeholder-gray-400"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">cm</span>
                </div>
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    placeholder="0.0"
                    min="1"
                    max="500"
                    step="0.1"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-base text-gray-900 placeholder-gray-400"
                    required
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">kg</span>
                </div>
              </div>
            </div>

            {/* Photo Upload Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo (Optional)</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
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
                      className="mx-auto h-32 object-cover rounded-lg shadow-md"
                    />
                    <div className="mt-2 flex flex-col items-center">
                      <p className="text-base text-gray-600 truncate max-w-full">{fileName}</p>
                      <button
                        type="button"
                        className="mt-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                        onClick={removePhoto}
                      >
                        Remove Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Click or drag and drop to upload a photo</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium text-base rounded-lg transition-all transform hover:-translate-y-1 hover:shadow-lg"
            >
              Continue to Assessment
            </button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-base">Information submitted successfully!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
