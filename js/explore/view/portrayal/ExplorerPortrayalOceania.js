// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Oceania region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { OCEANIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import oceaniaExploreScreenHome_png from '../../../../images/localized/oceaniaExploreScreenHome_png.js';
import oceaniaExploreScreenNav_png from '../../../../images/localized/oceaniaExploreScreenNav_png.js';
import oceaniaGirlHiking_png from '../../../../images/localized/oceaniaGirlHiking_png.js';
import oceaniaGirlInAir_png from '../../../../images/localized/oceaniaGirlInAir_png.js';
import oceaniaGirlInWater_png from '../../../../images/localized/oceaniaGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalOceania = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.oceaniaStringProperty,
  oceaniaGirlInAir_png,
  oceaniaGirlHiking_png,
  oceaniaGirlInWater_png,
  oceaniaExploreScreenHome_png,
  oceaniaExploreScreenNav_png,
  OCEANIA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalOceania;