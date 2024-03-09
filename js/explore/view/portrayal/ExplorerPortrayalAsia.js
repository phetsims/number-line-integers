// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.js';
import { ASIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import asiaExploreScreenHome_png from '../../../../images/localized/asiaExploreScreenHome_png.js';
import asiaExploreScreenNav_png from '../../../../images/localized/asiaExploreScreenNav_png.js';
import asiaGirlHiking_png from '../../../../images/localized/asiaGirlHiking_png.js';
import asiaGirlInAir_png from '../../../../images/localized/asiaGirlInAir_png.js';
import asiaGirlInWater_png from '../../../../images/localized/asiaGirlInWater_png.js';
import ExplorerPortrayal from './ExplorerPortrayal.js';


const ExplorerPortrayalAsia = new ExplorerPortrayal(
    JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.asiaStringProperty,
    asiaGirlInAir_png,
    asiaGirlHiking_png,
    asiaGirlInWater_png,
    asiaExploreScreenHome_png,
    asiaExploreScreenNav_png,
    ASIA_REGION_AND_CULTURE_ID
);

export default ExplorerPortrayalAsia;