// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import { LATIN_AMERICA_REGION_AND_CULTURE_ID } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import boyHiking_png from '../../../images/latin-america/boyHiking_png.js';
import boyInAir_png from '../../../images/latin-america/boyInAir_png.js';
import boyInWater_png from '../../../images/latin-america/boyInWater_png.js';
import exploreScreenHome_png from '../../../images/latin-america/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/latin-america/exploreScreenNav_png.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfrica = new ExplorerCharacterSet(
    NumberLineIntegersStrings.latinAmericaStringProperty,
    boyInAir_png,
    boyHiking_png,
    boyInWater_png,
    exploreScreenHome_png,
    exploreScreenNav_png,
    LATIN_AMERICA_REGION_AND_CULTURE_ID
);

export default ExplorerCharacterSetAfrica;