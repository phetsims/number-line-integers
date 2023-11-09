// Copyright 2023, University of Colorado Boulder
/**
 * This file instantiates the Africa Conservative region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import RegionAndCultureHeadshotIcon from '../../../../joist/js/preferences/RegionAndCultureHeadshotIcon.js';
import girlHiking_png from '../../../images/africa-conservative/girlHiking_png.js';
import girlInAir_png from '../../../images/africa-conservative/girlInAir_png.js';
import girlInWater_png from '../../../images/africa-conservative/girlInWater_png.js';
import exploreScreenHome_png from '../../../images/africa/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/africa/exploreScreenNav_png.js';
import { AFRICA_MODEST_QUERY_VALUE } from '../../common/NLIQueryParameters.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetAfricaConservative = new ExplorerCharacterSet(
  NumberLineIntegersStrings.africaModestStringProperty,
  new RegionAndCultureHeadshotIcon( girlHiking_png, {
    xClipAreaStart: 15
  } ),
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  AFRICA_MODEST_QUERY_VALUE
);

export default ExplorerCharacterSetAfricaConservative;