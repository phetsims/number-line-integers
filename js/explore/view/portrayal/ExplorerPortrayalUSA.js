// Copyright 2023-2024, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { USA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import usaExploreScreenHome_png from '../../../../images/localized/usaExploreScreenHome_png.js';
import usaExploreScreenNav_png from '../../../../images/localized/usaExploreScreenNav_png.js';
import usaGirlHiking_png from '../../../../images/localized/usaGirlHiking_png.js';
import usaGirlInAir_png from '../../../../images/localized/usaGirlInAir_png.js';
import usaGirlInWater_png from '../../../../images/localized/usaGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalUSA = new ExplorerPortrayal(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.unitedStatesOfAmericaStringProperty,
  usaGirlInAir_png,
  usaGirlHiking_png,
  usaGirlInWater_png,
  usaExploreScreenHome_png,
  usaExploreScreenNav_png,
  USA_REGION_AND_CULTURE_ID
);


export default ExplorerPortrayalUSA;