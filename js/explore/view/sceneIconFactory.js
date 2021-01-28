// Copyright 2019-2020, University of Colorado Boulder

/**
 * sceneIconFactory is a singleton that has methods for creating the icons used in the radio buttons that select the
 * various scenes.
 *
 * @author John Blanco (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import ThermometerNode from '../../../../scenery-phet/js/ThermometerNode.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import birdInAir from '../../../../number-line-common/images/bird-air_png.js';
import numberLineIntegers from '../../numberLineIntegers.js';
import NLIScene from '../model/NLIScene.js';
import PiggyBankDecoration from '../../../../number-line-common/js/explore/model/PiggyBankDecoration.js';
import PiggyBankNode from '../../../../number-line-common/js/explore/view/PiggyBankNode.js';

// constants
const ICON_SIZE = new Dimension2( 38, 38 );


// map of values to icons, populated lazily to avoid race conditions with image loading
const sceneIdToIconsMap = new Map();

const sceneIconFactory = {

  /**
   * Generate and return an icon for the specified scene ID.
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
        const piggyBankNode = new PiggyBankNode( { decorationType: PiggyBankDecoration.LIGHTNING } );
        piggyBankNode.fill = '#1fb493';
        piggyBankNode.setScaleMagnitude( ICON_SIZE.width / piggyBankNode.width );
        sceneIdToIconsMap.set( NLIScene.BANK, piggyBankNode );
      }
      else if ( sceneIdentifier === NLIScene.TEMPERATURE ) {
        const temperatureSceneIconRoot = new Rectangle( 0, 0, ICON_SIZE.width, ICON_SIZE.height, {
          fill: Color.TRANSPARENT
        } );
        const thermometerNode = new ThermometerNode( 0, 1, new NumberProperty( 0.5 ) );
        thermometerNode.setScaleMagnitude( ICON_SIZE.height / thermometerNode.height );
        thermometerNode.center = temperatureSceneIconRoot.center;
        temperatureSceneIconRoot.addChild( thermometerNode );
        sceneIdToIconsMap.set( NLIScene.TEMPERATURE, temperatureSceneIconRoot );
      }
    }

    // Return the icon instance.
    return sceneIdToIconsMap.get( sceneIdentifier );
  }
};

numberLineIntegers.register( 'sceneIconFactory', sceneIconFactory );
export default sceneIconFactory;
