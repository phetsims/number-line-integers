// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import RegionAndCultureHeadshotIcon from '../../../../joist/js/preferences/RegionAndCultureHeadshotIcon.js';
import exploreScreenHome_png from '../../../images/usa/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/usa/exploreScreenNav_png.js';
import girlHiking_png from '../../../images/usa/girlHiking_png.js';
import girlInAir_png from '../../../images/usa/girlInAir_png.js';
import girlInWater_png from '../../../images/usa/girlInWater_png.js';
import { USA_QUERY_VALUE } from '../../common/NLIQueryParameters.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';


const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
  NumberLineIntegersStrings.unitedStatesOfAmericaStringProperty,
  new RegionAndCultureHeadshotIcon( girlHiking_png, {
    xClipAreaStart: 12
  } ),
  girlInAir_png,
  girlHiking_png,
  girlInWater_png,
  exploreScreenHome_png,
  exploreScreenNav_png,
  USA_QUERY_VALUE
);

export default ExplorerCharacterSetUSA;