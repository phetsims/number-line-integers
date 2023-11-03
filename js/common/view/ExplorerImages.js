// Copyright 2023, University of Colorado Boulder
/**
 * Explorer images contains an array of character sets, each representing a different region/culture.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ExplorerCharacterSetAfrica from '../../explore/view/ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetUSA from '../../explore/view/ExplorerCharacterSetUSA.js';
import numberLineIntegers from '../../numberLineIntegers.js';


const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerCharacterSetUSA,
    ExplorerCharacterSetAfrica
  ]
};

numberLineIntegers.register( 'ExplorerImages', ExplorerImages );
export default ExplorerImages;