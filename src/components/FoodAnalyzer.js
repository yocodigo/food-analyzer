import React, { useState } from 'react';
import './FoodAnalyzer.css';

const FoodAnalyzerApp = () => {
  // State variables
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [foodName, setFoodName] = useState('');
  
  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResults(null);
      setError(null);
    }
  };
  
  // Handle manual food name input
  const handleFoodNameChange = (e) => {
    setFoodName(e.target.value);
  };
  
  // Mock API call to analyze food (in a real app, this would call a food database API)
  const analyzeFoodItem = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you would use image recognition API or send the image to a backend
      // For this demo, we'll use the manually entered food name or a mock response
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let foodData;
      // Mock database with a few food items
      const foodDatabase = {
        'apple': {
          name: 'Apple',
          consumable: true,
          safeToEat: true,
          description: 'Fresh fruit, edible raw.',
          nutrition: {
            calories: 95,
            protein: '0.5g',
            carbs: '25g',
            fat: '0.3g',
            fiber: '4g',
            vitamins: ['Vitamin C', 'Vitamin A']
          }
        },
        'raw chicken': {
          name: 'Raw Chicken',
          consumable: true,
          safeToEat: false,
          description: 'Uncooked poultry, must be thoroughly cooked before consumption.',
          warning: 'Risk of salmonella if consumed raw.',
          nutrition: {
            calories: 120,
            protein: '25g',
            carbs: '0g',
            fat: '3g',
            fiber: '0g',
            vitamins: ['Vitamin B6', 'Niacin']
          }
        },
        'mushroom': {
          name: 'Wild Mushroom (Unidentified)',
          consumable: false,
          safeToEat: false,
          description: 'Unidentified wild mushroom species.',
          warning: 'Never consume unidentified mushrooms. Some species can be deadly.',
          nutrition: null
        }
      };
      
      const searchTerm = foodName.toLowerCase();
      
      // Check if food exists in our mock database
      if (searchTerm in foodDatabase) {
        foodData = foodDatabase[searchTerm];
      } else if (searchTerm) {
        // Generic response for unknown foods
        foodData = {
          name: foodName,
          consumable: 'Unknown',
          safeToEat: 'Unknown',
          description: 'Item not found in database. Please consult with a food safety expert.',
          warning: 'Cannot determine safety of unidentified food items.',
          nutrition: null
        };
      } else {
        // If no food name is provided
        throw new Error('Please enter a food name or take a photo of the food item');
      }
      
      setResults(foodData);
    } catch (err) {
      setError(err.message || 'Failed to analyze food item');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="analyzer-container">
      <div className="text-center">
        <h1 className="title">Food Analyzer</h1>
        <p className="subtitle">Identify food items and check if they're safe to consume</p>
      </div>
      
      {/* Food Image Input */}
      <div className="form-section">
        <label className="form-label">Upload Food Image</label>
        <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
          {previewUrl ? (
            <img src={previewUrl} alt="Food preview" className="preview-image" />
          ) : (
            <div className="text-center">
              <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p className="upload-text">Click to upload or take a photo</p>
            </div>
          )}
          <input 
            id="file-input" 
            type="file" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange}
            className="hidden" 
          />
        </div>
      </div>
      
      {/* Manual Food Name Input */}
      <div className="form-section">
        <label htmlFor="food-name" className="form-label">
          Or Enter Food Name
        </label>
        <input
          type="text"
          id="food-name"
          className="text-input"
          placeholder="e.g., Apple, Raw Chicken, Mushroom"
          value={foodName}
          onChange={handleFoodNameChange}
        />
      </div>
      
      {/* Analyze Button */}
      <button
        onClick={analyzeFoodItem}
        disabled={loading}
        className="button"
      >
        {loading ? 'Analyzing...' : 'Analyze Food Item'}
      </button>
      
      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* Results Display */}
      {results && (
        <div className="results-container">
          <h2 className="result-title">{results.name}</h2>
          
          <div className="status-grid">
            <div className="status-box">
              <span className="status-label">Consumable:</span>
              <div className={`status-value ${results.consumable === true ? 'green-text' : results.consumable === false ? 'red-text' : 'yellow-text'}`}>
                {results.consumable === true ? 'Yes' : results.consumable === false ? 'No' : 'Unknown'}
              </div>
            </div>
            
            <div className="status-box">
              <span className="status-label">Safe to Eat:</span>
              <div className={`status-value ${results.safeToEat === true ? 'green-text' : results.safeToEat === false ? 'red-text' : 'yellow-text'}`}>
                {results.safeToEat === true ? 'Yes' : results.safeToEat === false ? 'No' : 'Unknown'}
              </div>
            </div>
          </div>
          
          <div className="description">
            <h3 className="section-title">Description:</h3>
            <p>{results.description}</p>
          </div>
          
          {results.warning && (
            <div className="warning-box">
              <strong>Warning:</strong> {results.warning}
            </div>
          )}
          
          {results.nutrition && (
            <div>
              <h3 className="section-title">Nutritional Information:</h3>
              <div className="nutrition-box">
                <div className="nutrition-grid">
                  <div className="nutrition-item">
                    <span className="nutrition-label">Calories:</span>
                    <span className="nutrition-value">{results.nutrition.calories}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Protein:</span>
                    <span className="nutrition-value">{results.nutrition.protein}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Carbs:</span>
                    <span className="nutrition-value">{results.nutrition.carbs}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fat:</span>
                    <span className="nutrition-value">{results.nutrition.fat}</span>
                  </div>
                  <div className="nutrition-item">
                    <span className="nutrition-label">Fiber:</span>
                    <span className="nutrition-value">{results.nutrition.fiber}</span>
                  </div>
                </div>
                
                {results.nutrition.vitamins && results.nutrition.vitamins.length > 0 && (
                  <div className="vitamins-row">
                    <span className="nutrition-label">Vitamins & Minerals:</span>
                    <span className="nutrition-value">{results.nutrition.vitamins.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {!results.nutrition && results.consumable !== false && (
            <div className="italic-text">
              Nutritional information not available for this item.
            </div>
          )}
        </div>
      )}
      
      <div className="disclaimer">
        <p>Disclaimer: This app is for demonstration purposes only. Always consult official food safety resources and professionals for food safety concerns.</p>
      </div>
    </div>
  );
};

export default FoodAnalyzerApp;