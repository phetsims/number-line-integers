// Copyright 2023, University of Colorado Boulder
/**
 * Explorer images contains an array of character sets, each representing a different region/culture.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ExplorerCharacterSetAfrica from './characterSets/ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from './characterSets/ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from './characterSets/ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from './characterSets/ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetMulticultural from './characterSets/ExplorerCharacterSetMulticultural.js';
import ExplorerCharacterSetOceania from './characterSets/ExplorerCharacterSetOceania.js';
import ExplorerCharacterSetUSA from './characterSets/ExplorerCharacterSetUSA.js';
import numberLineIntegers from '../../numberLineIntegers.js';


const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerCharacterSetMulticultural,
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