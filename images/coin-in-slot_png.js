/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;