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
  const NLIScene = require( 'NUMBER_LINE_INTEGERS/explore/model/NLIScene' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const numberLineIntegers = require( 'NUMBER_LINE_INTEGERS/numberLineIntegers' );
  const PiggyBankNode = require( 'NUMBER_LINE_INTEGERS/explore/view/PiggyBankNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const ThermometerNode = require( 'SCENERY_PHET/ThermometerNode' );

  // constants
  const ICON_SIZE = new Dimension2( 38, 38 );

  // images
  const birdInAir = require( 'image!NUMBER_LINE_INTEGERS/bird-air.png' );

  // map of values to icons, populated lazily to avoid race conditions with image loading
  const sceneIdToIconsMap = new Map();

  const sceneIconFactory = {

    /**
     * generate and return an icon for the specified scene ID
     * @param {SceneID} sceneIdentifier
     * @returns {Node}
     * @public
     */
    getIcon: sceneIdentifier => {

      // The icon nodes are not created until the first time they are needed, which prevents race conditions with image
      // loading.
      if ( !sceneIdToIconsMap.get( sceneIdentifier ) ) {
        if ( sceneIdentifier === NLIScene.ELEVATION ) {
          const elevationSceneIconNode = new Image( birdInAir );
          const xScale = ICON_SIZE.width / elevationSceneIconNode.width;
          const yScale = ICON_SIZE.height / elevationSceneIconNode.height;
          elevationSceneIconNode.setScaleMagnitude( xScale, yScale );
          sceneIdToIconsMap.set( NLIScene.ELEVATION, elevationSceneIconNode );
        }
        else if ( sceneIdentifier === NLIScene.BANK ) {
          const piggyBankNode = new PiggyBankNode( { decorationType: 'lightning' } );
          piggyBankNode.fill = '#1fb493';
          piggyBankNode.setScaleMagnitude( ICON_SIZE.width / piggyBankNode.width );
          sceneIdToIconsMap.set( NLIScene.BANK, piggyBankNode );
        }
        else if ( sceneIdentifier === NLIScene.TEMPERATURE ) {
          const temperatureSceneIconRoot = new Rectangle( 0, 0, ICON_SIZE.width, ICON_SIZE.height, { fill: 'white' } );
          const thermometerNode = new ThermometerNode( 0, 1, new NumberProperty( 0.5 ) );
          thermometerNode.setScaleMagnitude( ICON_SIZE.height / thermometerNode.height );
          thermometerNode.center = temperatureSceneIconRoot.center;
          temperatureSceneIconRoot.addChild( thermometerNode );
          sceneIdToIconsMap.set( NLIScene.TEMPERATURE, temperatureSceneIconRoot );
        }
      }

      // return the icon instance
      return sceneIdToIconsMap.get( sceneIdentifier );
    }
  };

  return numberLineIntegers.register( 'sceneIconFactory', sceneIconFactory );
} );