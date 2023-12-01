// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { AFRICA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreScreenHome_png from '../../../../images/africa/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../../images/africa/exploreScreenNav_png.js';
import girlHiking_png from '../../../../images/africa/girlHiking_png.js';
import girlInAir_png from '../../../../images/africa/girlInAir_png.js';
import girlInWater_png from '../../../../images/africa/girlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAfrica = new ExplorerPortrayal(
    JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaStringProperty,
    girlInAir_png,
    girlHiking_png,
    girlInWater_png,
    exploreScreenHome_png,
    exploreScreenNav_png,
    AFRICA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAfrica;