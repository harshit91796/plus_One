// export default function getCroppedImg(imageSrc, crop) {
//   const canvas = document.createElement('canvas');
//   const ctx = canvas.getContext('2d');

//   const image = new Image();
//   image.src = imageSrc;

//   return new Promise((resolve) => {
//     image.onload = () => {
//       canvas.width = crop.width;
//       canvas.height = crop.height;
//       ctx.drawImage(
//         image,
//         crop.x,
//         crop.y,
//         crop.width,
//         crop.height,
//         0,
//         0,
//         crop.width,
//         crop.height
//       );
//       resolve(canvas.toDataURL('image/jpeg'));
//     };
//   });
// }
