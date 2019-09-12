// Copyright 2019, University of Colorado Boulder

/**
 * sceneIconFactory is a singleton that has methods for creating the icons used in the radio buttons that select the
 * various scenes.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/scenes/model/NLIScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PiggyBankNode = require( 'NUMBER_LINE_INTEGERS/scenes/view/PiggyBankNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  // constants
  const ICON_SIZE = new Dimension2( 30, 30 );

  // images
  const birdInAir = require( 'image!NUMBER_LINE_INTEGERS/bird-air.png' );
  const piggyBankWithFlowers = require( 'image!NUMBER_LINE_INTEGERS/piggy-bank-with-flowers.png' );

  // elevation scene icon
  const elevationSceneIconNode = new Image( birdInAir );
  const xScale = ICON_SIZE.width / elevationSceneIconNode.width;
  const yScale = ICON_SIZE.height / elevationSceneIconNode.height;
  elevationSceneIconNode.setScaleMagnitude( xScale, yScale );

  // bank scene icon
  const piggyBankNode = new PiggyBankNode( piggyBankWithFlowers );
  piggyBankNode.fill = 'green';
  piggyBankNode.setScaleMagnitude( ICON_SIZE.width / piggyBankNode.width );

  // temperature scene icon
  const temperatureSceneIconRoot = new Rectangle( 0, 0, ICON_SIZE.width, ICON_SIZE.height, { fill: 'white' } );
  const thermometerNode = new ThermometerNode( 0, 1, new NumberProperty( 0.5 ) );
  thermometerNode.setScaleMagnitude( ICON_SIZE.height / thermometerNode.height );
  thermometerNode.center = temperatureSceneIconRoot.center;
  temperatureSceneIconRoot.addChild( thermometerNode );

  // map of values to icons
  const sceneIdToIconsMap = new Map();
  sceneIdToIconsMap.set( NLIScene.ELEVATION, elevationSceneIconNode );
  sceneIdToIconsMap.set( NLIScene.BANK, piggyBankNode );
  sceneIdToIconsMap.set( NLIScene.TEMPERATURE, temperatureSceneIconRoot );

  const sceneIconFactory = {

    /**
     * generate and return an icon for the specified scene ID
     * @param {SceneID} sceneIdentifier
     * @returns {Node}
     * @public
     */
    getIcon: sceneIdentifier => {
      return sceneIdToIconsMap.get( sceneIdentifier );
    }
  };

  return numberLineIntegers.register( 'sceneIconFactory', sceneIconFactory );
} );