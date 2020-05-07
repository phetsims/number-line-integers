/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;