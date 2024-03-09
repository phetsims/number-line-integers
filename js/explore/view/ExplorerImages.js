// Copyright 2023-2024, University of Colorado Boulder
/**
 * Explorer images contains an array of portrayals, each representing a different region/culture.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import ExplorerPortrayalAfrica from './portrayal/ExplorerPortrayalAfrica.js';
import ExplorerPortrayalAfricaModest from './portrayal/ExplorerPortrayalAfricaModest.js';
import ExplorerPortrayalAsia from './portrayal/ExplorerPortrayalAsia.js';
import ExplorerPortrayalLatinAmerica from './portrayal/ExplorerPortrayalLatinAmerica.js';
import ExplorerPortrayalRandom from './portrayal/ExplorerPortrayalRandom.js';
import ExplorerPortrayalOceania from './portrayal/ExplorerPortrayalOceania.js';
import ExplorerPortrayalUSA from './portrayal/ExplorerPortrayalUSA.js';
import numberLineIntegers from '../../numberLineIntegers.js';


const ExplorerImages = {
  EXPLORER_CHARACTER_SETS: [
    ExplorerPortrayalRandom,
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