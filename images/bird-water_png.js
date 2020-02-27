/* eslint-disable */
var img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
