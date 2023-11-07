/* eslint-disable */
import asyncLoader from '../../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;