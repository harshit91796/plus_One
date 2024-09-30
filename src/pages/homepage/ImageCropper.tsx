// import React, { useState, useCallback } from 'react';
// import Cropper from 'react-easy-crop';
// import getCroppedImg from './cropImage'; // Utility function to get the cropped image

// const ImageCropper = ({ imageSrc, onCropComplete, onClose }) => {
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);

//   const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
//     onCropComplete(croppedAreaPixels);
//   }, [onCropComplete]);

//   return (
//     <div className="cropper">
//       <Cropper
//         image={imageSrc}
//         crop={crop}
//         zoom={zoom}
//         aspect={4 / 3}
//         onCropChange={setCrop}
//         onZoomChange={setZoom}
//         onCropComplete={onCropCompleteHandler}
//       />
//       <button onClick={onClose}>Cancel</button>
//       <button onClick={() => onCropCompleteHandler()}>Done</button>
//     </div>
//   );
// };

// export default ImageCropper;
