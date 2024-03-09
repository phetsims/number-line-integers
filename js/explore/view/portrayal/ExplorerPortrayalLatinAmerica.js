// Copyright 2023-2024, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { LATIN_AMERICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import latinAmericaBoyHiking_png from '../../../../images/latinAmerica/latinAmericaBoyHiking_png.js';
import latinAmericaBoyInAir_png from '../../../../images/latinAmerica/latinAmericaBoyInAir_png.js';
import latinAmericaBoyInWater_png from '../../../../images/latinAmerica/latinAmericaBoyInWater_png.js';
import latinAmericaExploreScreenHome_png from '../../../../images/latinAmerica/latinAmericaExploreScreenHome_png.js';
import latinAmericaExploreScreenNav_png from '../../../../images/latinAmerica/latinAmericaExploreScreenNav_png.js';
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