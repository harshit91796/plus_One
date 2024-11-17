import React, { useState } from 'react';
import './createPost.css';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowBack, 
  AddPhotoAlternate, 
  Delete, 
  Edit,
  DragIndicator,
  Male,
  Female
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
import { Tooltip } from '@mui/material';

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { uploadImagesToSupabase } from '../../utils/service';
import { fetchPlaceSuggestions } from '../../utils/opencage';
import { createPost } from '../../Api';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

interface ImageWithDescription {
  file: File;
  preview: string;
  description: string;
  id: string;
}

interface BudgetTier {
  name: string;
  range: {
    min: number;
    max: number;
  };
  description: string;
}

const BUDGET_TIERS: BudgetTier[] = [
  {
    name: 'Backpacker',
    range: { min: 2000, max: 5000 },
    description: 'Budget-friendly, basic accommodations and local transport'
  },
  {
    name: 'Comfort Seeker',
    range: { min: 5000, max: 12000 },
    description: 'Mid-range hotels and comfortable travel options'
  },
  {
    name: 'Luxury Explorer',
    range: { min: 12000, max: 50000 },
    description: 'Premium resorts and exclusive experiences'
  }
];

interface NewPost {
  title: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
    formatted: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  peopleNeeded: number;
  maleNeeded: number;
  femaleNeeded: number;
  budget: {
    min: number;
    max: number;
    tier: string | 'custom';
  };
  transportation: string;
  difficulty: string;
  checkpoints: string[];
  images: ImageWithDescription[];
}

interface SortableImageProps {
  image: ImageWithDescription;
  index: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  // editingImageId: string | null;
  // onDescriptionChange: (id: string, description: string) => void;
}

const ImageDescriptionModal = ({ 
  image, 
  onClose, 
  onSave 
}: { 
  image: ImageWithDescription; 
  onClose: () => void; 
  onSave: (description: string) => void; 
}) => {
  const [description, setDescription] = useState(image.description);

console.log("images array", image);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Image Description</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="modal-image">
            <img src={image.preview} alt="Preview" />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description..."
            rows={4}
            autoFocus
          />
        </div>
        
        <div className="modal-footer">
          <button 
            className="secondary-button" 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="primary-button" 
            onClick={() => {
              onSave(description);
              onClose();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const SortableImage = ({ 
  image, 
  index, 
  onEdit, 
  onDelete,
  // editingImageId,
  // onDescriptionChange
}: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // console.log("updatedPost",newPost);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`image-item ${isDragging ? 'dragging' : ''}`}
    >
      <div className="image-preview">
        <img src={image.preview} alt={`Preview ${index + 1}`} />
        <div className="image-actions">
          <div 
            {...attributes}
            {...listeners}
            className="drag-handle"
            title="Drag to reorder"
          >
            <DragIndicator />
          </div>
          <Tooltip title="Edit description">
            <Edit 
              onClick={(e) => {
                e.stopPropagation();
                onEdit(image.id);
              }}
            />
          </Tooltip>
          <Tooltip title="Remove image">
            <Delete 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(image.id);
              }}
            />
          </Tooltip>
        </div>
        {index === 0 && <div className="cover-badge">Cover</div>}
        {image.description && (
          <div className="description-indicator">
            <Edit fontSize="small" />
          </div>
        )}
      </div>
    </div>
  );
};

const CreatePost = () => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state: RootState) => state.theme.darkMode);

  const [currentStep, setCurrentStep] = useState(1);
  const [newPost, setNewPost] = useState<NewPost>({
    title: '',
    description: '',
    location: {
      type: '',
      coordinates: [],
      formatted: ''
    },
    date: '',
    startTime: '',
    endTime: '',
    peopleNeeded: 1,
    maleNeeded: 0,
    femaleNeeded: 0,
    budget: {
      min: 0,
      max: 0,
      tier: 'custom'
    },
    transportation: '',
    difficulty: 'moderate',
    
    checkpoints: [],
    images: []
  });
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);
  const [locationSuggestionsCheckpoints, setLocationSuggestionsCheckpoints] = useState<any[]>([]);
  const [checkpointInput, setCheckpointInput] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setNewPost({ ...newPost, location: {
      type: '',
      coordinates: [],
      formatted: query
    } });
    if (query.length > 2) {
      const suggestions = await fetchPlaceSuggestions(query);
      setLocationSuggestions(suggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationChangeCheckpoints = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCheckpointInput(query);
    
    if (query.length > 2) {
      const suggestions = await fetchPlaceSuggestions(query);
      setLocationSuggestionsCheckpoints(suggestions);
    } else {
      setLocationSuggestionsCheckpoints([]);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setNewPost({ 
      ...newPost,
      location : {
        type: 'Point',
        coordinates: [suggestion.coordinates.lng, suggestion.coordinates.lat],
        formatted: suggestion.formatted
      }
    });
    setLocationSuggestions([]);
  };

  const handleSuggestionCheckpointsClick = (suggestion: any) => {
    const newCheckpoint = suggestion.formatted;
    setNewPost(prev => ({
      ...prev,
      checkpoints: [...prev.checkpoints, newCheckpoint]
    }));
    setCheckpointInput('');
    setLocationSuggestionsCheckpoints([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      
      try {
        const processedImages = await Promise.all(
          files.map(async (file) => {
            // Compress image
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true
            };
            
            const compressedFile = await imageCompression(file, options);
            
            return {
              file: compressedFile,
              preview: URL.createObjectURL(compressedFile),
              description: '',
              id: Math.random().toString(36).substr(2, 9)
            };
          })
        );

        setNewPost(prev => ({
          ...prev,
          images: [...prev.images, ...processedImages]
        }));

      } catch (error) {
        console.error('Error processing images:', error);
        toast.error('Error processing images');
      }
    }
  };

  const handleImageDescriptionChange = (id: string, description: string) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === id ? { ...img, description } : img
      )
    }));
  };

  const handleImageDelete = (id: string) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setNewPost((prev) => {
        const oldIndex = prev.images.findIndex((img) => img.id === active.id);
        const newIndex = prev.images.findIndex((img) => img.id === over.id);

        return {
          ...prev,
          images: arrayMove(prev.images, oldIndex, newIndex),
        };
      });
    }
  };

  const handleSubmit = async () => {
    console.log("newPost.images", newPost.images ,newPost);
    try {
      // Basic validation
      // if (!newPost.title || !newPost.description || !newPost.location || 
      //     !newPost.date || !newPost.startTime || !newPost.endTime) {
      //   toast.error('Please fill in all required fields');
      //   return;
      // }

      if (newPost.images.length === 0) {
        toast.error('Please add at least one image');
        return;
      }

      // Show loading state
      toast.info('Uploading images...', { autoClose: false });

      // Upload images and get URLs
      const imageUrls = await uploadImagesToSupabase(newPost.images);

      if (!imageUrls) {
        toast.error('Failed to upload images. Please try again.');
        return;
      }

      // Update post data with image URLs
      const finalPostData = {
        ...newPost,
        image: newPost.images.map((img, index) => ({
          imageUrl: imageUrls[index],
          imageDescription: img.description
        }))
      };

      // console.log('Final post data:', finalPostData);
      

      // Here you can proceed with creating the post
      const response = await createPost(finalPostData);
      if (response.success) {
        toast.success('Post created successfully!');
        navigate('/');
      } else {
        toast.error('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('Failed to create post. Please try again.');
    }
  };

  return (
    <>
      <div className={`create-post-page ${isDarkMode ? 'dark-mode' : ''}`}>
        <div className="header">
          <ArrowBack onClick={() => navigate(-1)} />
          <h1>Create New Blunt</h1>
        </div>

        <div className="stepper">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            Basic Info
          </div>
          <div className={`blunt-details step ${currentStep >= 2 ? 'active' : ''}`}>
            Blunt Details
          </div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            Images
          </div>
        </div>

        {currentStep === 1 && (
          <div className="step-content">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Give your trip a catchy title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                placeholder="Describe your trip plan, activities, and what to expect"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={newPost.location.formatted}
                onChange={handleLocationChange}
                placeholder="Where is this trip taking place?"
                required
              />
              {locationSuggestions.length > 0 && (
                <div className="location-suggestions">
                  {locationSuggestions.map((suggestion, index) => (
                    <div key={index} onClick={() => handleSuggestionClick(suggestion)} className="suggestion">{suggestion.formatted}</div>
                  ))}
                </div>
              )}
              {/* Location suggestions component */}
            </div>

            {/* add checkpoint component */}

            <div className="form-group">
              <label>Checkpoints</label>
              <div className="checkpoints-container">
                {newPost.checkpoints.map((checkpoint, index) => (
                  <div key={index} className="checkpoint-item">
                    <input
                      type="text"
                      value={checkpoint}
                      readOnly
                      placeholder="Enter checkpoint location"
                    />
                    <button
                      type="button"
                      className="remove-checkpoint"
                      onClick={() => {
                        const updatedCheckpoints = newPost.checkpoints.filter((_, i) => i !== index);
                        setNewPost(prev => ({ ...prev, checkpoints: updatedCheckpoints }));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="checkpoint-item">
                  <input
                    type="text"
                    value={checkpointInput}
                    onChange={handleLocationChangeCheckpoints}
                    placeholder="Enter new checkpoint location"
                  />
                  {locationSuggestionsCheckpoints.length > 0 && (
                    <div className="location-suggestions">
                      {locationSuggestionsCheckpoints.map((suggestion, index) => (
                        <div 
                          key={index} 
                          onClick={() => handleSuggestionCheckpointsClick(suggestion)} 
                          className="suggestion"
                        >
                          {suggestion.formatted}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <div className="date-time-group">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newPost.date}
                  onChange={(e) => setNewPost({ ...newPost, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={newPost.startTime}
                  onChange={(e) => setNewPost({ ...newPost, startTime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={newPost.endTime}
                  onChange={(e) => setNewPost({ ...newPost, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="people-needed-group">
              <div className="form-group">
                <label>Total People Needed</label>
                <input
                  type="number"
                  min="1"
                  value={newPost.peopleNeeded}
                  onChange={(e) => setNewPost({ ...newPost, peopleNeeded: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="gender-distribution">
                <div className="form-group">
                  <label><Male /> Males Needed</label>
                  <input
                    type="number"
                    min="0"
                    value={newPost.maleNeeded}
                    onChange={(e) => setNewPost({ ...newPost, maleNeeded: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label><Female /> Females Needed</label>
                  <input
                    type="number"
                    min="0"
                    value={newPost.femaleNeeded}
                    onChange={(e) => setNewPost({ ...newPost, femaleNeeded: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="form-group budget-section">
              <label>Budget Type</label>
              <div className="budget-tiers">
                {BUDGET_TIERS.map((tier) => (
                  <div
                    key={tier.name}
                    className={`budget-tier ${newPost.budget.tier === tier.name ? 'selected' : ''}`}
                    onClick={() => setNewPost({
                      ...newPost,
                      budget: {
                        min: tier.range.min,
                        max: tier.range.max,
                        tier: tier.name
                      }
                    })}
                  >
                    <h3>{tier.name}</h3>
                    <span className="price">₹{tier.range.min.toLocaleString()} - ₹{tier.range.max.toLocaleString()}</span>
                    <span className="description">{tier.description}</span>
                  </div>
                ))}
                
                <div 
                  className={`budget-tier custom ${newPost.budget.tier === 'custom' ? 'selected' : ''}`}
                  onClick={() => setNewPost({
                    ...newPost,
                    budget: { ...newPost.budget, tier: 'custom' }
                  })}
                >
                  <h3>Custom Range</h3>
                  {newPost.budget.tier === 'custom' && (
                    <div className="custom-budget-inputs">
                      <input
                        type="number"
                        min="0"
                        value={newPost.budget.min}
                        onChange={(e) => setNewPost({
                          ...newPost,
                          budget: { ...newPost.budget, min: parseInt(e.target.value) }
                        })}
                        placeholder="Min"
                      />
                      <span>to</span>
                      <input
                        type="number"
                        min="0"
                        value={newPost.budget.max}
                        onChange={(e) => setNewPost({
                          ...newPost,
                          budget: { ...newPost.budget, max: parseInt(e.target.value) }
                        })}
                        placeholder="Max"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Transportation</label>
              <select
                value={newPost.transportation}
                onChange={(e) => setNewPost({ ...newPost, transportation: e.target.value })}
              >
                <option value="">Select transportation</option>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="flight">Flight</option>
                <option value="publictransport">Public Transport</option>
                <option value="Hitchhike">Hitchhike</option>
              </select>
            </div>

          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <div className="image-upload-section">
              <div className="upload-button">
                <label htmlFor="image-upload">
                  <AddPhotoAlternate />
                  <span>Add Images</span>
                </label>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={newPost.images.map(img => img.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="images-grid">
                    {newPost.images.map((image, index) => (
                      <SortableImage
                        key={image.id}
                        image={image}
                        index={index}
                        onEdit={setEditingImageId}
                        onDelete={handleImageDelete}
                        // editingImageId={editingImageId}
                        // onDescriptionChange={handleImageDescriptionChange}
                      />
                       
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        )}

        <div className="form-actions">
          {currentStep > 1 && (
            <button
              type="button"
              className="secondary-button"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Previous
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              className="primary-button"
              onClick={() => setCurrentStep(prev => prev + 1)}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="primary-button"
              onClick={handleSubmit}
            >
              Create Blunt
            </button>
          )}
        </div>
      </div>

      {editingImageId && (
        <ImageDescriptionModal
          image={newPost.images.find(img => img.id === editingImageId)!}
          onClose={() => setEditingImageId(null)}
          onSave={(description) => {
            handleImageDescriptionChange(editingImageId, description);
            setEditingImageId(null);
          }}
        />
      )}
    </>
  );

}

export default CreatePost;
