// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../../joist/js/JoistStrings.ts';
import { ASIA_REGION_AND_CULTURE_ID } from '../../../../../joist/js/preferences/RegionAndCulturePortrayal.ts';
import exploreScreenHome_png from '../../../../images/asia/exploreScreenHome_png.ts';
import exploreScreenNav_png from '../../../../images/asia/exploreScreenNav_png.ts';
import girlHiking_png from '../../../../images/asia/girlHiking_png.ts';
import girlInAir_png from '../../../../images/asia/girlInAir_png.ts';
import girlInWater_png from '../../../../images/asia/girlInWater_png.ts';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAsia = new ExplorerCharacterSet(
    JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.asiaStringProperty,
    girlInAir_png,
    girlHiking_png,
    girlInWater_png,
    exploreScreenHome_png,
    exploreScreenNav_png,
    ASIA_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetAsia;