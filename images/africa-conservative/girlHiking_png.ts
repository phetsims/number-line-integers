/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;