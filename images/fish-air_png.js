/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
