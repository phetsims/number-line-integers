// Copyright 2023, University of Colorado Boulder
/**
 * Explorer images contains an array of character sets, each representing a different region/culture.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ExplorerCharacterSetAfrica from '../../explore/view/ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from '../../explore/view/ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from '../../explore/view/ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from '../../explore/view/ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetMulti from '../../explore/view/ExplorerCharacterSetMulti.js';
import ExplorerCharacterSetOceania from '../../explore/view/ExplorerCharacterSetOceania.js';
import ExplorerCharacterSetUSA from '../../explore/view/ExplorerCharacterSetUSA.js';
import numberLineIntegers from '../../numberLineIntegers.js';


const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerCharacterSetMulti,
    ExplorerCharacterSetAfrica,
    ExplorerCharacterSetAfricaModest,
    ExplorerCharacterSetAsia,
    ExplorerCharacterSetLatinAmerica,
    ExplorerCharacterSetOceania,
    ExplorerCharacterSetUSA
  ]
};

numberLineIntegers.register( 'ExplorerImages', ExplorerImages );
export default ExplorerImages;