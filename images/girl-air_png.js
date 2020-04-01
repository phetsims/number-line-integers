/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
