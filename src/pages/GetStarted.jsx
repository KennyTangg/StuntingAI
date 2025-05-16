import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/icons/Logo';

export default function GetStarted() {
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [formReady, setFormReady] = useState(false);
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  // Add animation effect when component mounts
  useEffect(() => {
    // Small delay to trigger animation after component mounts
    const timer = setTimeout(() => {
      setFormReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-[#0a1122] to-[#1a2342] py-6 sm:py-10">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-xl p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl border border-blue-200/30 relative overflow-hidden transition-all duration-300 hover:shadow-blue-500/10">
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-36 sm:w-48 h-36 sm:h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-36 sm:w-48 h-36 sm:h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

        {/* Back Button - Positioned at top left corner of the card */}
        <button
          onClick={() => navigate('/')}
          className="absolute left-3 sm:left-4 top-3 sm:top-4 flex items-center text-blue-600 hover:text-blue-700 transition-all duration-300 bg-white/90 backdrop-blur-sm py-1 sm:py-1.5 px-2 sm:px-3 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105"
        >
          <svg className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium text-xs sm:text-sm">Back</span>
        </button>

        <div className={`mb-4 sm:mb-6 text-center relative z-10 transition-all duration-700 ${formReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-blue-500 border-2 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center bg-blue-50 shadow-md transform transition-transform duration-500 hover:scale-110 hover:shadow-lg">
            <Logo />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 inline-block text-transparent bg-clip-text">Get Started</h1>
          <p className="text-sm sm:text-base text-gray-600">Please provide your child's information for assessment</p>
        </div>

        {/* Progress Steps */}
        <div className={`mb-4 sm:mb-6 relative z-10 transition-all duration-700 ${formReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md animate-pulse-blue">
                <span className="text-xs sm:text-sm font-bold">1</span>
              </div>
              <span className="text-[10px] sm:text-xs mt-1 text-blue-600 font-medium">Info</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200 rounded overflow-hidden">
              <div className="h-full w-0 bg-blue-500 rounded transition-all duration-1000"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center transition-all duration-300 hover:bg-gray-300">
                <span className="text-xs sm:text-sm font-bold">2</span>
              </div>
              <span className="text-[10px] sm:text-xs mt-1 text-gray-500">Results</span>
            </div>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className={`space-y-3 sm:space-y-4 relative z-10 transition-all duration-700 ${formReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {/* Name Field */}
          <div className="mb-2 sm:mb-3 group">
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 transition-all group-focus-within:text-blue-600">
              <span className="flex items-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Child's Name
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter child's name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm text-black placeholder-gray-400 shadow-sm"
                required
              />
              <div className="absolute inset-0 rounded-lg sm:rounded-xl pointer-events-none transition-opacity opacity-0 group-focus-within:opacity-100 border border-blue-500 shadow-sm"></div>
            </div>
          </div>

          {/* Age and Gender in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2 sm:mb-3">
            {/* Age Field */}
            <div className="group">
              <label htmlFor="age" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 transition-all group-focus-within:text-blue-600">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Age
                </span>
              </label>
              <div className="flex gap-2 sm:gap-3">
                <div className="w-1/2">
                  <div className="relative">
                    <input
                      type="number"
                      id="ageYears"
                      name="ageYears"
                      placeholder="0"
                      min="0"
                      max="5"
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm text-black placeholder-gray-400 shadow-sm"
                      required
                    />
                    <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[10px] sm:text-xs font-medium">Years</span>
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
                      className="w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm text-black placeholder-gray-400 shadow-sm"
                      required
                    />
                    <span className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-[10px] sm:text-xs font-medium">Months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Field */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Gender
                </span>
              </label>
              <div className="flex gap-2 sm:gap-3">
                <label
                  className={`flex-1 flex items-center justify-center py-2 sm:py-3 border rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedGender === 'M'
                      ? 'bg-blue-50 border-blue-500 shadow-md transform scale-105'
                      : 'border-gray-200 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    className="sr-only"
                    required
                    onChange={handleGenderChange}
                    checked={selectedGender === 'M'}
                  />
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${selectedGender === 'M' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className={`text-xs sm:text-sm font-medium ${selectedGender === 'M' ? 'text-blue-700' : 'text-gray-700'}`}>Male</span>
                </label>
                <label
                  className={`flex-1 flex items-center justify-center py-2 sm:py-3 border rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedGender === 'F'
                      ? 'bg-blue-50 border-blue-500 shadow-md transform scale-105'
                      : 'border-gray-200 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    className="sr-only"
                    onChange={handleGenderChange}
                    checked={selectedGender === 'F'}
                  />
                  <svg className={`w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2 ${selectedGender === 'F' ? 'text-blue-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className={`text-xs sm:text-sm font-medium ${selectedGender === 'F' ? 'text-blue-700' : 'text-gray-700'}`}>Female</span>
                </label>
              </div>
            </div>
          </div>

          {/* Height and Weight Fields with improved styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-2 sm:mb-3">
            <div className="group">
              <label htmlFor="height" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 transition-all group-focus-within:text-blue-600">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Height
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="height"
                  name="height"
                  placeholder="0.0"
                  min="1"
                  max="300"
                  step="0.1"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm text-black placeholder-gray-400 shadow-sm"
                  required
                />
                <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-[10px] sm:text-xs font-medium">cm</span>
              </div>
            </div>
            <div className="group">
              <label htmlFor="weight" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5 transition-all group-focus-within:text-blue-600">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500 group-focus-within:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Weight
                </span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  placeholder="0.0"
                  min="1"
                  max="500"
                  step="0.1"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xs sm:text-sm text-black placeholder-gray-400 shadow-sm"
                  required
                />
                <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-[10px] sm:text-xs font-medium">kg</span>
              </div>
            </div>
          </div>

          {/* Photo Upload Field - Enhanced Version */}
          <div className="mb-3 sm:mb-4 group">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              <span className="flex items-center">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Photo (Optional)
              </span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg sm:rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-all duration-300 ${
                photoPreview
                  ? 'border-blue-400 bg-blue-50/70 shadow-md'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/70 hover:shadow-md'
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
                  <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden shadow-lg transition-transform duration-500 transform hover:scale-105 group">
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-2">
                      <p className="text-[10px] sm:text-xs text-white font-medium truncate max-w-[90%]">{fileName}</p>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 flex justify-center">
                    <button
                      type="button"
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-red-100 text-red-600 rounded-full text-[10px] sm:text-xs font-medium hover:bg-red-200 transition-all duration-300 hover:shadow-md flex items-center"
                      onClick={removePhoto}
                    >
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 sm:py-6 px-2 sm:px-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-blue-100 flex items-center justify-center transition-transform duration-500 transform hover:scale-110">
                    <svg className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium">Drag and drop a photo here</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">or click to browse files</p>
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-xs sm:text-sm rounded-lg sm:rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 mt-3 sm:mt-4 flex items-center justify-center"
          >
            <span>Continue to Assessment</span>
            <svg className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-green-50 text-green-700 rounded-lg sm:rounded-xl flex items-center border border-green-200 shadow-md animate-fadeIn">
              <div className="bg-green-100 rounded-full p-0.5 sm:p-1 mr-2 sm:mr-3">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <span className="font-medium text-xs sm:text-sm">Success!</span>
                <p className="text-xs sm:text-sm text-green-600">Information submitted successfully. Redirecting...</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
