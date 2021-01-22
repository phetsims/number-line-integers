/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;