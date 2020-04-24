/* eslint-disable */
import SimLauncher from '../../joist/js/SimLauncher.js';
const image = new Image();
const unlock = SimLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;