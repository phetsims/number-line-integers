// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { LATIN_AMERICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import latinAmericaBoyHiking_png from '../../../../images/localized/latinAmericaBoyHiking_png.js';
import latinAmericaBoyInAir_png from '../../../../images/localized/latinAmericaBoyInAir_png.js';
import latinAmericaBoyInWater_png from '../../../../images/localized/latinAmericaBoyInWater_png.js';
import latinAmericaExploreScreenHome_png from '../../../../images/localized/latinAmericaExploreScreenHome_png.js';
import latinAmericaExploreScreenNav_png from '../../../../images/localized/latinAmericaExploreScreenNav_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalLatinAmerica = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.latinAmericaStringProperty,
  latinAmericaBoyInAir_png,
  latinAmericaBoyHiking_png,
  latinAmericaBoyInWater_png,
  latinAmericaExploreScreenHome_png,
  latinAmericaExploreScreenNav_png,
  LATIN_AMERICA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalLatinAmerica;