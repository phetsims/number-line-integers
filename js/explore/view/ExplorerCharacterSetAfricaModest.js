// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa Conservative region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import JoistStrings from '../../../../joist/js/JoistStrings.js';
import { AFRICA_MODEST_REGION_AND_CULTURE_ID } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreScreenHome_png from '../../../images/africa-conservative/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/africa-conservative/exploreScreenNav_png.js';
import girlHiking_png from '../../../images/africa-conservative/girlHiking_png.js';
import girlInAir_png from '../../../images/africa-conservative/girlInAir_png.js';
import girlInWater_png from '../../../images/africa-conservative/girlInWater_png.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfricaModest = new ExplorerCharacterSet(
    JoistStrings.preferences.tabs.localization.regionAndCulture.portrayalSets.africaModestStringProperty,
    girlInAir_png,
    girlHiking_png,
    girlInWater_png,
    exploreScreenHome_png,
    exploreScreenNav_png,
    AFRICA_MODEST_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetAfricaModest;