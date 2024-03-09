// Copyright 2023-2024, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { AFRICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import africaExploreScreenHome_png from '../../../../images/africa/africaExploreScreenHome_png.js';
import africaExploreScreenNav_png from '../../../../images/africa/africaExploreScreenNav_png.js';
import africaGirlHiking_png from '../../../../images/africa/africaGirlHiking_png.js';
import africaGirlInAir_png from '../../../../images/africa/africaGirlInAir_png.js';
import africaGirlInWater_png from '../../../../images/africa/africaGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAfrica = new ExplorerPortrayal(
    JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaStringProperty,
    africaGirlInAir_png,
    africaGirlHiking_png,
    africaGirlInWater_png,
    africaExploreScreenHome_png,
    africaExploreScreenNav_png,
    AFRICA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAfrica;