// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { USA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreScreenHome_png from '../../../../images/usa/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../../images/usa/exploreScreenNav_png.js';
import girlHiking_png from '../../../../images/usa/girlHiking_png.js';
import girlInAir_png from '../../../../images/usa/girlInAir_png.js';
import girlInWater_png from '../../../../images/usa/girlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalUSA = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.unitedStatesOfAmericaStringProperty,
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  USA_REGION_AND_CULTURE_ID
);


export default ExplorerPortrayalUSA;