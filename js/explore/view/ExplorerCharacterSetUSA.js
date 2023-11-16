// Copyright 2023, University of Colorado Boulder

/**
 * This file instantiates the USA region and culture portrayals.
 *
 * @author Marla Schulz (PhET Interactive Simulations)
 *
 */


import dotRandom from '../../../../dot/js/dotRandom.js';
import RegionAndCultureHeadshotIcon from '../../../../joist/js/preferences/RegionAndCultureHeadshotIcon.js';
import { GridBox } from '../../../../scenery/js/imports.js';
import exploreScreenHome_png from '../../../images/usa/exploreScreenHome_png.js';
import exploreScreenNav_png from '../../../images/usa/exploreScreenNav_png.js';
import girlHiking_png from '../../../images/usa/girlHiking_png.js';
import girlInAir_png from '../../../images/usa/girlInAir_png.js';
import girlInWater_png from '../../../images/usa/girlInWater_png.js';
import { USA_QUERY_VALUE } from '../../common/NLIQueryParameters.js';
import NumberLineIntegersStrings from '../../NumberLineIntegersStrings.js';
import ExplorerCharacterSet from './ExplorerCharacterSet.js';
import ExplorerCharacterSetAfrica from './ExplorerCharacterSetAfrica.js';
import ExplorerCharacterSetAfricaModest from './ExplorerCharacterSetAfricaModest.js';
import ExplorerCharacterSetAsia from './ExplorerCharacterSetAsia.js';
import ExplorerCharacterSetLatinAmerica from './ExplorerCharacterSetLatinAmerica.js';
import ExplorerCharacterSetOceania from './ExplorerCharacterSetOceania.js';

const USA_HEADSHOT_ICON = new GridBox( {
  rows: [
    [ new RegionAndCultureHeadshotIcon( girlHiking_png, {
      xClipAreaStart: 12,
      scale: 0.5
    } ),
      new RegionAndCultureHeadshotIcon( ExplorerCharacterSetAfrica.hiking, {
        xClipAreaStart: 12,
        scale: 0.5
      } ) ],
    [ new RegionAndCultureHeadshotIcon( ExplorerCharacterSetAsia.hiking, {
      xClipAreaStart: 12,
      scale: 0.5
    } ),
      new RegionAndCultureHeadshotIcon( ExplorerCharacterSetLatinAmerica.hiking, {
        xClipAreaStart: 12,
        scale: 0.5
      } ) ] ]
} );

const phetGirlCharacterSet = new ExplorerCharacterSet(
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

const RANDOM_USA_CHARACTER_SET = dotRandom.sample( [
  phetGirlCharacterSet,
  ExplorerCharacterSetAfrica,
  ExplorerCharacterSetAfricaModest,
  ExplorerCharacterSetAsia,
  ExplorerCharacterSetLatinAmerica,
  ExplorerCharacterSetOceania
] );

const ExplorerCharacterSetUSA = new ExplorerCharacterSet(
  NumberLineIntegersStrings.unitedStatesOfAmericaStringProperty,
  USA_HEADSHOT_ICON,
  RANDOM_USA_CHARACTER_SET.flying,
  RANDOM_USA_CHARACTER_SET.hiking,
  RANDOM_USA_CHARACTER_SET.swimming,
  RANDOM_USA_CHARACTER_SET.screenHomeIcon,
  RANDOM_USA_CHARACTER_SET.screenNavIcon,
  USA_QUERY_VALUE
);


export default ExplorerCharacterSetUSA;