/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;