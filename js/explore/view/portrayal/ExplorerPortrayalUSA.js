// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import usaExploreScreenHome_png from '../../../../images/usa/usaExploreScreenHome_png.js';
import usaExploreScreenNav_png from '../../../../images/usa/usaExploreScreenNav_png.js';
import usaGirlHiking_png from '../../../../images/usa/usaGirlHiking_png.js';
import usaGirlInAir_png from '../../../../images/usa/usaGirlInAir_png.js';
import usaGirlInWater_png from '../../../../images/usa/usaGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalUSA = new ExplorerPortrayal(
  'usa',
  usaGirlInAir_png,
  usaGirlHiking_png,
  usaGirlInWater_png,
  usaExploreScreenHome_png,
  usaExploreScreenNav_png
);


export default ExplorerPortrayalUSA;