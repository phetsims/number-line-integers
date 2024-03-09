// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa Modest region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { AFRICA_MODEST_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import africaModestExploreScreenHome_png from '../../../../images/localized/africaModestExploreScreenHome_png.js';
import africaModestExploreScreenNav_png from '../../../../images/localized/africaModestExploreScreenNav_png.js';
import africaModestGirlHiking_png from '../../../../images/localized/africaModestGirlHiking_png.js';
import africaModestGirlInAir_png from '../../../../images/localized/africaModestGirlInAir_png.js';
import africaModestGirlInWater_png from '../../../../images/localized/africaModestGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAfricaModest = new ExplorerPortrayal(
    JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaModestStringProperty,
    africaModestGirlInAir_png,
    africaModestGirlHiking_png,
    africaModestGirlInWater_png,
    africaModestExploreScreenHome_png,
    africaModestExploreScreenNav_png,
    AFRICA_MODEST_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAfricaModest;