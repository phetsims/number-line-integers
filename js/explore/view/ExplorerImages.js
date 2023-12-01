// Copyright 2023, University of Colorado Boulder
/**
 * Explorer images contains an array of character sets, each representing a different region/culture.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ExplorerPortrayalAfrica from './characterSets/ExplorerPortrayalAfrica.js';
import ExplorerPortrayalAfricaModest from './characterSets/ExplorerPortrayalAfricaModest.js';
import ExplorerPortrayalAsia from './characterSets/ExplorerPortrayalAsia.js';
import ExplorerPortrayalLatinAmerica from './characterSets/ExplorerPortrayalLatinAmerica.js';
import ExplorerPortrayalMulticultural from './characterSets/ExplorerPortrayalMulticultural.js';
import ExplorerPortrayalOceania from './characterSets/ExplorerPortrayalOceania.js';
import ExplorerPortrayalUSA from './characterSets/ExplorerPortrayalUSA.js';
import numberLineIntegers from '../../numberLineIntegers.js';


const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerPortrayalMulticultural,
    ExplorerPortrayalAfrica,
    ExplorerPortrayalAfricaModest,
    ExplorerPortrayalAsia,
    ExplorerPortrayalLatinAmerica,
    ExplorerPortrayalOceania,
    ExplorerPortrayalUSA
  ]
};

numberLineIntegers.register( 'ExplorerImages', ExplorerImages );
export default ExplorerImages;