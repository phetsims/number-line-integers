// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import { ASIA_QUERY_VALUE } from '../../../../joist/js/preferences/RegionAndCulturePortrayal.js';
import exploreScreenHome_png from '../../../images/asia/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/asia/exploreScreenNav_png.js';
import girlHiking_png from '../../../images/asia/girlHiking_png.js';
import girlInAir_png from '../../../images/asia/girlInAir_png.js';
import girlInWater_png from '../../../images/asia/girlInWater_png.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfrica = new ExplorerCharacterSet(
    NumberLineIntegersStrings.asiaStringProperty,
    girlInAir_png,
    girlHiking_png,
    girlInWater_png,
    exploreScreenHome_png,
    exploreScreenNav_png,
    ASIA_QUERY_VALUE
);

export default ExplorerCharacterSetAfrica;