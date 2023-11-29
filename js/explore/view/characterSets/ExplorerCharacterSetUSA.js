// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */

import JoistStrings from '../../../../../joist/js/JoistStrings.ts';
import { USA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.ts';
import exploreScreenHome_png from '../../../../images/usa/exploreScreenHome_png.ts';
import exploreScreenNav_png from '../../../../images/usa/exploreScreenNav_png.ts';
import girlHiking_png from '../../../../images/usa/girlHiking_png.ts';
import girlInAir_png from '../../../../images/usa/girlInAir_png.ts';
import girlInWater_png from '../../../../images/usa/girlInWater_png.ts';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
  JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.unitedStatesOfAmericaStringProperty,
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  USA_REGION_AND_CULTURE_ID
);


export default ExplorerCharacterSetUSA;