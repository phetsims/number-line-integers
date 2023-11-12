// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the Oceania region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import RegionAndCultureHeadshotIcon from '../../../../joist/js/preferences/RegionAndCultureHeadshotIcon.js';
import exploreScreenHome_png from '../../../images/oceania/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/oceania/exploreScreenNav_png.js';
import girlHiking_png from '../../../images/oceania/girlHiking_png.js';
import girlInAir_png from '../../../images/oceania/girlInAir_png.js';
import girlInWater_png from '../../../images/oceania/girlInWater_png.js';
import { OCEANIA_QUERY_VALUE } from '../../common/NLIQueryParameters.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetOceania = new ExplorerCharacterSet(
  NumberLineIntegersStrings.oceaniaStringProperty,
  new RegionAndCultureHeadshotIcon( girlHiking_png, {
    xClipAreaStart: 12
  } ),
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  OCEANIA_QUERY_VALUE
);

export default ExplorerCharacterSetOceania;