// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Oceania region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { OCEANIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreScreenHome_png from '../../../../images/oceania/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../../images/oceania/exploreScreenNav_png.js';
import girlHiking_png from '../../../../images/oceania/girlHiking_png.js';
import girlInAir_png from '../../../../images/oceania/girlInAir_png.js';
import girlInWater_png from '../../../../images/oceania/girlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalOceania = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.oceaniaStringProperty,
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  OCEANIA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalOceania;